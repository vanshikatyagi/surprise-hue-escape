import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function getAmadeusToken(): Promise<string | null> {
  const apiKey = Deno.env.get("AMADEUS_API_KEY");
  const apiSecret = Deno.env.get("AMADEUS_API_SECRET");
  if (!apiKey || !apiSecret) return null;

  const res = await fetch("https://api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`,
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { origin, destination, destination_airport, budget } = await req.json();

    // Try Amadeus API first
    const token = await getAmadeusToken();
    if (token && destination_airport) {
      // Use Amadeus Flight Offers Search
      const departDate = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
      const originCode = origin?.match(/\(([A-Z]{3})\)/)?.[1] || "JFK"; // fallback

      const url = `https://api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originCode}&destinationLocationCode=${destination_airport}&departureDate=${departDate}&adults=1&max=5&currencyCode=USD`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const flights = (data.data || []).map((offer: any) => {
          const seg = offer.itineraries?.[0]?.segments || [];
          const first = seg[0] || {};
          const last = seg[seg.length - 1] || {};
          return {
            airline: first.carrierCode || "Unknown",
            flight_number: `${first.carrierCode || "XX"}-${first.number || "000"}`,
            from: first.departure?.iataCode || originCode,
            to: last.arrival?.iataCode || destination_airport,
            depart: first.departure?.at?.split("T")[1]?.slice(0, 5) || "08:00",
            arrive: last.arrival?.at?.split("T")[1]?.slice(0, 5) || "16:00",
            duration: offer.itineraries?.[0]?.duration?.replace("PT", "").toLowerCase() || "10h",
            price: parseFloat(offer.price?.total || "0"),
            class: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin?.toLowerCase() || "economy",
            stops: seg.length > 1 ? `${seg.length - 1} stop${seg.length > 2 ? "s" : ""}` : "Direct",
          };
        });

        return new Response(JSON.stringify({ flights, source: "amadeus" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Fallback: Use AI to generate realistic flight data
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
            content: `Generate 4 realistic flight options as JSON array. Each flight: { "airline": "Real Airline Name", "flight_number": "XX-123", "from": "City (CODE)", "to": "City (CODE)", "depart": "HH:MM", "arrive": "HH:MM", "duration": "Xh Ym", "price": number, "class": "economy|business|first", "stops": "Direct|1 stop" }. Make prices realistic for the budget range. Return ONLY a JSON array, no markdown.`
          },
          {
            role: "user",
            content: `Flights from ${origin || "New York"} to ${destination}. Budget: ${budget}. Include economy and business options.`
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

    return new Response(JSON.stringify({ flights, source: "ai-generated" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-flights error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error", flights: [] }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
