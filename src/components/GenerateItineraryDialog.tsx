import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Map, Sparkles } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GenerateItineraryDialog = ({ open, onOpenChange }: Props) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");

  const handleGenerate = () => {
    if (!destination.trim()) return;
    navigate("/reveal", {
      state: {
        quizData: {
          departure_city: "",
          travel_style: ["Cultural", "Adventure"],
          budget: budget || "Comfortable",
          trip_duration: duration || "5-7 days",
          travel_companions: "Solo",
          climate_preference: [],
          activity_preference: [],
          accommodation_type: ["Hotel"],
          currency: "USD ($)",
          travel_scope: "Surprise Me",
          travel_pace: "Balanced",
        },
        directDestination: destination.trim(),
      },
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Map className="w-5 h-5 text-accent" />
            Generate Itinerary
          </DialogTitle>
          <DialogDescription>
            Enter your destination and preferences to generate a personalized itinerary.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="dest" className="text-sm font-medium">Destination *</Label>
            <Input
              id="dest"
              placeholder="e.g. Tokyo, Japan"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Budget</Label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Optional" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Budget-Friendly">Budget</SelectItem>
                  <SelectItem value="Comfortable">Comfortable</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                  <SelectItem value="Ultra-Luxury">Ultra-Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Optional" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-3 days">2-3 days</SelectItem>
                  <SelectItem value="5-7 days">5-7 days</SelectItem>
                  <SelectItem value="10-14 days">10-14 days</SelectItem>
                  <SelectItem value="2+ weeks">2+ weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={!destination.trim()}
            className="w-full bg-accent text-black hover:bg-accent/90 font-bold gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Generate My Itinerary
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateItineraryDialog;
