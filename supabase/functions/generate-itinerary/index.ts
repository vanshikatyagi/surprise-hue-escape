import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { travel_style, trip_duration, budget, travel_companions, activity_preference, accommodation_type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
            content: `You are an expert luxury travel planner for MystiGo, a mystery travel agency. Generate a complete, actionable trip plan. Pick a real, exciting, surprising destination that perfectly fits the preferences. The itinerary should be detailed enough that the traveler can actually follow it.

Return ONLY valid JSON with this exact structure:
{
  "destination": "City, Country",
  "destination_airport": "XXX",
  "duration": "X days",
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
          "cost_estimate": "$XX"
        }
      ]
    }
  ],
  "estimated_budget": "$X,XXX",
  "best_season": "Month – Month",
  "flight_suggestion": {
    "from_hub": "Nearest major hub airport",
    "to": "Destination airport code",
    "estimated_price_range": "$XXX – $XXX",
    "flight_duration": "X hours"
  },
  "hotel_suggestion": {
    "name": "Suggested hotel or area to stay",
    "area": "Neighborhood or zone",
    "style": "boutique|resort|villa|eco-lodge|apartment",
    "estimated_price_range": "$XXX – $XXX per night"
  },
  "tips": ["Practical tip 1", "Practical tip 2", "Practical tip 3", "Practical tip 4"],
  "packing_essentials": ["Item 1", "Item 2", "Item 3"]
}`
          },
          {
            role: "user",
            content: `Plan a mystery trip with these exact preferences:
- Travel style: ${travel_style}
- Trip duration: ${trip_duration}
- Budget per person: ${budget}
- Traveling with: ${travel_companions}
- Preferred activities: ${activity_preference || "mixed"}
- Preferred accommodation: ${accommodation_type || "hotel"}

Generate a COMPLETE day-by-day itinerary. Include specific restaurant names, attraction names, and neighborhoods. Make it feel real and actionable. The destination should be a genuine surprise that perfectly matches their profile.`
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
    
    // Extract JSON from the response (may be wrapped in markdown code blocks)
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
