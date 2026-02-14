import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

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

    const tokenIds = tokens.map((t: any) => t.id);

    const { data: latestTicks } = await supabase
      .from("price_ticks")
      .select("token_id, price_usd")
      .in("token_id", tokenIds)
      .order("timestamp", { ascending: false })
      .limit(tokenIds.length * 3);

    const latestByToken: Record<string, number> = {};
    for (const tick of latestTicks || []) {
      if (!latestByToken[tick.token_id]) {
        latestByToken[tick.token_id] = parseFloat(tick.price_usd);
      }
    }

    const { data: earliestTicks } = await supabase
      .from("price_ticks")
      .select("token_id, price_usd")
      .in("token_id", tokenIds)
      .order("timestamp", { ascending: true })
      .limit(tokenIds.length * 3);

    const earliestByToken: Record<string, number> = {};
    for (const tick of earliestTicks || []) {
      if (!earliestByToken[tick.token_id]) {
        earliestByToken[tick.token_id] = parseFloat(tick.price_usd);
      }
    }

    const tokensWithMetrics = tokens.map((token: any) => {
      const currentPrice = latestByToken[token.id] || 0;
      const marketCap = currentPrice * token.total_supply;

      let change = 0;
      const oldPrice = earliestByToken[token.id];
      if (currentPrice && oldPrice && oldPrice > 0) {
        change = ((currentPrice - oldPrice) / oldPrice) * 100;
      }

      return {
        id: token.id,
        symbol: token.symbol,
        emoji_type: token.emoji_type,
        icon_path: token.icon_path,
        display_color: token.display_color,
        market_cap: marketCap,
        change_24h: change,
      };
    });

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
