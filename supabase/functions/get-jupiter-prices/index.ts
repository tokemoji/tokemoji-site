import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
    const url = new URL(req.url);
    const ids = url.searchParams.get("ids");

    if (!ids) {
      return new Response(
        JSON.stringify({ error: "Missing ids parameter" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const jupRes = await fetch(
      `https://api.jup.ag/price/v2?ids=${encodeURIComponent(ids)}`,
    );

    if (!jupRes.ok) {
      const dsRes = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(ids)}`,
      );

      if (!dsRes.ok) {
        throw new Error("Both Jupiter and DexScreener failed");
      }

      const dsData = await dsRes.json();
      const pairs = dsData.pairs || [];
      const data: Record<string, { price: string }> = {};

      for (const pair of pairs) {
        if (pair.baseToken?.address && pair.priceUsd) {
          if (!data[pair.baseToken.address]) {
            data[pair.baseToken.address] = { price: pair.priceUsd };
          }
        }
      }

      return new Response(
        JSON.stringify({ data, source: "dexscreener" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=2",
          },
        },
      );
    }

    const jupData = await jupRes.json();

    return new Response(
      JSON.stringify({ data: jupData.data || {}, source: "jupiter" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=2",
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
