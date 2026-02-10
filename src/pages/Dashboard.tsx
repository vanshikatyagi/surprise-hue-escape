import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  MapPin, Calendar, Star, Trophy, Plane, Plus, Settings, Bell, LogOut, User
} from 'lucide-react';

interface QuizResult {
  id: string;
  travel_style: string;
  trip_duration: string;
  budget: string;
  travel_companions: string;
  created_at: string;
}

interface Booking {
  id: string;
  full_name: string;
  email: string;
  budget_range: string;
  num_travelers: string;
  preferences: string | null;
  status: string;
  created_at: string;
}

interface Profile {
  full_name: string | null;
  email: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, quizRes, bookingsRes] = await Promise.all([
        supabase.from("profiles").select("full_name, email").eq("user_id", user.id).maybeSingle(),
        supabase.from("quiz_results").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("bookings").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (quizRes.data) setQuizResults(quizRes.data);
      if (bookingsRes.data) setBookings(bookingsRes.data);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Explorer";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#2d2d2d] text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-extrabold tracking-widest uppercase">MYSTIGO</a>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/70">{user?.email}</span>
            <Button onClick={handleSignOut} variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {displayName}! 👋</h1>
        <p className="text-gray-500 mb-8">Here's your travel overview</p>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bookings */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Your Bookings</h2>
                <Button onClick={() => navigate("/#contact")} size="sm" className="bg-[#2d2d2d] text-white hover:bg-[#3d3d3d]">
                  <Plus className="w-4 h-4 mr-1" /> New Booking
                </Button>
              </div>
              {bookings.length === 0 ? (
                <Card className="p-8 text-center bg-white rounded-xl">
                  <Plane className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No bookings yet. Start your first mystery trip!</p>
                  <Button onClick={() => navigate("/#contact")} className="mt-4 bg-accent text-black hover:bg-accent/90 text-sm">
                    Book Now
                  </Button>
                </Card>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="p-5 bg-white rounded-xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{booking.full_name}</h3>
                          <p className="text-sm text-gray-500">Budget: {booking.budget_range} · {booking.num_travelers} traveler(s)</p>
                          {booking.preferences && <p className="text-sm text-gray-400 mt-1 line-clamp-1">{booking.preferences}</p>}
                        </div>
                        <Badge className={booking.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">{new Date(booking.created_at).toLocaleDateString()}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Results */}
            <Card className="p-6 bg-white rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Travel Preferences
              </h3>
              {quizResults.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm mb-3">Take the quiz to discover your style!</p>
                  <Button onClick={() => navigate("/")} size="sm" className="bg-accent text-black hover:bg-accent/90 text-sm">
                    Take Quiz
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {quizResults.slice(0, 3).map((result) => (
                    <div key={result.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div><span className="text-gray-400">Style:</span> <span className="font-medium text-gray-700">{result.travel_style}</span></div>
                        <div><span className="text-gray-400">Duration:</span> <span className="font-medium text-gray-700">{result.trip_duration}</span></div>
                        <div><span className="text-gray-400">Budget:</span> <span className="font-medium text-gray-700">{result.budget}</span></div>
                        <div><span className="text-gray-400">With:</span> <span className="font-medium text-gray-700">{result.travel_companions}</span></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">{new Date(result.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 bg-white rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Bookings</span>
                  <span className="font-semibold text-gray-900">{bookings.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quizzes Taken</span>
                  <span className="font-semibold text-gray-900">{quizResults.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Member Since</span>
                  <span className="font-semibold text-gray-900">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-white rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm" onClick={() => navigate("/")}>
                  <MapPin className="w-4 h-4 mr-2" /> Explore Destinations
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" onClick={() => navigate("/#contact")}>
                  <Plane className="w-4 h-4 mr-2" /> Book New Trip
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
