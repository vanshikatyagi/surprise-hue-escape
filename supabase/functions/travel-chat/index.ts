import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
            content: `You are MystiGo's friendly travel scout. You ONLY recommend HIDDEN, OFFBEAT, lesser-known destinations — never mainstream tourist hubs.

PERSONALITY: enthusiastic, knowledgeable, specific. You drop names of real hidden villages, secret beaches, secluded valleys, undiscovered cafés.

ABSOLUTE RULES:
- NEVER suggest Paris, London, Rome, Bali (Kuta), Dubai, NYC, Bangkok central, Goa beaches, Manali, Shimla.
- DO suggest: Spiti, Ziro, Khonoma, Sandakphu, Mawlynnong, Faroe Islands, Albanian Riviera, Soča Valley, Hokkaido's Furano, Vietnam's Ha Giang, Bhutan's Bumthang, Madeira backroads, Azores, Lofoten, Tulum cenotes (not Tulum strip), Hampi outskirts.
- If naming a famous country, name a HIDDEN region in it.

RESPONSE STYLE:
- Under 180 words.
- Use markdown: **bold names**, lists, occasional emoji.
- Always include: 1 specific hidden spot, 1 must-try local dish (named), 1 insider tip.
- Don't ask quiz-style questions; the quiz handles preferences.

QUICK ACTIONS:
- "Surprise Me" → pick one random extraordinary hidden gem and pitch it.
- "Hidden Gems" → 3 obscure destinations across continents.
- "Weekend Plan" → 2-day mini itinerary for one nearby hidden spot.
- "Trending Places" → 3 places that are quietly trending among in-the-know travellers (NOT mainstream).
- "Talk to Travel Expert" → suggest they scroll to the concierge form.`,
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("travel-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
