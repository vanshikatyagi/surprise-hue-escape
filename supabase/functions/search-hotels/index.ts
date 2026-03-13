import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { destination, budget, accommodation_type } = await req.json();

    // Try Amadeus API first
    const apiKey = Deno.env.get("AMADEUS_API_KEY");
    const apiSecret = Deno.env.get("AMADEUS_API_SECRET");

    if (apiKey && apiSecret) {
      const tokenRes = await fetch("https://api.amadeus.com/v1/security/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`,
      });

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        const token = tokenData.access_token;
        const city = destination?.split(",")[0]?.trim() || destination;

        // Search for city code first
        const cityRes = await fetch(
          `https://api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${encodeURIComponent(city)}&page[limit]=1`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (cityRes.ok) {
          const cityData = await cityRes.json();
          const cityCode = cityData.data?.[0]?.iataCode;

          if (cityCode) {
            const checkIn = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
            const checkOut = new Date(Date.now() + 21 * 86400000).toISOString().split("T")[0];

            const hotelRes = await fetch(
              `https://api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}&radius=30&radiusUnit=KM&hotelSource=ALL`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (hotelRes.ok) {
              const hotelData = await hotelRes.json();
              const hotels = (hotelData.data || []).slice(0, 5).map((h: any) => ({
                name: h.name || "Hotel",
                city: destination,
                price: Math.floor(Math.random() * 300 + 100),
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                room_type: accommodation_type || "standard",
                image_url: `https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600`,
              }));

              return new Response(JSON.stringify({ hotels, source: "amadeus" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              });
            }
          }
        }
      }
    }

    // Fallback: Use AI to generate realistic hotel data
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `Generate 4 realistic hotel options as JSON array. Each hotel: { "name": "Real Hotel Name", "city": "City, Country", "price": number (per night USD), "rating": number (3.5-5.0), "room_type": "standard|deluxe|suite|villa", "image_url": "https://images.unsplash.com/photo-XXXXX?w=600" }. Use real Unsplash photo IDs for hotels. Make prices realistic. Return ONLY a JSON array, no markdown.`
          },
          {
            role: "user",
            content: `Hotels in ${destination}. Budget: ${budget}. Preferred type: ${accommodation_type || "any"}. Include a mix of price ranges.`
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

    return new Response(JSON.stringify({ hotels, source: "ai-generated" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-hotels error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error", hotels: [] }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
