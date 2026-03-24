import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { destination, budget, accommodation_type, currency } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const currencyMap: Record<string, string> = {
      "INR (₹)": "₹", "USD ($)": "$", "EUR (€)": "€", "GBP (£)": "£",
    };
    const symbol = currencyMap[currency] || "$";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `Generate 4 realistic hotel options as JSON array. Each hotel: { "name": "Real Hotel Name", "city": "City, Country", "price": number (per night in ${symbol}), "rating": number (3.5-5.0), "room_type": "standard|deluxe|suite|villa", "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600" }. ALL PRICES IN ${symbol}. Use real Unsplash photo IDs for hotels. Return ONLY a JSON array, no markdown.`
          },
          {
            role: "user",
            content: `Hotels in ${destination}. Budget: ${budget}. Currency: ${symbol}. Preferred type: ${accommodation_type || "any"}. Include a mix of price ranges, all in ${symbol}.`
          }
        ],
      }),
    });

    if (!response.ok) throw new Error("AI hotel search failed");
    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || "[]";
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) content = jsonMatch[1];
    const hotels = JSON.parse(content.trim());

    return new Response(JSON.stringify({ hotels, source: "ai-generated", currency_symbol: symbol }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-hotels error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error", hotels: [] }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
