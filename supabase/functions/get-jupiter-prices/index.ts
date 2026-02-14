import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function fetchJupiter(
  ids: string,
): Promise<Record<string, { price: string }>> {
  const res = await fetch(
    `https://api.jup.ag/price/v2?ids=${encodeURIComponent(ids)}`,
  );
  if (!res.ok) return {};
  const json = await res.json();
  return json.data || {};
}

async function fetchDexScreener(
  ids: string,
): Promise<Record<string, { price: string }>> {
  const res = await fetch(
    `https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(ids)}`,
  );
  if (!res.ok) return {};
  const json = await res.json();
  const pairs = json.pairs || [];
  const data: Record<string, { price: string }> = {};
  for (const pair of pairs) {
    if (pair.baseToken?.address && pair.priceUsd) {
      if (!data[pair.baseToken.address]) {
        data[pair.baseToken.address] = { price: pair.priceUsd };
      }
    }
  }
  return data;
}

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

    const [jupData, dsData] = await Promise.all([
      fetchJupiter(ids).catch(() => ({})),
      fetchDexScreener(ids).catch(() => ({})),
    ]);

    const merged: Record<string, { price: string }> = {};
    const sources: string[] = [];

    for (const [mint, val] of Object.entries(dsData)) {
      if (val?.price) {
        merged[mint] = val;
      }
    }
    if (Object.keys(dsData).length > 0) sources.push("dexscreener");

    for (const [mint, val] of Object.entries(jupData)) {
      if (val?.price) {
        merged[mint] = val;
      }
    }
    if (Object.keys(jupData).length > 0) sources.push("jupiter");

    return new Response(
      JSON.stringify({ data: merged, sources }),
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
