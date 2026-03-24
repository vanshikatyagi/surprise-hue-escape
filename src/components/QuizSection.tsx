import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Mountain, Umbrella, Building2, Camera, ChevronRight, Check,
  Users, User, Heart, UserCheck,
  Wallet, Gem, CreditCard, Crown,
  CalendarDays, CalendarRange, Calendar, Infinity,
  Utensils, Ship, Bike, Palette,
  Home, Hotel, TreePine, Waves,
  MapPin, Loader2, Navigation, Sparkles,
  Globe, Sun, Snowflake, CloudRain, Thermometer,
  Zap, Coffee, Gauge, Timer,
  IndianRupee, DollarSign, Euro, PoundSterling,
  Plane, Flag,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuizStep {
  question: string;
  subtitle: string;
  key: string;
  type: "options" | "location" | "currency";
  options?: { label: string; description: string; icon: React.ElementType }[];
  condition?: (answers: Record<string, string>) => boolean;
}

const allSteps: QuizStep[] = [
  {
    question: "Where are you traveling from?",
    subtitle: "We'll find the best connections from your city",
    key: "departure_city",
    type: "location",
  },
  {
    question: "Explore your own country or go abroad?",
    subtitle: "This decides the scope of your mystery destination",
    key: "travel_scope",
    type: "options",
    options: [
      { label: "Domestic", description: "Hidden gems in my own country", icon: Flag },
      { label: "International", description: "Take me to a new country!", icon: Globe },
      { label: "Surprise Me", description: "Anywhere in the world works", icon: Sparkles },
      { label: "Nearby Countries", description: "Close but different culture", icon: Plane },
    ],
  },
  {
    question: "What currency do you prefer?",
    subtitle: "We'll show all prices in your preferred currency",
    key: "currency",
    type: "currency",
  },
  {
    question: "What's your budget per person?",
    subtitle: "This helps us find the perfect match",
    key: "budget",
    type: "options",
    options: [
      { label: "Budget Explorer", description: "Keep it affordable & fun", icon: Wallet },
      { label: "Comfortable", description: "Good value, nice experiences", icon: CreditCard },
      { label: "Premium", description: "Treat yourself, you deserve it", icon: Gem },
      { label: "Luxury", description: "No limits, top-tier everything", icon: Crown },
    ],
  },
  {
    question: "What's your ideal travel vibe?",
    subtitle: "This shapes the entire character of your mystery trip",
    key: "travel_style",
    type: "options",
    options: [
      { label: "Adventure & Outdoors", description: "Hiking, safaris, extreme sports", icon: Mountain },
      { label: "Beach & Relaxation", description: "Sunsets, spa, zero agenda", icon: Umbrella },
      { label: "Culture & History", description: "Museums, ancient ruins, local life", icon: Building2 },
      { label: "Food & Photography", description: "Culinary scenes & scenic shots", icon: Camera },
    ],
  },
  {
    question: "What climate do you love?",
    subtitle: "We'll match your weather preferences perfectly",
    key: "climate_preference",
    type: "options",
    options: [
      { label: "Tropical & Warm", description: "Sunshine, beaches, warm breeze", icon: Sun },
      { label: "Cold & Snowy", description: "Mountains, cozy vibes, snow", icon: Snowflake },
      { label: "Mild & Pleasant", description: "Not too hot, not too cold", icon: Thermometer },
      { label: "Rainy & Lush", description: "Green forests, monsoon magic", icon: CloudRain },
    ],
  },
  {
    question: "How do you like your travel pace?",
    subtitle: "Packed days or chill vibes?",
    key: "travel_pace",
    type: "options",
    options: [
      { label: "Action-Packed", description: "See everything, sleep later!", icon: Zap },
      { label: "Balanced", description: "Mix of activity and downtime", icon: Gauge },
      { label: "Slow & Relaxed", description: "No rushing, soak it all in", icon: Coffee },
      { label: "Flexible", description: "Some planned, some spontaneous", icon: Timer },
    ],
  },
  {
    question: "How long can you escape for?",
    subtitle: "We'll plan every single day perfectly",
    key: "trip_duration",
    type: "options",
    options: [
      { label: "Weekend Getaway", description: "2–3 days of pure magic", icon: CalendarDays },
      { label: "Short Break", description: "4–6 days to recharge", icon: Calendar },
      { label: "Full Week", description: "7–10 days of discovery", icon: CalendarRange },
      { label: "Extended Journey", description: "10+ days, go deep", icon: Infinity },
    ],
  },
  {
    question: "Who's joining the adventure?",
    subtitle: "We tailor every experience to your group",
    key: "travel_companions",
    type: "options",
    options: [
      { label: "Solo Explorer", description: "Just me, the world & freedom", icon: User },
      { label: "Romantic Escape", description: "Two hearts, one destination", icon: Heart },
      { label: "Family Fun", description: "Kids, parents, memories", icon: Users },
      { label: "Squad Goals", description: "Friends who travel together", icon: UserCheck },
    ],
  },
  {
    question: "What activities excite you most?",
    subtitle: "We'll pack your days with things you love",
    key: "activity_preference",
    type: "options",
    condition: (a) => a.travel_style === "Adventure & Outdoors" || a.travel_style === "Culture & History",
    options: [
      { label: "Gourmet & Nightlife", description: "Restaurants, bars, local markets", icon: Utensils },
      { label: "Water & Ocean", description: "Diving, sailing, island hopping", icon: Ship },
      { label: "Cycling & Trekking", description: "Active explorations on foot", icon: Bike },
      { label: "Arts & Wellness", description: "Galleries, yoga, spas", icon: Palette },
    ],
  },
  {
    question: "Where do you prefer to sleep?",
    subtitle: "Your accommodation shapes the entire mood",
    key: "accommodation_type",
    type: "options",
    condition: (a) => a.budget === "Premium" || a.budget === "Luxury",
    options: [
      { label: "Boutique Hotel", description: "Stylish, intimate, local character", icon: Hotel },
      { label: "Eco Lodge / Glamping", description: "Nature immersion done right", icon: TreePine },
      { label: "Beach / Overwater Villa", description: "Wake up to the ocean", icon: Waves },
      { label: "City Apartment", description: "Live like a local", icon: Home },
    ],
  },
];

const QuizSection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [locationDetected, setLocationDetected] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const activeSteps = allSteps.filter(
    (step) => !step.condition || step.condition(answers)
  );

  const totalSteps = activeSteps.length;
  const currentStepData = activeSteps[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  useEffect(() => {
    if (currentStep === 0 && !locationDetected) {
      detectLocation();
    }
  }, []);

  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) return;
    setDetectingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
      );
      const { latitude, longitude } = position.coords;
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || "";
      const country = data.countryName || "";
      const loc = city ? `${city}, ${country}` : country;
      if (loc) {
        setLocationInput(loc);
        setLocationDetected(true);
      }
    } catch {
      // User denied or timeout
    } finally {
      setDetectingLocation(false);
    }
  }, []);

  const canProceed = () => {
    if (!currentStepData) return false;
    if (currentStepData.type === "location") return locationInput.trim().length > 1;
    return selected !== null;
  };

  const handleNext = async () => {
    const step = currentStepData;
    const value = step.type === "location" ? locationInput.trim() : selected!;
    const newAnswers = { ...answers, [step.key]: value };
    setAnswers(newAnswers);

    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelected(null);
    } else {
      if (user) {
        setSaving(true);
        try {
          const { error } = await supabase.from("quiz_results").insert({
            user_id: user.id,
            travel_style: newAnswers.travel_style,
            trip_duration: newAnswers.trip_duration,
            budget: newAnswers.budget,
            travel_companions: newAnswers.travel_companions,
          });
          if (error) {
            toast({ title: "Error saving quiz", description: error.message, variant: "destructive" });
            return;
          }
          navigate("/reveal", { state: { quizData: newAnswers } });
        } catch {
          toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
        } finally {
          setSaving(false);
        }
      } else {
        toast({ title: "Sign in to continue", description: "Create a free account to reveal your mystery destination." });
        navigate("/auth");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = activeSteps[currentStep - 1];
      setCurrentStep((prev) => prev - 1);
      if (prevStep.type === "options") {
        setSelected(answers[prevStep.key] || null);
      }
    }
  };

  if (!currentStepData) return null;

  return (
    <section className="bg-primary py-20" id="quiz">
      <div className="container mx-auto px-4 flex justify-center">
        <Card className="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-2xl">
          {/* Header */}
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#2d2d2d] font-semibold">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-gray-400">{Math.round(progress)}% complete</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-8">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question */}
          <div className="mb-8 text-center">
            <h3 className="text-xl md:text-2xl font-extrabold text-[#2d2d2d] mb-1">
              {currentStepData.question}
            </h3>
            <p className="text-sm text-gray-400">{currentStepData.subtitle}</p>
          </div>

          {/* Location Step */}
          {currentStepData.type === "location" && (
            <div className="mb-8 space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Enter your city..."
                  className="pl-10 text-base h-14 rounded-xl border-2 border-gray-200 focus:border-[#2d2d2d]"
                />
              </div>
              {detectingLocation ? (
                <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Detecting your location...
                </div>
              ) : !locationDetected ? (
                <button
                  onClick={detectLocation}
                  className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors mx-auto font-medium"
                >
                  <Navigation className="w-4 h-4" />
                  Use my current location
                </button>
              ) : (
                <div className="flex items-center gap-2 text-sm text-green-600 justify-center">
                  <Check className="w-4 h-4" />
                  Location detected automatically
                </div>
              )}
            </div>
          )}

          {/* Options Step */}
          {currentStepData.type === "options" && currentStepData.options && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {currentStepData.options.map((option) => {
                const Icon = option.icon;
                const isSelected = selected === option.label;
                return (
                  <button
                    key={option.label}
                    onClick={() => setSelected(option.label)}
                    className={`flex items-start gap-4 p-5 rounded-xl border-2 transition-all duration-200 text-left group ${
                      isSelected
                        ? "border-[#2d2d2d] bg-[#2d2d2d]/5 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? "bg-accent" : "bg-white border border-gray-200"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? "text-black" : "text-gray-500"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${isSelected ? "text-[#2d2d2d]" : "text-gray-800"}`}>
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{option.description}</p>
                    </div>
                    {isSelected && (
                      <div className="ml-auto flex-shrink-0">
                        <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-black" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {currentStep > 0 ? (
              <button
                onClick={handleBack}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            <Button
              onClick={handleNext}
              disabled={!canProceed() || saving}
              className="bg-accent text-black hover:bg-accent/90 rounded-full px-8 py-3 font-bold text-sm disabled:opacity-40 ml-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : currentStep === totalSteps - 1 ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Reveal My Trip
                </>
              ) : (
                "Next →"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default QuizSection;
