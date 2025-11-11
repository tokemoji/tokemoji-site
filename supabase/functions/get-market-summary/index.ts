import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: tokens, error: tokensError } = await supabase
      .from("tokens")
      .select("*")
      .eq("is_active", true);

    if (tokensError) throw tokensError;

    const tokensWithMetrics = await Promise.all(
      tokens.map(async (token: any) => {
        const { data: latestTick } = await supabase
          .from("price_ticks")
          .select("price_usd")
          .eq("token_id", token.id)
          .order("timestamp", { ascending: false })
          .limit(1)
          .maybeSingle();

        const { data: price24hAgo } = await supabase
          .from("price_aggregates_1m")
          .select("close")
          .eq("token_id", token.id)
          .gte("bucket_start", new Date(Date.now() - 86400000).toISOString())
          .order("bucket_start", { ascending: true })
          .limit(1)
          .maybeSingle();

        const currentPrice = latestTick ? parseFloat(latestTick.price_usd) : 0;
        const marketCap = currentPrice * token.total_supply;

        const change24h = currentPrice && price24hAgo
          ? ((currentPrice - parseFloat(price24hAgo.close)) / parseFloat(price24hAgo.close)) * 100
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
      (sum, token) => sum + token.market_cap,
      0
    );

    const dominant = tokensWithMetrics.reduce((prev, current) =>
      current.market_cap > prev.market_cap ? current : prev
    );

    const dominancePercentage = totalMarketCap > 0
      ? (dominant.market_cap / totalMarketCap) * 100
      : 0;

    const sortedByGain = [...tokensWithMetrics].sort(
      (a, b) => b.change_24h - a.change_24h
    );
    const topGainers = sortedByGain.slice(0, 3);
    const topLosers = sortedByGain.slice(-3).reverse();

    const findTokenByEmoji = (type: string) =>
      tokensWithMetrics.find((t) => t.emoji_type === type);

    const greed = findTokenByEmoji("GREED");
    const fear = findTokenByEmoji("FEAR");
    const good = findTokenByEmoji("GOOD");
    const evil = findTokenByEmoji("EVIL");
    const love = findTokenByEmoji("LOVE");
    const hate = findTokenByEmoji("HATE") || findTokenByEmoji("MAD");

    const greedFearComparison = greed && fear
      ? {
          greed_cap: greed.market_cap,
          fear_cap: fear.market_cap,
          greed_percentage:
            (greed.market_cap / (greed.market_cap + fear.market_cap)) * 100,
        }
      : null;

    const goodEvilComparison = good && evil
      ? {
          good_cap: good.market_cap,
          evil_cap: evil.market_cap,
          good_percentage:
            (good.market_cap / (good.market_cap + evil.market_cap)) * 100,
        }
      : null;

    const loveHateComparison = love && hate
      ? {
          love_cap: love.market_cap,
          hate_cap: hate.market_cap,
          love_percentage:
            (love.market_cap / (love.market_cap + hate.market_cap)) * 100,
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
        greed_vs_fear: greedFearComparison,
        good_vs_evil: goodEvilComparison,
        love_vs_hate: loveHateComparison,
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

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});