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

function durationToMinutes(d: string): number {
  if (!d) return 0;
  const h = d.match(/(\d+)\s*h/);
  const m = d.match(/(\d+)\s*m/);
  const days = d.match(/(\d+)\s*d/);
  return (days ? parseInt(days[1]) * 1440 : 0) + (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { origin, destination, budget, currency } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    const symbol = currencyMap[currency] || "$";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a multi-modal transport comparison engine. For a given origin → destination, return EVERY realistic mode of transport that actually serves that route.

Modes to consider (include only those that are realistic for the route):
- "flight" (commercial airline)
- "train" (rail / high-speed / sleeper)
- "bus" (intercity coach / sleeper bus)
- "car_rental" (self-drive)
- "rideshare" (Uber / Ola / Bolt long-distance / private cab)
- "ferry" (sea / river crossing)
- "cruise" (overnight ferry / cruise where applicable)
- "shared_taxi" (sumo, tempo traveller, shared van — common in remote regions)
- "metro_combo" (multi-leg public transport when relevant for short hops)

Return 6-9 options TOTAL across at least 3 different modes when possible. For purely overseas routes, prioritize flight + a creative alternative (train+ferry combo, cruise) if any exist. For domestic / regional routes, include trains, buses, car rentals, shared taxis.

Each option as JSON object:
{
  "mode": "flight|train|bus|car_rental|rideshare|ferry|cruise|shared_taxi|metro_combo",
  "operator": "Real operator name (airline / rail co / bus brand / rental brand)",
  "service_name": "e.g. Flight AI-302 | Rajdhani Express | Volvo Sleeper | Hertz SUV",
  "from": "City/Station/Port (CODE if any)",
  "to": "City/Station/Port (CODE if any)",
  "depart": "HH:MM",
  "arrive": "HH:MM (next day OK — describe via duration)",
  "duration": "Xh Ym  OR  Xd Yh",
  "price": number,
  "class": "economy|business|first|sleeper|standard|premium|self-drive",
  "stops": "Direct|1 stop|2 stops|N transfers",
  "perks": ["Wi-Fi","Meals","Reclining seats","AC","Charging port","Restroom","Pet friendly"],
  "baggage": "Free description e.g. '2 large bags' or 'unlimited'",
  "on_time_rating": 4.2,
  "comfort_rating": 4.0,
  "eco_score": "low|medium|high",
  "booking_hint": "Where users typically book (e.g. Skyscanner, IRCTC, RedBus, Hertz, 12Go)"
}

ALL PRICES in ${symbol}. Include realistic price + duration variance. Mix overnight + daytime. NEVER invent modes that don't exist for the route (e.g. no train for an island-only route).

Return ONLY a JSON array of options.`
          },
          {
            role: "user",
            content: `Origin: ${origin || "user's city"}. Destination: ${destination}. Traveller budget: ${budget}. Currency: ${symbol}.
List EVERY realistic mode of transport from origin to destination. Include flights AND ground/sea alternatives where geography allows. For Indian/regional routes definitely include train + sleeper bus + shared taxi + self-drive. For intercontinental, focus on flights + any cruise/ferry alternative. Provide 6-9 diverse options across at least 3 modes when possible.`
          }
        ],
      }),
    });

    if (!response.ok) throw new Error(`AI transport search failed: ${response.status}`);
    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || "[]";
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) content = jsonMatch[1];
    const raw: any[] = JSON.parse(content.trim());

    if (raw.length > 0) {
      const cheapestIdx = raw.reduce((a, _, i) => (raw[i].price < raw[a].price ? i : a), 0);
      const fastestIdx = raw.reduce((a, _, i) => (durationToMinutes(raw[i].duration) < durationToMinutes(raw[a].duration) ? i : a), 0);
      const bestValueIdx = raw.reduce((a, _, i) => {
        const score = raw[i].price + durationToMinutes(raw[i].duration) * 1.5;
        const aScore = raw[a].price + durationToMinutes(raw[a].duration) * 1.5;
        return score < aScore ? i : a;
      }, 0);
      // Per-mode "greenest" (highest eco) gets eco-pick
      const ecoIdx = raw.reduce((a, _, i) => {
        const rank = (e: string) => e === "high" ? 2 : e === "medium" ? 1 : 0;
        return rank(raw[i].eco_score) > rank(raw[a].eco_score) ? i : a;
      }, 0);
      raw.forEach((f, i) => {
        const tags: string[] = [];
        if (i === cheapestIdx) tags.push("cheapest");
        if (i === fastestIdx) tags.push("fastest");
        if (i === bestValueIdx && i !== cheapestIdx && i !== fastestIdx) tags.push("best-value");
        if (i === ecoIdx && raw[i].eco_score === "high") tags.push("eco-pick");
        f.tags = tags;
      });
    }

    return new Response(JSON.stringify({ options: raw, source: "ai-generated", currency_symbol: symbol }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-transport error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error", options: [] }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
