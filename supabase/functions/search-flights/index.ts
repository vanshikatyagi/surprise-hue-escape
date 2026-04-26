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

// Parse "Xh Ym" → minutes
function durationToMinutes(d: string): number {
  const h = d.match(/(\d+)\s*h/);
  const m = d.match(/(\d+)\s*m/);
  return (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0);
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
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `You are a flight comparison engine. Generate 5 realistic flight options as a JSON array. Each flight: { "airline": "Real Airline Name", "flight_number": "XX-123", "from": "City (CODE)", "to": "City (CODE)", "depart": "HH:MM", "arrive": "HH:MM", "duration": "Xh Ym", "price": number, "class": "economy|business|first", "stops": "Direct|1 stop|2 stops", "perks": ["Free meal","Wi-Fi","Extra legroom"], "baggage": "1 cabin + 1 check-in 23kg", "on_time_rating": 4.2 }. ALL PRICES MUST BE IN ${symbol}. Mix economy + business so prices and durations vary widely (some cheap+slow with stops, some fast+expensive direct). Return ONLY the JSON array.`
          },
          {
            role: "user",
            content: `Flights from ${origin || "New York"} to ${destination}. Budget: ${budget}. Currency: ${symbol}. Variety required: at least one Direct, one with 1 stop, one cheap option, one premium. Realistic perks per airline.`
          }
        ],
      }),
    });

    if (!response.ok) throw new Error("AI flight search failed");
    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || "[]";
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) content = jsonMatch[1];
    const raw: any[] = JSON.parse(content.trim());

    // Tag with cheapest / fastest / best-value
    if (raw.length > 0) {
      const cheapestIdx = raw.reduce((a, _, i) => (raw[i].price < raw[a].price ? i : a), 0);
      const fastestIdx = raw.reduce((a, _, i) => (durationToMinutes(raw[i].duration) < durationToMinutes(raw[a].duration) ? i : a), 0);
      const bestValueIdx = raw.reduce((a, _, i) => {
        const score = raw[i].price + durationToMinutes(raw[i].duration) * 2;
        const aScore = raw[a].price + durationToMinutes(raw[a].duration) * 2;
        return score < aScore ? i : a;
      }, 0);
      raw.forEach((f, i) => {
        const tags: string[] = [];
        if (i === cheapestIdx) tags.push("cheapest");
        if (i === fastestIdx) tags.push("fastest");
        if (i === bestValueIdx && i !== cheapestIdx && i !== fastestIdx) tags.push("best-value");
        f.tags = tags;
      });
    }

    return new Response(JSON.stringify({ flights: raw, source: "ai-generated", currency_symbol: symbol }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-flights error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error", flights: [] }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
