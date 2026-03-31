import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function parseCurrency(currency: string) {
  const match = currency?.match(/^(\w+)\s*\((.+)\)$/);
  if (match) return { code: match[1], symbol: match[2] };
  return { code: currency || "USD", symbol: "$" };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { mode } = body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const curr = parseCurrency(body.currency);

    const scopeInstruction = body.travel_scope === "Domestic"
      ? `The destination MUST be within the same country as "${body.departure_city}". Pick hidden gems.`
      : body.travel_scope === "International"
      ? `The destination MUST be in a different country from "${body.departure_city}". Pick somewhere exciting.`
      : body.travel_scope === "Nearby Countries"
      ? `The destination should be in a neighboring country close to "${body.departure_city}".`
      : `Pick the best destination anywhere in the world.`;

    const visitedPlaces = body.visited_places || "";
    const revisitPref = Array.isArray(body.revisit_preference) ? body.revisit_preference[0] : (body.revisit_preference || "");
    const revisitPlace = body.revisit_place || "";

    const exclusionInstruction = visitedPlaces
      ? `The user has already visited: ${visitedPlaces}. Do NOT suggest any of these places.`
      : "";

    const revisitInstruction = revisitPref === "Yes, I'd revisit" && revisitPlace
      ? `The user wants to revisit: ${revisitPlace}. You may use this as the NAMED destination if it fits their preferences well.`
      : "";

    // Local secrets integration
    const localSecrets = body.local_secrets || [];
    const localSecretsInstruction = localSecrets.length > 0
      ? `\n\nCOMMUNITY LOCAL SECRETS for this destination:\n${localSecrets.map((s: any) => `- [${s.category}] "${s.title}": ${s.description} (Location: ${s.location})`).join("\n")}\nWeave these community-submitted tips into the itinerary where relevant. Mark activities based on community tips with "community_pick": true.`
      : "";

    // ── MODE: SUGGEST ──
    if (mode === "suggest") {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are an expert travel planner for MystiGo. Based on preferences, suggest exactly 2 real destination options. One should be named with details, one should be a complete mystery with only cryptic hints.

${scopeInstruction}
${exclusionInstruction}
${revisitInstruction}
Climate preference: ${body.climate_preference || "any"}.

CRITICAL RULES:
- The named destination and the mystery destination MUST be COMPLETELY DIFFERENT places (different countries if international, different regions if domestic).
- The mystery destination must NEVER be the same as the named destination.
- Neither destination should be a place the user has already visited.
${revisitInstruction ? "- Exception: if the user wants to revisit a specific place, the named option can be that place." : ""}

Return ONLY valid JSON:
{
  "destinations": [
    {
      "id": 1,
      "name": "City, Country",
      "tagline": "Short exciting tagline",
      "hints": ["hint 1", "hint 2", "hint 3"],
      "match_score": 92,
      "highlights": ["highlight 1", "highlight 2", "highlight 3"],
      "estimated_budget": "${curr.symbol}X,XXX",
      "best_for": "Who this is best for",
      "mystery": false
    },
    {
      "id": 2,
      "name": "HIDDEN",
      "tagline": "Trust us. This one's special.",
      "hints": ["A cryptic climate hint", "A cryptic culture hint", "A cryptic food hint"],
      "match_score": 98,
      "highlights": ["???", "???", "???"],
      "estimated_budget": "${curr.symbol}X,XXX",
      "best_for": "The ultimate thrill-seeker",
      "mystery": true
    }
  ]
}

The mystery option should have the HIGHEST match_score to tempt the user. The hints for the mystery option should be poetic and cryptic — never reveal the actual location name. The actual mystery destination must be a REAL, DIFFERENT place from option 1.`
            },
            {
              role: "user",
              content: `Suggest 2 destinations:
- Departing from: ${body.departure_city || "nearest hub"}
- Travel scope: ${body.travel_scope || "Surprise Me"}
- Travel style: ${Array.isArray(body.travel_style) ? body.travel_style.join(", ") : body.travel_style}
- Budget: ${Array.isArray(body.budget) ? body.budget[0] : body.budget}
- Duration: ${Array.isArray(body.trip_duration) ? body.trip_duration[0] : body.trip_duration}
- Companions: ${Array.isArray(body.travel_companions) ? body.travel_companions[0] : body.travel_companions}
- Climate: ${Array.isArray(body.climate_preference) ? body.climate_preference.join(", ") : (body.climate_preference || "any")}
- Activities: ${Array.isArray(body.activity_preference) ? body.activity_preference.join(", ") : (body.activity_preference || "mixed")}
- Currency: ${curr.code} (${curr.symbol})
- Already visited: ${visitedPlaces || "none mentioned"}
- Wants to revisit: ${revisitPlace || "no"}

ALL budget estimates must be in ${curr.code}.`
            }
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited, please try again." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error("AI gateway error");
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      let jsonStr = content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) jsonStr = jsonMatch[1];
      const result = JSON.parse(jsonStr.trim());

      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ── MODE: ITINERARY ──
    const chosenDestination = body.chosen_destination;

    const destinationInstruction = chosenDestination && chosenDestination !== "mystery"
      ? `The destination is: ${chosenDestination}. Create the itinerary for THIS specific destination.`
      : `Pick the BEST surprise destination that is DIFFERENT from any named suggestion. The user chose mystery — make it unforgettable! ${scopeInstruction} ${exclusionInstruction}`;

    const travelStyle = Array.isArray(body.travel_style) ? body.travel_style.join(", ") : body.travel_style;
    const tripDuration = Array.isArray(body.trip_duration) ? body.trip_duration[0] : body.trip_duration;
    const budget = Array.isArray(body.budget) ? body.budget[0] : body.budget;
    const companions = Array.isArray(body.travel_companions) ? body.travel_companions[0] : body.travel_companions;
    const climate = Array.isArray(body.climate_preference) ? body.climate_preference.join(", ") : (body.climate_preference || "any");
    const pace = Array.isArray(body.travel_pace) ? body.travel_pace[0] : (body.travel_pace || "Balanced");
    const activities = Array.isArray(body.activity_preference) ? body.activity_preference.join(", ") : (body.activity_preference || "mixed");
    const accommodation = Array.isArray(body.accommodation_type) ? body.accommodation_type.join(", ") : (body.accommodation_type || "hotel");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert travel planner for MystiGo. Generate a PREMIUM, highly detailed trip plan that feels personalized and unique.

IMPORTANT: All prices MUST be in ${curr.code} (${curr.symbol}).

${destinationInstruction}
${localSecretsInstruction}

Climate preference: ${climate}. Match the destination's climate.
Travel pace: ${pace}. If "Action-Packed", 5-6 activities/day. If "Slow & Relaxed", 2-3. If "Balanced", 3-4.

CRITICAL: Each day MUST have 4 time blocks: Morning, Afternoon, Evening, Night.
Each activity must feel UNIQUE and PREMIUM — include hidden gems, photo-worthy spots, local food recommendations, and insider tips.

Return ONLY valid JSON:
{
  "destination": "City, Country",
  "destination_airport": "XXX",
  "duration": "X days",
  "currency": "${curr.code}",
  "currency_symbol": "${curr.symbol}",
  "summary": "One enticing paragraph that makes the user excited",
  "days": [
    {
      "day": 1,
      "title": "Catchy creative title",
      "activities": [
        {
          "time": "Morning",
          "activity": "Activity Name",
          "description": "Vivid, detailed description with insider tips",
          "type": "sightseeing|food|adventure|relaxation|culture|transport",
          "cost_estimate": "${curr.symbol}XX",
          "hidden_gem": true,
          "photo_spot": false,
          "local_food_tip": "Try the local specialty here...",
          "insider_tip": "Arrive early to avoid crowds...",
          "community_pick": false
        },
        {
          "time": "Afternoon",
          "activity": "...",
          "description": "...",
          "type": "...",
          "cost_estimate": "${curr.symbol}XX",
          "hidden_gem": false,
          "photo_spot": true,
          "local_food_tip": "",
          "insider_tip": "",
          "community_pick": false
        },
        {
          "time": "Evening",
          "activity": "...",
          "description": "...",
          "type": "food",
          "cost_estimate": "${curr.symbol}XX",
          "hidden_gem": false,
          "photo_spot": false,
          "local_food_tip": "Must-try local dish...",
          "insider_tip": "",
          "community_pick": false
        },
        {
          "time": "Night",
          "activity": "...",
          "description": "...",
          "type": "relaxation",
          "cost_estimate": "${curr.symbol}XX",
          "hidden_gem": false,
          "photo_spot": false,
          "local_food_tip": "",
          "insider_tip": "",
          "community_pick": false
        }
      ]
    }
  ],
  "estimated_budget": "${curr.symbol}X,XXX",
  "best_season": "Month – Month",
  "flight_suggestion": { "from_hub": "Airport", "to": "Code", "estimated_price_range": "${curr.symbol}XXX – ${curr.symbol}XXX", "flight_duration": "X hours" },
  "hotel_suggestion": { "name": "Hotel", "area": "Zone", "style": "boutique|resort|villa|eco-lodge|apartment", "estimated_price_range": "${curr.symbol}XXX – ${curr.symbol}XXX per night" },
  "tips": ["tip1", "tip2", "tip3", "tip4"],
  "packing_essentials": ["item1", "item2", "item3"],
  "local_phrases": ["Hello = word", "Thank you = word"],
  "budget_breakdown": {
    "flights": "${curr.symbol}XXX",
    "accommodation": "${curr.symbol}XXX",
    "food": "${curr.symbol}XXX",
    "activities": "${curr.symbol}XXX",
    "transport": "${curr.symbol}XXX",
    "miscellaneous": "${curr.symbol}XXX"
  }
}

RULES:
- hidden_gem: true for activities that are off-the-beaten-path, not touristy
- photo_spot: true for Instagram-worthy, visually stunning locations
- local_food_tip: non-empty string for food-related activities with specific dish/restaurant recommendations
- insider_tip: non-empty string with pro tips locals would know
- community_pick: true ONLY for activities sourced from community local secrets
- Make each day feel DIFFERENT — vary activity types, energy levels, neighborhoods
- Include at least 2 hidden gems and 2 photo spots per trip
- Every evening should include a local food recommendation`
          },
          {
            role: "user",
            content: `Plan a trip:
- Departing from: ${body.departure_city || "nearest hub"}
- Travel style: ${travelStyle}
- Duration: ${tripDuration}
- Budget: ${budget}
- Companions: ${companions}
- Activities: ${activities}
- Accommodation: ${accommodation}
- Climate: ${climate}
- Pace: ${pace}
- Currency: ${curr.code} (${curr.symbol})
- Already visited: ${visitedPlaces || "none"}

ALL PRICES IN ${curr.code} (${curr.symbol}).`
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited, please try again." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
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

    return new Response(JSON.stringify(itinerary), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("generate-itinerary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
