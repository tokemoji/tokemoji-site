import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const STALE_THRESHOLD_MS = 8_000;

async function fetchLivePrices(
  mintAddresses: string[]
): Promise<Record<string, number>> {
  const prices: Record<string, number> = {};
  const batchSize = 5;

  for (let i = 0; i < mintAddresses.length; i += batchSize) {
    const batch = mintAddresses.slice(i, i + batchSize);
    try {
      const res = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${batch.join(",")}`
      );
      if (res.ok) {
        const json = await res.json();
        for (const pair of json.pairs || []) {
          if (pair.baseToken?.address && pair.priceUsd) {
            const addr = pair.baseToken.address;
            if (!prices[addr]) {
              prices[addr] = parseFloat(pair.priceUsd);
            }
          }
        }
      }
    } catch (e) {
      console.error("DexScreener batch error:", e);
    }
  }

  return prices;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseRead = createClient(supabaseUrl, anonKey);
    const supabaseWrite = createClient(supabaseUrl, serviceKey);

    const { data: tokens, error: tokensError } = await supabaseRead
      .from("tokens")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (tokensError) throw tokensError;
    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: latestTick } = await supabaseRead
      .from("price_ticks")
      .select("timestamp")
      .order("timestamp", { ascending: false })
      .limit(1)
      .maybeSingle();

    const lastTickAge = latestTick
      ? Date.now() - new Date(latestTick.timestamp).getTime()
      : Infinity;

    const isStale = lastTickAge > STALE_THRESHOLD_MS;

    let livePrices: Record<string, number> = {};

    if (isStale) {
      const mintAddresses = tokens.map((t: any) => t.mint_address);
      livePrices = await fetchLivePrices(mintAddresses);

      const ticks = tokens
        .filter((t: any) => livePrices[t.mint_address])
        .map((t: any) => ({
          token_id: t.id,
          price_usd: livePrices[t.mint_address],
          source: "dexscreener",
          timestamp: new Date().toISOString(),
        }));

      if (ticks.length > 0) {
        const { error: insertError } = await supabaseWrite
          .from("price_ticks")
          .insert(ticks);

        if (insertError) {
          console.error("Error writing price ticks:", insertError);
        }
      }
    }

    const tokensWithPrices = await Promise.all(
      tokens.map(async (token: any) => {
        let currentPrice = livePrices[token.mint_address] || null;

        if (!currentPrice) {
          const { data: tick } = await supabaseRead
            .from("price_ticks")
            .select("price_usd, timestamp")
            .eq("token_id", token.id)
            .order("timestamp", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (tick) {
            currentPrice = parseFloat(tick.price_usd);
          }
        }

        const { data: prevTick } = await supabaseRead
          .from("price_ticks")
          .select("price_usd")
          .eq("token_id", token.id)
          .lt(
            "timestamp",
            new Date(Date.now() - 3600000).toISOString()
          )
          .order("timestamp", { ascending: false })
          .limit(1)
          .maybeSingle();

        const marketCap = currentPrice
          ? currentPrice * token.total_supply
          : null;

        const change1h =
          currentPrice && prevTick
            ? ((currentPrice - parseFloat(prevTick.price_usd)) /
                parseFloat(prevTick.price_usd)) *
              100
            : null;

        const { data: dayOldTick } = await supabaseRead
          .from("price_ticks")
          .select("price_usd")
          .eq("token_id", token.id)
          .lt(
            "timestamp",
            new Date(Date.now() - 86400000).toISOString()
          )
          .order("timestamp", { ascending: false })
          .limit(1)
          .maybeSingle();

        const change24h =
          currentPrice && dayOldTick
            ? ((currentPrice - parseFloat(dayOldTick.price_usd)) /
                parseFloat(dayOldTick.price_usd)) *
              100
            : null;

        return {
          id: token.id,
          symbol: token.symbol,
          name: token.name,
          emoji_type: token.emoji_type,
          icon_path: token.icon_path,
          display_color: token.display_color,
          price_usd: currentPrice,
          market_cap: marketCap,
          change_24h: change24h,
          change_1h: change1h,
          last_updated: new Date().toISOString(),
        };
      })
    );

    return new Response(JSON.stringify(tokensWithPrices), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=5",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
