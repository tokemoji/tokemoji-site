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
    const url = new URL(req.url);
    const tokenId = url.searchParams.get("token_id");
    const range = url.searchParams.get("range") || "24h";

    if (!tokenId) {
      return new Response(
        JSON.stringify({ error: "token_id parameter is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let data: any[] = [];
    let tableName = "";
    let timeAgo: Date;

    switch (range) {
      case "1h":
        tableName = "price_ticks";
        timeAgo = new Date(Date.now() - 3600000);
        break;
      case "24h":
        tableName = "price_aggregates_1m";
        timeAgo = new Date(Date.now() - 86400000);
        break;
      case "7d":
        tableName = "price_aggregates_hourly";
        timeAgo = new Date(Date.now() - 7 * 86400000);
        break;
      case "30d":
        tableName = "price_aggregates_daily";
        timeAgo = new Date(Date.now() - 30 * 86400000);
        break;
      case "all":
        tableName = "price_aggregates_daily";
        timeAgo = new Date(0);
        break;
      default:
        tableName = "price_aggregates_1m";
        timeAgo = new Date(Date.now() - 86400000);
    }

    let query;
    if (tableName === "price_ticks") {
      query = supabase
        .from(tableName)
        .select("price_usd, timestamp")
        .eq("token_id", tokenId)
        .gte("timestamp", timeAgo.toISOString())
        .order("timestamp", { ascending: true });
    } else {
      query = supabase
        .from(tableName)
        .select("open, high, low, close, bucket_start")
        .eq("token_id", tokenId)
        .gte("bucket_start", timeAgo.toISOString())
        .order("bucket_start", { ascending: true });
    }

    const { data: chartData, error } = await query;

    if (error) throw error;

    const formattedData = chartData?.map((item: any) => {
      if (tableName === "price_ticks") {
        return {
          timestamp: item.timestamp,
          price: parseFloat(item.price_usd),
        };
      } else {
        return {
          timestamp: item.bucket_start,
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
        };
      }
    }) || [];

    return new Response(
      JSON.stringify({
        range,
        data: formattedData,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=5",
        },
      }
    );
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
