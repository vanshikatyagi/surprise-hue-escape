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
import { Hotel, Star, MapPin, Wifi, UtensilsCrossed, Waves } from "lucide-react";
import Header from "@/components/Header";

const sampleHotels = [
  { name: "Soneva Jani Overwater Villa", city: "Maldives", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600", price: 1500, rating: 5.0, reviews: 342, room: "overwater villa", amenities: ["Pool", "Spa", "Restaurant", "WiFi"] },
  { name: "Aman Tokyo", city: "Tokyo, Japan", image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600", price: 890, rating: 4.9, reviews: 215, room: "deluxe suite", amenities: ["Spa", "Restaurant", "Bar", "WiFi"] },
  { name: "Riad Yasmine", city: "Marrakech, Morocco", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600", price: 220, rating: 4.8, reviews: 567, room: "standard", amenities: ["Pool", "Restaurant", "WiFi"] },
  { name: "Santorini Grace Hotel", city: "Santorini, Greece", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600", price: 650, rating: 4.9, reviews: 423, room: "suite", amenities: ["Pool", "Spa", "Restaurant", "WiFi"] },
  { name: "The Mulia Bali", city: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600", price: 380, rating: 4.7, reviews: 891, room: "deluxe", amenities: ["Pool", "Spa", "Beach", "WiFi"] },
  { name: "Belmond Hotel Caruso", city: "Amalfi Coast, Italy", image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=600", price: 780, rating: 4.8, reviews: 198, room: "suite", amenities: ["Pool", "Restaurant", "Garden", "WiFi"] },
];

const amenityIcons: Record<string, any> = { WiFi: Wifi, Restaurant: UtensilsCrossed, Pool: Waves };

const HotelBooking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomFilter, setRoomFilter] = useState("all");
  const [booking, setBooking] = useState(false);

  const filtered = sampleHotels.filter(h => {
    const matchCity = !searchCity || h.city.toLowerCase().includes(searchCity.toLowerCase());
    const matchRoom = roomFilter === "all" || h.room.includes(roomFilter);
    return matchCity && matchRoom;
  });

  const bookHotel = async (hotel: typeof sampleHotels[0]) => {
    if (!user) { toast({ title: "Sign in required" }); navigate("/auth"); return; }
    setBooking(true);
    try {
      const cin = checkIn || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
      const cout = checkOut || new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0];
      const nights = Math.max(1, Math.ceil((new Date(cout).getTime() - new Date(cin).getTime()) / 86400000));
      const { error } = await supabase.from("hotels").insert({
        user_id: user.id,
        hotel_name: hotel.name,
        city: hotel.city,
        check_in: cin,
        check_out: cout,
        room_type: hotel.room,
        price_per_night: hotel.price,
        total_price: hotel.price * nights,
        image_url: hotel.image,
      });
      if (error) throw error;
      toast({ title: "Hotel Booked! 🏨", description: `${hotel.name} for ${nights} nights confirmed.` });
    } catch (e: any) {
      toast({ title: "Booking failed", description: e.message, variant: "destructive" });
    } finally { setBooking(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-[52px]" />
      
      <div className="bg-[#2d2d2d] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Hotel className="w-10 h-10 mx-auto mb-4 text-accent" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Your Stay</h1>
          <p className="text-white/70 text-sm">Discover handpicked hotels at mystery destinations</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <Card className="bg-white shadow-xl rounded-2xl mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs text-gray-500">Destination</Label>
                <Input placeholder="City or country" value={searchCity} onChange={e => setSearchCity(e.target.value)} className="text-sm" />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Check In</Label>
                <Input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="text-sm" />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Check Out</Label>
                <Input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="text-sm" />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Room Type</Label>
                <Select value={roomFilter} onValueChange={setRoomFilter}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rooms</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
          {filtered.map((hotel, i) => (
            <Card key={i} className="bg-white overflow-hidden hover:shadow-xl transition-shadow rounded-xl group">
              <div className="relative h-48">
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <Badge className="absolute top-3 right-3 bg-white text-black border-0 text-xs font-bold">${hotel.price}/night</Badge>
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{hotel.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{hotel.city}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold">{hotel.rating}</span>
                    <span className="text-[10px] text-gray-400">({hotel.reviews})</span>
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  {hotel.amenities.slice(0, 3).map(a => {
                    const Icon = amenityIcons[a];
                    return <Badge key={a} variant="outline" className="text-[10px] gap-1 px-2 py-0.5">{Icon && <Icon className="w-2.5 h-2.5" />}{a}</Badge>;
                  })}
                </div>
                <Badge className="text-[10px] capitalize mb-3" variant="secondary">{hotel.room}</Badge>
                <Button onClick={() => bookHotel(hotel)} disabled={booking} className="w-full bg-accent text-black hover:bg-accent/90 text-xs font-semibold rounded-lg mt-2">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;
