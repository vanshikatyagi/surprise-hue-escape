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

const HIDDEN_ONLY_RULE = `
ABSOLUTE RULE — HIDDEN PLACES ONLY:
- NEVER suggest mainstream tourist destinations like Paris, London, Rome, Tokyo (city center), New York, Bali (Kuta/Seminyak), Dubai, Bangkok, Goa, Manali, Shimla, Jaipur tourist circuit.
- ONLY suggest under-the-radar, lesser-known, offbeat, hidden gem destinations that most travellers haven't heard of.
- Examples of acceptable suggestions: Spiti Valley, Ziro, Majuli, Khonoma, Gokarna's secret beaches, Khajjiar, Sandakphu, Mawlynnong, Yuksom, Chettinad, Hampi outskirts, Tulum's cenotes, Faroe Islands, Albanian Riviera, Georgia (country), Slovenia's Soča Valley, Madeira backroads, Azores, Pamukkale outskirts, Lofoten Islands, Hokkaido's Furano, Taiwan's Hualien, Vietnam's Ha Giang, Laos' Luang Namtha, Bhutan's Bumthang, Sri Lanka's Knuckles range.
- If naming a popular country, name a hidden REGION/TOWN inside it, not the famous capital.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { mode, flow } = body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const curr = parseCurrency(body.currency);

    const scopeInstruction = body.travel_scope === "Domestic"
      ? `The destination MUST be within the same country as "${body.departure_city}". Pick HIDDEN/OFFBEAT spots only.`
      : body.travel_scope === "International"
      ? `The destination MUST be in a different country from "${body.departure_city}". Pick a hidden gem in that country, not the famous capital.`
      : body.travel_scope === "Nearby Countries"
      ? `The destination should be in a neighboring country close to "${body.departure_city}", but a hidden region — not the touristy capital.`
      : `Pick a hidden, lesser-known destination anywhere in the world.`;

    const visitedPlaces = body.visited_places || "";
    const revisitPref = Array.isArray(body.revisit_preference) ? body.revisit_preference[0] : (body.revisit_preference || "");
    const revisitPlace = body.revisit_place || "";

    const excludeDests: string[] = Array.isArray(body.exclude_destinations) ? body.exclude_destinations : [];
    const exclusionInstruction = (visitedPlaces || excludeDests.length)
      ? `User has already visited / seen: ${[visitedPlaces, ...excludeDests].filter(Boolean).join(", ")}. Do NOT suggest any of these — pick a meaningfully different hidden gem.`
      : "";

    const revisitInstruction = revisitPref === "Yes, I'd revisit" && revisitPlace
      ? `The user wants to revisit: ${revisitPlace}. You MAY use this for the named option only.`
      : "";

    const localSecrets = body.local_secrets || [];
    const localSecretsInstruction = localSecrets.length > 0
      ? `\n\nCOMMUNITY LOCAL SECRETS for this destination:\n${localSecrets.map((s: any) => `- [${s.category}] "${s.title}": ${s.description} (${s.location})`).join("\n")}\nWeave these into the itinerary. Mark them with "community_pick": true.`
      : "";

    // ── MODE: SUGGEST (2 different hidden destinations) ──
    if (mode === "suggest") {
      const seed = Math.floor(Math.random() * 100000);
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are MystiGo's secret-locations curator. Suggest exactly 2 HIDDEN destinations.

${HIDDEN_ONLY_RULE}

${scopeInstruction}
${exclusionInstruction}
${revisitInstruction}
Climate preference: ${body.climate_preference || "any"}.

CRITICAL:
- Return TWO COMPLETELY DIFFERENT hidden destinations (different countries if international, different states if domestic).
- Both must be lesser-known, offbeat — NOT popular tourist spots.
- Option 1 = NAMED (city/region revealed in "name").
- Option 2 = MYSTERY ("name" = "HIDDEN", reveal nothing, only cryptic poetic hints).
- Both align with the user's vibe but feel meaningfully different (e.g. one mountains + one coastal, or one spiritual + one adventure).
- Mystery destination must NOT be the same as named destination.

Variation seed: ${seed} (use to vary suggestions across runs).

Return ONLY valid JSON:
{
  "destinations": [
    {
      "id": 1,
      "name": "Hidden Region, Country",
      "tagline": "Short evocative tagline",
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
      "tagline": "Trust us. Pure mystery.",
      "hints": ["A cryptic climate hint", "A cryptic culture hint", "A cryptic food hint"],
      "match_score": 98,
      "highlights": ["???", "???", "???"],
      "estimated_budget": "${curr.symbol}X,XXX",
      "best_for": "The bold mystery seeker",
      "mystery": true
    }
  ]
}

The mystery option's hints must be poetic and never reveal the name.`,
            },
            {
              role: "user",
              content: `Suggest 2 hidden destinations:
- From: ${body.departure_city || "nearest hub"}
- Scope: ${body.travel_scope || "Surprise Me"}
- Style: ${Array.isArray(body.travel_style) ? body.travel_style.join(", ") : body.travel_style}
- Budget: ${Array.isArray(body.budget) ? body.budget[0] : body.budget}
- Duration: ${Array.isArray(body.trip_duration) ? body.trip_duration[0] : body.trip_duration}
- With: ${Array.isArray(body.travel_companions) ? body.travel_companions[0] : body.travel_companions}
- Climate: ${Array.isArray(body.climate_preference) ? body.climate_preference.join(", ") : (body.climate_preference || "any")}
- Activities: ${Array.isArray(body.activity_preference) ? body.activity_preference.join(", ") : (body.activity_preference || "mixed")}
- Currency: ${curr.code} (${curr.symbol})
- Already visited: ${visitedPlaces || "none"}
- Wants to revisit: ${revisitPlace || "no"}

ALL budget estimates in ${curr.code}. Hidden gems ONLY.`,
            },
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
    const isReveal = flow === "reveal";
    const isDashboard = flow === "dashboard";

    const destinationInstruction = chosenDestination && chosenDestination !== "mystery"
      ? `The destination is: ${chosenDestination}. Build the itinerary around this exact location.`
      : `Pick a HIDDEN, surprise destination — different from any previous suggestion. ${scopeInstruction} ${exclusionInstruction}`;

    const travelStyle = Array.isArray(body.travel_style) ? body.travel_style.join(", ") : body.travel_style;
    const tripDuration = Array.isArray(body.trip_duration) ? body.trip_duration[0] : body.trip_duration;
    const budget = Array.isArray(body.budget) ? body.budget[0] : body.budget;
    const companions = Array.isArray(body.travel_companions) ? body.travel_companions[0] : body.travel_companions;
    const climate = Array.isArray(body.climate_preference) ? body.climate_preference.join(", ") : (body.climate_preference || "any");
    const pace = Array.isArray(body.travel_pace) ? body.travel_pace[0] : (body.travel_pace || "Balanced");
    const activities = Array.isArray(body.activity_preference) ? body.activity_preference.join(", ") : (body.activity_preference || "mixed");
    const accommodation = Array.isArray(body.accommodation_type) ? body.accommodation_type.join(", ") : (body.accommodation_type || "boutique");
    const seed = Math.floor(Math.random() * 100000);

    // Extract explicit day count from trip_duration (e.g. "7 days", "2 weeks", "5-day trip")
    const durationStr = String(tripDuration || "").toLowerCase();
    let numDays = 5;
    const weekMatch = durationStr.match(/(\d+)\s*week/);
    const dayMatch = durationStr.match(/(\d+)\s*[-\s]?day/);
    if (weekMatch) numDays = parseInt(weekMatch[1]) * 7;
    else if (dayMatch) numDays = parseInt(dayMatch[1]);
    numDays = Math.max(2, Math.min(numDays, 14));

    // Two distinct system tones for the two flows so itineraries differ even for same place
    const flowTone = isReveal
      ? `TONE: Cinematic, suspenseful, narrative — this is a REVEALED MYSTERY itinerary. Use evocative storytelling. Emphasize secret spots, dawn moments, things only locals know. Hour-by-hour structure.`
      : `TONE: Practical premium planner. Crisp, structured, hour-by-hour with realistic travel-time estimates between activities. The user explicitly chose this destination — give them maximum logistical clarity plus hidden depth.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are MystiGo's master itinerary architect. Create a PREMIUM, hour-by-hour, deeply personalized travel plan that feels alive.

${HIDDEN_ONLY_RULE}

${flowTone}

IMPORTANT: All prices in ${curr.code} (${curr.symbol}). Variation seed: ${seed} — vary outputs even for identical destinations.

${destinationInstruction}
${localSecretsInstruction}

Climate preference: ${climate}. Pace: ${pace} (Action-Packed=6 activities/day, Slow=3, Balanced=4-5).

EVERY day MUST have FOUR time blocks: Morning, Afternoon, Evening, Night.
Within each block, give a SPECIFIC start time (e.g. "06:30", "13:15", "19:45").
Each activity MUST include a "travel_time" field describing how to get there from the previous spot ("15 min walk along the river", "20 min scooter ride through the rice terraces").
Each activity must include a "duration" field (e.g. "1.5 hours").
Include at least one café/local-food stop per day with the specific dish to order.
Highlight HIDDEN/SECRET spots (avoid touristy clichés). Mark them with "hidden_gem": true.

🔴 CRITICAL — DAY COUNT:
- The trip duration is "${tripDuration}" which means EXACTLY ${numDays} DAYS.
- The "days" array MUST contain EXACTLY ${numDays} day objects (day 1 through day ${numDays}).
- DO NOT return fewer days. Each day must be unique with different activities, areas, and themes.
- If you return fewer than ${numDays} days the response will be REJECTED.

Return ONLY valid JSON:
{
  "destination": "Hidden Region, Country",
  "destination_airport": "XXX",
  "duration": "${numDays} days",
  "currency": "${curr.code}",
  "currency_symbol": "${curr.symbol}",
  "summary": "One enticing 2-3 sentence paragraph",
  "vibe_score": 95,
  "days": [ /* EXACTLY ${numDays} DAY OBJECTS — day 1, day 2, ..., day ${numDays} */
    {
      "day": 1,
      "title": "Catchy creative title",
      "weather_note": "Expected weather + what to wear",
      "activities": [
        {
          "time": "Morning",
          "start_time": "06:30",
          "duration": "2 hours",
          "travel_time": "From hotel: 10 min walk",
          "activity": "Activity Name",
          "description": "Vivid sensory description with insider details",
          "type": "sightseeing|food|adventure|relaxation|culture|transport|cafe",
          "cost_estimate": "${curr.symbol}XX",
          "hidden_gem": true,
          "photo_spot": false,
          "local_food_tip": "Order the X with Y, only locals know",
          "insider_tip": "Pro tip locals follow",
          "community_pick": false
        }
      ]
    }
  ],
  "estimated_budget": "${curr.symbol}X,XXX",
  "best_season": "Month – Month",
  "flight_suggestion": { "from_hub": "Airport", "to": "Code", "estimated_price_range": "${curr.symbol}XXX – ${curr.symbol}XXX", "flight_duration": "X hours" },
  "hotel_suggestion": { "name": "Hotel", "area": "Zone", "style": "boutique|eco-lodge|villa|guesthouse|apartment", "estimated_price_range": "${curr.symbol}XXX – ${curr.symbol}XXX per night" },
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
- Activities must feel UNIQUE per day — no repeated archetypes.
- At least 3 hidden_gem activities per trip total.
- At least 2 cafe/local_food stops per day with named dishes.
- Insider tips must be specific (timing, hack, local custom) — never generic.
- community_pick: true ONLY for activities sourced from the COMMUNITY LOCAL SECRETS list above.`,
          },
          {
            role: "user",
            content: `Plan a hidden-gems trip:
- From: ${body.departure_city || "nearest hub"}
- Style: ${travelStyle}
- Duration: ${tripDuration}
- Budget: ${budget}
- With: ${companions}
- Activities: ${activities}
- Accommodation: ${accommodation}
- Climate: ${climate}
- Pace: ${pace}
- Currency: ${curr.code} (${curr.symbol})
- Visited: ${visitedPlaces || "none"}
- Flow: ${isReveal ? "REVEAL (cinematic)" : isDashboard ? "DASHBOARD (planner)" : "default"}

ALL PRICES in ${curr.code}. Hidden spots ONLY.`,
          },
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
