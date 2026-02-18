import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Mountain, Umbrella, Building2, Camera, ChevronRight, Check,
  Users, User, Heart, UserCheck,
  Wallet, Gem, CreditCard, Crown,
  CalendarDays, CalendarRange, Calendar, Infinity,
  Utensils, Ship, Bike, Palette,
  Home, Hotel, TreePine, Waves,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const questions = [
  {
    question: "What's your ideal travel vibe?",
    subtitle: "This shapes the entire character of your mystery trip",
    key: "travel_style",
    options: [
      { label: "Adventure & Outdoors", description: "Hiking, safaris, extreme sports", icon: Mountain },
      { label: "Beach & Relaxation", description: "Sunsets, spa, zero agenda", icon: Umbrella },
      { label: "Culture & History", description: "Museums, ancient ruins, local life", icon: Building2 },
      { label: "Food & Photography", description: "Culinary scenes & scenic shots", icon: Camera },
    ],
  },
  {
    question: "How long can you escape for?",
    subtitle: "We'll plan every single day perfectly",
    key: "trip_duration",
    options: [
      { label: "Weekend Getaway", description: "2–3 days of pure magic", icon: CalendarDays },
      { label: "Short Break", description: "4–6 days to recharge", icon: Calendar },
      { label: "Full Week", description: "7–10 days of discovery", icon: CalendarRange },
      { label: "Extended Journey", description: "10+ days, go deep", icon: Infinity },
    ],
  },
  {
    question: "What's your budget per person?",
    subtitle: "We'll squeeze every drop of experience from it",
    key: "budget",
    options: [
      { label: "Budget Explorer", description: "$500 – $1,000", icon: Wallet },
      { label: "Comfortable", description: "$1,000 – $2,500", icon: CreditCard },
      { label: "Premium", description: "$2,500 – $5,000", icon: Gem },
      { label: "Luxury", description: "$5,000+, no limits", icon: Crown },
    ],
  },
  {
    question: "Who's joining the adventure?",
    subtitle: "We tailor every experience to your group",
    key: "travel_companions",
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
    options: [
      { label: "Boutique Hotel", description: "Stylish, intimate, local character", icon: Hotel },
      { label: "Eco Lodge / Glamping", description: "Nature immersion done right", icon: TreePine },
      { label: "Beach / Overwater Villa", description: "Wake up to the ocean", icon: Waves },
      { label: "City Apartment", description: "Live like a local", icon: Home },
    ],
  },
];

const QuizSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalQuestions = questions.length;
  const progress = ((currentQuestion) / totalQuestions) * 100;

  const handleNext = async () => {
    const q = questions[currentQuestion];
    const newAnswers = { ...answers, [q.key]: selected! };
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
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
          } else {
            toast({ title: "Quiz completed! 🎉", description: "Generating your personalized mystery itinerary..." });
            setCompleted(true);
            navigate("/itinerary");
          }
        } catch (error) {
          console.error("Quiz save error:", error);
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

  const q = questions[currentQuestion];

  if (completed) {
    return (
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 flex justify-center">
          <Card className="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-2xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
            <p className="text-gray-500 mb-6">Your travel preferences have been saved. Generating your AI itinerary now...</p>
            <Button onClick={() => navigate("/itinerary")} className="bg-[#2d2d2d] text-white hover:bg-[#3d3d3d] rounded-full px-8 py-3">
              View My Itinerary
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-primary py-20" id="quiz">
      <div className="container mx-auto px-4 flex justify-center">
        <Card className="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-2xl">
          {/* Header */}
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#2d2d2d] font-semibold">Question {currentQuestion + 1} of {totalQuestions}</span>
            <span className="text-gray-400">{Math.round(progress)}% complete</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-8">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="mb-8 text-center">
            <h3 className="text-xl md:text-2xl font-extrabold text-[#2d2d2d] mb-1">{q.question}</h3>
            <p className="text-sm text-gray-400">{q.subtitle}</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {q.options.map((option) => {
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
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected ? "bg-accent" : "bg-white border border-gray-200"
                  }`}>
                    <Icon className={`w-5 h-5 ${isSelected ? "text-black" : "text-gray-500"}`} />
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${isSelected ? "text-[#2d2d2d]" : "text-gray-800"}`}>{option.label}</p>
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

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {currentQuestion > 0 ? (
              <button
                onClick={() => { setCurrentQuestion(prev => prev - 1); setSelected(answers[questions[currentQuestion - 1].key] || null); }}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Back
              </button>
            ) : <div />}

            <Button
              onClick={handleNext}
              disabled={!selected || saving}
              className="bg-accent text-black hover:bg-accent/90 rounded-full px-8 py-3 font-bold text-sm disabled:opacity-40 ml-auto"
            >
              {saving ? "Saving..." : currentQuestion === totalQuestions - 1 ? "🎯 Reveal My Trip" : "Next →"}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default QuizSection;
