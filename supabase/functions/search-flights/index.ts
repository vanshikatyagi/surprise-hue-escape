import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { origin, destination, budget, currency } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const currencyMap: Record<string, string> = {
      "INR (₹)": "₹", "USD ($)": "$", "EUR (€)": "€", "GBP (£)": "£",
      "AED (د.إ)": "د.إ", "THB (฿)": "฿", "JPY (¥)": "¥", "AUD (A$)": "A$",
      "SGD (S$)": "S$", "MYR (RM)": "RM", "CAD (C$)": "C$", "KRW (₩)": "₩",
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
            content: `Generate 4 realistic flight options as JSON array. Each flight: { "airline": "Real Airline Name", "flight_number": "XX-123", "from": "City (CODE)", "to": "City (CODE)", "depart": "HH:MM", "arrive": "HH:MM", "duration": "Xh Ym", "price": number, "class": "economy|business|first", "stops": "Direct|1 stop" }. ALL PRICES MUST BE IN ${symbol} (realistic for this currency). Return ONLY a JSON array, no markdown.`
          },
          {
            role: "user",
            content: `Flights from ${origin || "New York"} to ${destination}. Budget: ${budget}. Currency: ${symbol}. Include economy and business options with realistic prices in ${symbol}.`
          }
        ],
      }),
    });

    if (!response.ok) throw new Error("AI flight search failed");
    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || "[]";
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) content = jsonMatch[1];
    const flights = JSON.parse(content.trim());

    return new Response(JSON.stringify({ flights, source: "ai-generated", currency_symbol: symbol }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-flights error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error", flights: [] }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
