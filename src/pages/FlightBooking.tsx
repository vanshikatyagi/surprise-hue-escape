import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Plane, ArrowRight, Clock, Star } from "lucide-react";
import Header from "@/components/Header";

const sampleFlights = [
  { airline: "MystiGo Air", flight: "MG-101", from: "New York (JFK)", to: "Bali (DPS)", depart: "08:00", arrive: "18:30", duration: "22h 30m", price: 899, class: "economy", stops: "1 stop", rating: 4.8 },
  { airline: "MystiGo Air", flight: "MG-205", from: "London (LHR)", to: "Tokyo (NRT)", depart: "10:15", arrive: "06:45", duration: "11h 30m", price: 1249, class: "business", stops: "Direct", rating: 4.9 },
  { airline: "MystiGo Air", flight: "MG-310", from: "Dubai (DXB)", to: "Santorini (JTR)", depart: "14:00", arrive: "18:00", duration: "5h", price: 599, class: "economy", stops: "Direct", rating: 4.7 },
  { airline: "MystiGo Air", flight: "MG-422", from: "Paris (CDG)", to: "Marrakech (RAK)", depart: "09:30", arrive: "12:00", duration: "3h 30m", price: 349, class: "economy", stops: "Direct", rating: 4.6 },
  { airline: "MystiGo Air", flight: "MG-550", from: "Sydney (SYD)", to: "Maldives (MLE)", depart: "22:00", arrive: "05:30", duration: "10h 30m", price: 1599, class: "first", stops: "1 stop", rating: 5.0 },
  { airline: "MystiGo Air", flight: "MG-618", from: "Los Angeles (LAX)", to: "Barcelona (BCN)", depart: "16:00", arrive: "11:30", duration: "11h 30m", price: 749, class: "economy", stops: "Direct", rating: 4.5 },
];

const FlightBooking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [booking, setBooking] = useState(false);

  const filtered = sampleFlights.filter(f => {
    const matchFrom = !searchFrom || f.from.toLowerCase().includes(searchFrom.toLowerCase());
    const matchTo = !searchTo || f.to.toLowerCase().includes(searchTo.toLowerCase());
    const matchClass = classFilter === "all" || f.class === classFilter;
    return matchFrom && matchTo && matchClass;
  });

  const bookFlight = async (flight: typeof sampleFlights[0]) => {
    if (!user) { toast({ title: "Sign in required" }); navigate("/auth"); return; }
    setBooking(true);
    try {
      const departDate = travelDate ? new Date(travelDate) : new Date(Date.now() + 7 * 86400000);
      const arriveDate = new Date(departDate.getTime() + parseInt(flight.duration) * 3600000);
      const { error } = await supabase.from("flights").insert({
        user_id: user.id,
        airline: flight.airline,
        flight_number: flight.flight,
        departure_city: flight.from,
        arrival_city: flight.to,
        departure_date: departDate.toISOString(),
        arrival_date: arriveDate.toISOString(),
        price: flight.price,
        class: flight.class,
      });
      if (error) throw error;
      toast({ title: "Flight Booked! ✈️", description: `${flight.from} → ${flight.to} confirmed.` });
    } catch (e: any) {
      toast({ title: "Booking failed", description: e.message, variant: "destructive" });
    } finally { setBooking(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-[52px]" />
      
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Plane className="w-10 h-10 mx-auto mb-4 text-accent" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Your Flight</h1>
          <p className="text-white/70 text-sm">Book mystery flights to incredible destinations</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <Card className="bg-white shadow-xl rounded-2xl mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs text-gray-500">From</Label>
                <Input placeholder="Departure city" value={searchFrom} onChange={e => setSearchFrom(e.target.value)} className="text-sm" />
              </div>
              <div>
                <Label className="text-xs text-gray-500">To</Label>
                <Input placeholder="Destination" value={searchTo} onChange={e => setSearchTo(e.target.value)} className="text-sm" />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Date</Label>
                <Input type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} className="text-sm" />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Class</Label>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 pb-16">
          {filtered.map((flight, i) => (
            <Card key={i} className="bg-white hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Plane className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{flight.airline}</p>
                      <p className="text-xs text-gray-400">{flight.flight}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-1 justify-center">
                    <div className="text-center">
                      <p className="font-bold text-lg text-gray-900">{flight.depart}</p>
                      <p className="text-xs text-gray-500">{flight.from.split("(")[0].trim()}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-[10px] text-gray-400">{flight.duration}</p>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="w-20 h-[1px] bg-gray-300" />
                        <ArrowRight className="w-3 h-3 text-primary" />
                      </div>
                      <p className="text-[10px] text-gray-400">{flight.stops}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-gray-900">{flight.arrive}</p>
                      <p className="text-xs text-gray-500">{flight.to.split("(")[0].trim()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{flight.rating}</span>
                      </div>
                      <Badge className="text-[10px] capitalize" variant="outline">{flight.class}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-gray-900">${flight.price}</p>
                      <Button onClick={() => bookFlight(flight)} disabled={booking} size="sm" className="mt-1 bg-accent text-black hover:bg-accent/90 text-xs font-semibold rounded-lg">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightBooking;
