import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { travel_style, trip_duration, budget, travel_companions, activity_preference, accommodation_type, departure_city, travel_scope, currency, climate_preference, travel_pace } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Parse currency symbol
    const currencyMap: Record<string, { symbol: string; code: string }> = {
      "INR (₹)": { symbol: "₹", code: "INR" },
      "USD ($)": { symbol: "$", code: "USD" },
      "EUR (€)": { symbol: "€", code: "EUR" },
      "GBP (£)": { symbol: "£", code: "GBP" },
    };
    const curr = currencyMap[currency] || { symbol: "$", code: "USD" };

    const scopeInstruction = travel_scope === "Domestic"
      ? `The destination MUST be within the same country as "${departure_city}". Pick a hidden gem or underrated spot.`
      : travel_scope === "International"
      ? `The destination MUST be in a different country from "${departure_city}". Pick somewhere exciting and different.`
      : travel_scope === "Nearby Countries"
      ? `The destination should be in a neighboring country close to "${departure_city}".`
      : `Pick the best destination anywhere in the world.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert travel planner for MystiGo, a mystery travel agency. Generate a complete, actionable trip plan. Pick a real, exciting, surprising destination that perfectly fits the preferences.

IMPORTANT: All prices and budget estimates MUST be in ${curr.code} (${curr.symbol}). Convert all costs to this currency.

${scopeInstruction}

Climate preference: ${climate_preference || "any"}. Match the destination's climate to this preference.
Travel pace: ${travel_pace || "Balanced"}. If "Action-Packed", include 5-6 activities per day. If "Slow & Relaxed", include 2-3 max. If "Balanced", include 3-4.

Return ONLY valid JSON with this exact structure:
{
  "destination": "City, Country",
  "destination_airport": "XXX",
  "duration": "X days",
  "currency": "${curr.code}",
  "currency_symbol": "${curr.symbol}",
  "summary": "One enticing paragraph about why this destination is perfect for them",
  "days": [
    {
      "day": 1,
      "title": "Catchy day title",
      "activities": [
        {
          "time": "9:00 AM",
          "activity": "Activity name",
          "description": "Specific description with venue/location name",
          "type": "sightseeing|food|adventure|relaxation|culture|transport",
          "cost_estimate": "${curr.symbol}XX"
        }
      ]
    }
  ],
  "estimated_budget": "${curr.symbol}X,XXX",
  "best_season": "Month – Month",
  "flight_suggestion": {
    "from_hub": "Nearest major hub airport",
    "to": "Destination airport code",
    "estimated_price_range": "${curr.symbol}XXX – ${curr.symbol}XXX",
    "flight_duration": "X hours"
  },
  "hotel_suggestion": {
    "name": "Suggested hotel or area to stay",
    "area": "Neighborhood or zone",
    "style": "boutique|resort|villa|eco-lodge|apartment",
    "estimated_price_range": "${curr.symbol}XXX – ${curr.symbol}XXX per night"
  },
  "tips": ["Practical tip 1", "Practical tip 2", "Practical tip 3", "Practical tip 4"],
  "packing_essentials": ["Item 1", "Item 2", "Item 3"],
  "local_phrases": ["Hello = local word", "Thank you = local word", "How much? = local word"]
}`
          },
          {
            role: "user",
            content: `Plan a mystery trip with these exact preferences:
- Departing from: ${departure_city || "nearest major hub"}
- Travel scope: ${travel_scope || "Surprise Me"}
- Currency: ${curr.code} (${curr.symbol})
- Travel style: ${travel_style}
- Trip duration: ${trip_duration}
- Budget per person: ${budget}
- Traveling with: ${travel_companions}
- Preferred activities: ${activity_preference || "mixed"}
- Preferred accommodation: ${accommodation_type || "hotel"}
- Climate preference: ${climate_preference || "any"}
- Travel pace: ${travel_pace || "Balanced"}

Generate a COMPLETE day-by-day itinerary. Include specific restaurant names, attraction names, and neighborhoods. Make it feel real and actionable. ALL PRICES IN ${curr.code} (${curr.symbol}).`
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];
    const itinerary = JSON.parse(jsonStr.trim());

    return new Response(JSON.stringify(itinerary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-itinerary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
