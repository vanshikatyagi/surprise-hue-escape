import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Calendar, DollarSign, Lightbulb, Loader2, Plane, Camera, UtensilsCrossed, Mountain, Palmtree, Landmark } from "lucide-react";
import Header from "@/components/Header";

const activityIcons: Record<string, any> = {
  sightseeing: Camera,
  food: UtensilsCrossed,
  adventure: Mountain,
  relaxation: Palmtree,
  culture: Landmark,
};

interface DayPlan {
  day: number;
  title: string;
  activities: { time: string; activity: string; description: string; type: string }[];
}

interface Itinerary {
  destination: string;
  duration: string;
  summary: string;
  days: DayPlan[];
  estimated_budget: string;
  best_season: string;
  tips: string[];
}

const ItineraryView = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }

    const savedId = searchParams.get("id");
    if (savedId) {
      loadSavedItinerary(savedId);
    } else {
      generateItinerary();
    }
  }, [user]);

  const loadSavedItinerary = async (id: string) => {
    const { data, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) {
      setError("Could not load itinerary.");
      setLoading(false);
      return;
    }
    setItinerary({
      destination: data.destination,
      duration: data.duration,
      summary: "",
      days: (data.plan as any)?.days || [],
      estimated_budget: (data.plan as any)?.estimated_budget || "",
      best_season: (data.plan as any)?.best_season || "",
      tips: (data.plan as any)?.tips || [],
    });
    setLoading(false);
  };

  const generateItinerary = async () => {
    try {
      // Get latest quiz result
      const { data: quiz, error: qErr } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (qErr || !quiz) {
        setError("Complete the travel quiz first to get your itinerary!");
        setLoading(false);
        return;
      }

      const { data: fnData, error: fnError } = await supabase.functions.invoke("generate-itinerary", {
        body: {
          travel_style: quiz.travel_style,
          trip_duration: quiz.trip_duration,
          budget: quiz.budget,
          travel_companions: quiz.travel_companions,
        },
      });

      if (fnError) throw fnError;
      if (fnData?.error) throw new Error(fnData.error);

      setItinerary(fnData);

      // Save to DB
      await supabase.from("itineraries").insert({
        user_id: user!.id,
        quiz_result_id: quiz.id,
        destination: fnData.destination || "Mystery Destination",
        duration: fnData.duration || quiz.trip_duration,
        plan: fnData,
      });
    } catch (e: any) {
      console.error("Itinerary generation error:", e);
      setError(e.message || "Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="h-[52px]" />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-gray-600 font-medium">Crafting your mystery itinerary...</p>
          <p className="text-gray-400 text-sm">Our AI is planning the perfect trip for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="h-[52px]" />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-gray-600 font-medium">{error}</p>
          <Button onClick={() => navigate("/")} className="bg-primary text-white">Go Home</Button>
        </div>
      </div>
    );
  }

  if (!itinerary) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-[52px]" />

      {/* Hero */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-accent text-black border-0 mb-4 text-xs">AI-Generated Itinerary</Badge>
          <h1 className="text-3xl md:text-5xl font-black mb-2">{itinerary.destination}</h1>
          <p className="text-white/70 text-sm max-w-xl mx-auto">{itinerary.summary}</p>
          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-accent" />{itinerary.duration}</div>
            <div className="flex items-center gap-2 text-sm"><DollarSign className="w-4 h-4 text-accent" />{itinerary.estimated_budget}</div>
            <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-accent" />{itinerary.best_season}</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Day-by-day plan */}
        <div className="space-y-8">
          {itinerary.days?.map((day) => (
            <Card key={day.day} className="bg-white rounded-2xl overflow-hidden">
              <div className="bg-[#2d2d2d] px-6 py-3">
                <h3 className="text-white font-bold text-sm">Day {day.day}: {day.title}</h3>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {day.activities?.map((act, j) => {
                    const Icon = activityIcons[act.type] || MapPin;
                    return (
                      <div key={j} className="flex gap-4 items-start">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-mono text-gray-400">{act.time}</span>
                            <Badge variant="outline" className="text-[10px] capitalize">{act.type}</Badge>
                          </div>
                          <p className="font-semibold text-sm text-gray-900">{act.activity}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{act.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips */}
        {itinerary.tips?.length > 0 && (
          <Card className="bg-accent/10 border-accent/20 rounded-2xl mt-8">
            <CardContent className="p-6">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-3"><Lightbulb className="w-4 h-4 text-accent" />Travel Tips</h3>
              <ul className="space-y-2">
                {itinerary.tips.map((tip, i) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>{tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <Button onClick={() => navigate("/flights")} className="bg-primary text-white hover:bg-primary/90 rounded-lg">
            <Plane className="w-4 h-4 mr-2" />Book Flights
          </Button>
          <Button onClick={() => navigate("/hotels")} variant="outline" className="rounded-lg">
            Book Hotels
          </Button>
          <Button onClick={() => navigate("/dashboard")} variant="ghost" className="rounded-lg">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;
