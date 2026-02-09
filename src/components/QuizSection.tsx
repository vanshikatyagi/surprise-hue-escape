import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mountain, Umbrella, Building, Camera, ChevronRight } from "lucide-react";

const questions = [
  {
    question: "What's your ideal travel style?",
    options: [
      { label: "Adventure & Outdoor", icon: Mountain },
      { label: "Beach & Relaxation", icon: Umbrella },
      { label: "Cultural & Historic", icon: Building },
      { label: "Photography & Nature", icon: Camera },
    ],
  },
  {
    question: "What's your preferred trip duration?",
    options: [
      { label: "Weekend (2-3 days)", icon: Mountain },
      { label: "Short (4-6 days)", icon: Umbrella },
      { label: "Week (7-10 days)", icon: Building },
      { label: "Extended (10+ days)", icon: Camera },
    ],
  },
  {
    question: "What's your budget range?",
    options: [
      { label: "$500 - $1,000", icon: Mountain },
      { label: "$1,000 - $2,500", icon: Umbrella },
      { label: "$2,500 - $5,000", icon: Building },
      { label: "$5,000+", icon: Camera },
    ],
  },
  {
    question: "Who are you traveling with?",
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
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelected(null);
    }
  };

  const q = questions[currentQuestion];

  return (
    <section className="bg-primary py-20">
      <div className="container mx-auto px-4 flex justify-center">
        <Card className="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-2xl">
          {/* Progress */}
          <div className="flex justify-between text-sm mb-3">
            <span className="text-primary font-medium">Question {currentQuestion + 1} of {totalQuestions}</span>
            <span className="text-primary font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden mb-8">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, #2d2d2d ${(currentQuestion / totalQuestions) * 100}%, hsl(48, 100%, 50%) ${(currentQuestion / totalQuestions) * 100}%)`,
              }}
            />
          </div>

          {/* Question */}
          <h3 className="text-xl md:text-2xl font-bold text-primary text-center mb-8">
            {q.question}
          </h3>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {q.options.map((option) => (
              <button
                key={option.label}
                onClick={() => setSelected(option.label)}
                className={`flex items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                  selected === option.label
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50"
                }`}
              >
                <option.icon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-800">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Next Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              disabled={!selected}
              className="bg-accent text-black hover:bg-accent/90 rounded-full px-8 py-3 font-semibold text-sm disabled:opacity-50"
            >
              Next Question <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default QuizSection;
