import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const STALE_THRESHOLD_MS = 30_000;

async function fetchLivePrices(
  mintAddresses: string[]
): Promise<Record<string, number>> {
  const prices: Record<string, number> = {};
  try {
    const res = await fetch(
      `https://api.jup.ag/price/v2?ids=${mintAddresses.join(",")}`
    );
    if (!res.ok) throw new Error(`Jupiter API ${res.status}`);
    const json = await res.json();
    for (const addr of mintAddresses) {
      const entry = json.data?.[addr];
      if (entry?.price) {
        prices[addr] = parseFloat(entry.price);
      }
    }
  } catch (e) {
    console.error("Jupiter API error:", e);
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
    const supabase = createClient(supabaseUrl, anonKey);

    const { data: tokens, error: tokensError } = await supabase
      .from("tokens")
      .select("*")
      .eq("is_active", true);

    if (tokensError) throw tokensError;

    const { data: latestTick } = await supabase
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
      livePrices = await fetchLivePrices(
        tokens.map((t: any) => t.mint_address)
      );
    }

    const tokensWithMetrics = await Promise.all(
      tokens.map(async (token: any) => {
        let currentPrice = livePrices[token.mint_address] || null;

        if (!currentPrice) {
          const { data: tick } = await supabase
            .from("price_ticks")
            .select("price_usd")
            .eq("token_id", token.id)
            .order("timestamp", { ascending: false })
            .limit(1)
            .maybeSingle();
          currentPrice = tick ? parseFloat(tick.price_usd) : 0;
        }

        const { data: price24hAgo } = await supabase
          .from("price_ticks")
          .select("price_usd")
          .eq("token_id", token.id)
          .lt("timestamp", new Date(Date.now() - 86400000).toISOString())
          .order("timestamp", { ascending: false })
          .limit(1)
          .maybeSingle();

        const marketCap = currentPrice * token.total_supply;
        const change24h =
          currentPrice && price24hAgo
            ? ((currentPrice - parseFloat(price24hAgo.price_usd)) /
                parseFloat(price24hAgo.price_usd)) *
              100
            : 0;

        return {
          id: token.id,
          symbol: token.symbol,
          emoji_type: token.emoji_type,
          icon_path: token.icon_path,
          display_color: token.display_color,
          market_cap: marketCap,
          change_24h: change24h,
        };
      })
    );

    const totalMarketCap = tokensWithMetrics.reduce(
      (sum, t) => sum + t.market_cap,
      0
    );

    const dominant = tokensWithMetrics.reduce((prev, cur) =>
      cur.market_cap > prev.market_cap ? cur : prev
    );

    const dominancePercentage =
      totalMarketCap > 0
        ? (dominant.market_cap / totalMarketCap) * 100
        : 0;

    const sortedByGain = [...tokensWithMetrics].sort(
      (a, b) => b.change_24h - a.change_24h
    );
    const topGainers = sortedByGain.slice(0, 3);
    const topLosers = sortedByGain.slice(-3).reverse();

    const findByEmoji = (type: string) =>
      tokensWithMetrics.find((t) => t.emoji_type === type);

    const greed = findByEmoji("GREED");
    const fear = findByEmoji("FEAR");
    const good = findByEmoji("GOOD");
    const evil = findByEmoji("EVIL");
    const love = findByEmoji("LOVE");
    const hate = findByEmoji("HATE") || findByEmoji("MAD");

    const makeComparison = (a: any, b: any) =>
      a && b
        ? {
            [`${a.emoji_type.toLowerCase()}_cap`]: a.market_cap,
            [`${b.emoji_type.toLowerCase()}_cap`]: b.market_cap,
            [`${a.emoji_type.toLowerCase()}_percentage`]:
              (a.market_cap / (a.market_cap + b.market_cap)) * 100,
          }
        : null;

    const summary = {
      total_market_cap: totalMarketCap,
      dominant_token: {
        symbol: dominant.symbol,
        emoji_type: dominant.emoji_type,
        icon_path: dominant.icon_path,
        display_color: dominant.display_color,
        dominance_percentage: dominancePercentage,
      },
      top_gainers: topGainers.map((t) => ({
        symbol: t.symbol,
        emoji_type: t.emoji_type,
        icon_path: t.icon_path,
        display_color: t.display_color,
        change_24h: t.change_24h,
      })),
      top_losers: topLosers.map((t) => ({
        symbol: t.symbol,
        emoji_type: t.emoji_type,
        icon_path: t.icon_path,
        display_color: t.display_color,
        change_24h: t.change_24h,
      })),
      comparisons: {
        greed_vs_fear: makeComparison(greed, fear),
        good_vs_evil: makeComparison(good, evil),
        love_vs_hate: makeComparison(love, hate),
      },
    };

    return new Response(JSON.stringify(summary), {
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
