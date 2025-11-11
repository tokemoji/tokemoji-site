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
      .eq("is_active", true)
      .order("display_order");

    if (tokensError) throw tokensError;

    const tokensWithPrices = await Promise.all(
      tokens.map(async (token: any) => {
        const { data: latestTick } = await supabase
          .from("price_ticks")
          .select("price_usd, timestamp")
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

        const { data: price1hAgo } = await supabase
          .from("price_aggregates_1m")
          .select("close")
          .eq("token_id", token.id)
          .gte("bucket_start", new Date(Date.now() - 3600000).toISOString())
          .order("bucket_start", { ascending: true })
          .limit(1)
          .maybeSingle();

        const currentPrice = latestTick ? parseFloat(latestTick.price_usd) : null;
        const marketCap = currentPrice ? currentPrice * token.total_supply : null;

        const change24h = currentPrice && price24hAgo
          ? ((currentPrice - parseFloat(price24hAgo.close)) / parseFloat(price24hAgo.close)) * 100
          : null;

        const change1h = currentPrice && price1hAgo
          ? ((currentPrice - parseFloat(price1hAgo.close)) / parseFloat(price1hAgo.close)) * 100
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
          last_updated: latestTick?.timestamp || null,
        };
      })
    );

    return new Response(JSON.stringify(tokensWithPrices), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3",
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
