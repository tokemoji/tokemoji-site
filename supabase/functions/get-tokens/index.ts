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
      .eq("is_active", true)
      .order("display_order");

    if (tokensError) throw tokensError;
    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tokenIds = tokens.map((t: any) => t.id);

    const { data: recentTicks } = await supabase
      .from("price_ticks")
      .select("token_id, price_usd, timestamp")
      .in("token_id", tokenIds)
      .order("timestamp", { ascending: false })
      .limit(tokenIds.length * 3);

    const latestByToken: Record<string, { price_usd: string; timestamp: string }> = {};
    for (const tick of recentTicks || []) {
      if (!latestByToken[tick.token_id]) {
        latestByToken[tick.token_id] = tick;
      }
    }

    const tokensWithPrices = tokens.map((token: any) => {
      const latest = latestByToken[token.id];
      const currentPrice = latest ? parseFloat(latest.price_usd) : null;
      const marketCap = currentPrice ? currentPrice * token.total_supply : null;

      return {
        id: token.id,
        symbol: token.symbol,
        name: token.name,
        emoji_type: token.emoji_type,
        icon_path: token.icon_path,
        display_color: token.display_color,
        price_usd: currentPrice,
        market_cap: marketCap,
        change_24h: null,
        change_1h: null,
        last_updated: latest?.timestamp || new Date().toISOString(),
      };
    });

    return new Response(JSON.stringify(tokensWithPrices), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
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
