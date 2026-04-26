import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const currencyMap: Record<string, string> = {
  "INR (₹)": "₹", "USD ($)": "$", "EUR (€)": "€", "GBP (£)": "£",
  "AED (د.إ)": "د.إ", "THB (฿)": "฿", "JPY (¥)": "¥", "AUD (A$)": "A$",
  "SGD (S$)": "S$", "MYR (RM)": "RM", "CAD (C$)": "C$", "KRW (₩)": "₩",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { destination, budget, accommodation_type, currency } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    const symbol = currencyMap[currency] || "$";
    const cityQ = encodeURIComponent(String(destination || "").split(",")[0].trim() || "hotel");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `You are a hotel comparison engine. Generate 5 realistic hotel options as JSON array. Each hotel: { "name": "Real Hotel Name", "city": "City, Country", "price": number (per night in ${symbol}), "rating": number (3.5-5.0), "review_count": number (50-3500), "room_type": "standard|deluxe|suite|villa", "image_url": "https://images.unsplash.com/...", "amenities": ["Pool","Free breakfast","Wi-Fi","Spa","Gym"], "distance_to_center": "X.X km", "free_cancellation": true|false, "breakfast_included": true|false }. PRICES IN ${symbol}. Mix budget to luxury so cheapest/best-rated/best-value differ. Use REAL hotel-style Unsplash IDs. Return ONLY a JSON array.`
          },
          {
            role: "user",
            content: `Hotels in ${destination}. Budget: ${budget}. Currency: ${symbol}. Preferred type: ${accommodation_type || "any"}. Vary price and amenities widely.`
          }
        ],
      }),
    });

    if (!response.ok) throw new Error("AI hotel search failed");
    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || "[]";
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) content = jsonMatch[1];
    const raw: any[] = JSON.parse(content.trim());

    // Fallback image per hotel
    raw.forEach((h, i) => {
      if (!h.image_url || !h.image_url.includes("unsplash")) {
        h.image_url = `https://source.unsplash.com/800x600/?${cityQ},hotel&sig=${i}`;
      }
    });

    // Tag cheapest / top-rated / best-value
    if (raw.length > 0) {
      const cheapestIdx = raw.reduce((a, _, i) => (raw[i].price < raw[a].price ? i : a), 0);
      const topRatedIdx = raw.reduce((a, _, i) => (raw[i].rating > raw[a].rating ? i : a), 0);
      const bestValueIdx = raw.reduce((a, _, i) => {
        const score = raw[i].price / Math.max(1, raw[i].rating);
        const aScore = raw[a].price / Math.max(1, raw[a].rating);
        return score < aScore ? i : a;
      }, 0);
      raw.forEach((h, i) => {
        const tags: string[] = [];
        if (i === cheapestIdx) tags.push("cheapest");
        if (i === topRatedIdx) tags.push("top-rated");
        if (i === bestValueIdx && i !== cheapestIdx && i !== topRatedIdx) tags.push("best-value");
        h.tags = tags;
      });
    }

    return new Response(JSON.stringify({ hotels: raw, source: "ai-generated", currency_symbol: symbol }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-hotels error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error", hotels: [] }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
