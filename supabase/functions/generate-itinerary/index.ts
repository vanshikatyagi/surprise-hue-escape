import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { travel_style, trip_duration, budget, travel_companions } = await req.json();
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
            content: `You are an expert travel planner for MystiGo, a mystery travel agency. Generate a detailed day-by-day itinerary based on the user's preferences. Pick a surprising but fitting destination. Return ONLY valid JSON with this exact structure:
{
  "destination": "City, Country",
  "duration": "X days",
  "summary": "Brief exciting description",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        {"time": "9:00 AM", "activity": "Activity name", "description": "Brief description", "type": "sightseeing|food|adventure|relaxation|culture"}
      ]
    }
  ],
  "estimated_budget": "$X,XXX",
  "best_season": "Month - Month",
  "tips": ["tip1", "tip2", "tip3"]
}`
          },
          {
            role: "user",
            content: `Plan a mystery trip with these preferences:
- Travel style: ${travel_style}
- Duration: ${trip_duration}
- Budget: ${budget}
- Traveling with: ${travel_companions}

Generate a complete day-by-day itinerary with specific activities, restaurants, and experiences. Make it exciting and surprising!`
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
