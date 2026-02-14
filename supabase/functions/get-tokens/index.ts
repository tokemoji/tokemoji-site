import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const STALE_THRESHOLD_MS = 10_000;

async function fetchPricesDexScreener(
  mints: string[]
): Promise<Record<string, number>> {
  const prices: Record<string, number> = {};
  const batchSize = 30;
  for (let i = 0; i < mints.length; i += batchSize) {
    const batch = mints.slice(i, i + batchSize);
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

    const tokenIds = tokens.map((t: any) => t.id);
    const mintAddresses = tokens.map((t: any) => t.mint_address);

    const { data: latestTick } = await supabaseRead
      .from("price_ticks")
      .select("timestamp")
      .order("timestamp", { ascending: false })
      .limit(1)
      .maybeSingle();

    const lastTickAge = latestTick
      ? Date.now() - new Date(latestTick.timestamp).getTime()
      : Infinity;

    let livePrices: Record<string, number> = {};

    if (lastTickAge > STALE_THRESHOLD_MS) {
      livePrices = await fetchPricesDexScreener(mintAddresses);

      const ticks = tokens
        .filter(
          (t: any) => livePrices[t.mint_address] && livePrices[t.mint_address] > 0
        )
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

    const { data: recentTicks } = await supabaseRead
      .from("price_ticks")
      .select("token_id, price_usd, timestamp")
      .in("token_id", tokenIds)
      .order("timestamp", { ascending: false })
      .limit(tokenIds.length * 3);

    const latestByToken: Record<
      string,
      { price_usd: string; timestamp: string }
    > = {};
    for (const tick of recentTicks || []) {
      if (!latestByToken[tick.token_id]) {
        latestByToken[tick.token_id] = tick;
      }
    }

    const { data: earliestTicks } = await supabaseRead
      .from("price_ticks")
      .select("token_id, price_usd, timestamp")
      .in("token_id", tokenIds)
      .order("timestamp", { ascending: true })
      .limit(tokenIds.length * 3);

    const earliestByToken: Record<string, { price_usd: string }> = {};
    for (const tick of earliestTicks || []) {
      if (!earliestByToken[tick.token_id]) {
        earliestByToken[tick.token_id] = tick;
      }
    }

    const tokensWithPrices = tokens.map((token: any) => {
      const currentPrice =
        livePrices[token.mint_address] ||
        (latestByToken[token.id]
          ? parseFloat(latestByToken[token.id].price_usd)
          : null);

      const marketCap = currentPrice
        ? currentPrice * token.total_supply
        : null;

      const earliest = earliestByToken[token.id];
      let change24h: number | null = null;
      if (currentPrice && earliest) {
        const oldPrice = parseFloat(earliest.price_usd);
        if (oldPrice > 0) {
          change24h = ((currentPrice - oldPrice) / oldPrice) * 100;
        }
      }

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
        change_1h: change24h,
        last_updated: latestByToken[token.id]?.timestamp || new Date().toISOString(),
      };
    });

    return new Response(JSON.stringify(tokensWithPrices), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3",
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
