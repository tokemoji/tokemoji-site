import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

let cachedPrice = 0;
let lastFetchTime = 0;
const CACHE_TTL_MS = 10000;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const now = Date.now();

    if (cachedPrice > 0 && now - lastFetchTime < CACHE_TTL_MS) {
      return new Response(
        JSON.stringify({ solana: { usd: cachedPrice } }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=10",
          },
        },
      );
    }

    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
    );

    if (!res.ok) {
      if (cachedPrice > 0) {
        return new Response(
          JSON.stringify({ solana: { usd: cachedPrice }, cached: true }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          },
        );
      }
      throw new Error(`CoinGecko returned ${res.status}`);
    }

    const data = await res.json();
    if (data.solana?.usd) {
      cachedPrice = data.solana.usd;
      lastFetchTime = now;
    }

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=10",
      },
    });
  } catch (error) {
    if (cachedPrice > 0) {
      return new Response(
        JSON.stringify({ solana: { usd: cachedPrice }, cached: true }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
