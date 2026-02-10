import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mountain, Umbrella, Building, Camera, ChevronRight, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const questions = [
  {
    question: "What's your ideal travel style?",
    key: "travel_style",
    options: [
      { label: "Adventure & Outdoor", icon: Mountain },
      { label: "Beach & Relaxation", icon: Umbrella },
      { label: "Cultural & Historic", icon: Building },
      { label: "Photography & Nature", icon: Camera },
    ],
  },
  {
    question: "What's your preferred trip duration?",
    key: "trip_duration",
    options: [
      { label: "Weekend (2-3 days)", icon: Mountain },
      { label: "Short (4-6 days)", icon: Umbrella },
      { label: "Week (7-10 days)", icon: Building },
      { label: "Extended (10+ days)", icon: Camera },
    ],
  },
  {
    question: "What's your budget range?",
    key: "budget",
    options: [
      { label: "$500 - $1,000", icon: Mountain },
      { label: "$1,000 - $2,500", icon: Umbrella },
      { label: "$2,500 - $5,000", icon: Building },
      { label: "$5,000+", icon: Camera },
    ],
  },
  {
    question: "Who are you traveling with?",
    key: "travel_companions",
    options: [
      { label: "Solo Adventure", icon: Mountain },
      { label: "Couple's Getaway", icon: Umbrella },
      { label: "Family Trip", icon: Building },
      { label: "Group of Friends", icon: Camera },
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
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleNext = async () => {
    const q = questions[currentQuestion];
    const newAnswers = { ...answers, [q.key]: selected! };
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelected(null);
    } else {
      // Last question - save results
      if (user) {
        setSaving(true);
        const { error } = await supabase.from("quiz_results").insert({
          user_id: user.id,
          travel_style: newAnswers.travel_style,
          trip_duration: newAnswers.trip_duration,
          budget: newAnswers.budget,
          travel_companions: newAnswers.travel_companions,
        });
        setSaving(false);
        if (error) {
          toast({ title: "Error saving quiz", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Quiz completed!", description: "Your preferences have been saved." });
          setCompleted(true);
        }
      } else {
        toast({ title: "Sign in to save", description: "Create an account to save your travel preferences." });
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
            <p className="text-gray-500 mb-6">Your travel preferences have been saved. Check your dashboard for personalized recommendations.</p>
            <Button onClick={() => navigate("/dashboard")} className="bg-[#2d2d2d] text-white hover:bg-[#3d3d3d] rounded-full px-8 py-3">
              Go to Dashboard
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-primary py-20">
      <div className="container mx-auto px-4 flex justify-center">
        <Card className="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-2xl">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-[#2d2d2d] font-medium">Question {currentQuestion + 1} of {totalQuestions}</span>
            <span className="text-[#2d2d2d] font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden mb-8">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-[#2d2d2d] text-center mb-8">
            {q.question}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {q.options.map((option) => (
              <button
                key={option.label}
                onClick={() => setSelected(option.label)}
                className={`flex items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                  selected === option.label
                    ? "border-[#2d2d2d] bg-gray-50"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50"
                }`}
              >
                <option.icon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-800">{option.label}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              disabled={!selected || saving}
              className="bg-accent text-black hover:bg-accent/90 rounded-full px-8 py-3 font-semibold text-sm disabled:opacity-50"
            >
              {saving ? "Saving..." : currentQuestion === totalQuestions - 1 ? "Complete Quiz" : "Next Question"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default QuizSection;
