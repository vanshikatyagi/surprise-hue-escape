import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Star, 
  Trophy, 
  Plane, 
  Heart, 
  Plus,
  Settings,
  Bell,
  User
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const savedTrips = [
    {
      id: 1,
      destination: 'Kyoto, Japan',
      status: 'Booked',
      date: 'Dec 15-22, 2024',
      image: '/api/placeholder/300/200',
      progress: 100
    },
    {
      id: 2,
      destination: 'Santorini, Greece',
      status: 'Saved',
      date: 'Mar 10-16, 2025',
      image: '/api/placeholder/300/200',
      progress: 0
    },
    {
      id: 3,
      destination: 'Patagonia, Chile',
      status: 'Planning',
      date: 'Summer 2025',
      image: '/api/placeholder/300/200',
      progress: 45
    }
  ];

  const achievements = [
    { id: 1, name: 'First Adventure', icon: '🎯', unlocked: true, color: 'primary' },
    { id: 2, name: 'Globe Trotter', icon: '🌍', unlocked: true, color: 'secondary' },
    { id: 3, name: 'Culture Explorer', icon: '🏛️', unlocked: false, color: 'accent' },
    { id: 4, name: 'Mountain Climber', icon: '⛰️', unlocked: false, color: 'accent-coral' },
  ];

  const upcomingBooking = savedTrips.find(trip => trip.status === 'Booked');

  return (
    <div className="min-h-screen p-4">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating absolute top-20 left-10 text-3xl">✈️</div>
        <div className="floating-delayed absolute top-40 right-20 text-2xl">🌟</div>
        <div className="floating absolute bottom-40 left-20 text-2xl">🎒</div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Welcome back, Explorer! 👋</h1>
            <p className="text-muted-foreground mt-2">Ready for your next adventure?</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="glass-button">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="glass-button">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="glass-button">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Next Trip Countdown */}
            {upcomingBooking && (
              <Card className="glass-card p-6 animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Next Adventure</h2>
                  <Badge className="bg-accent text-accent-foreground">
                    {upcomingBooking.status}
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{upcomingBooking.destination}</h3>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      {upcomingBooking.date}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Trip Preparation</span>
                        <span>{upcomingBooking.progress}%</span>
                      </div>
                      <Progress value={upcomingBooking.progress} className="h-2" />
                    </div>
                    <Button className="glass-button ripple-button mt-4">
                      <Plane className="h-4 w-4 mr-2" />
                      View Trip Details
                    </Button>
                  </div>
                  <div className="h-40 bg-gradient-to-br from-primary to-secondary rounded-2xl"></div>
                </div>
              </Card>
            )}

            {/* Saved Trips */}
            <div className="animate-fade-in-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Trips</h2>
                <Button 
                  className="glass-button ripple-button"
                  onClick={() => navigate('/preferences')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Plan New Trip
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {savedTrips.map((trip) => (
                  <Card key={trip.id} className="glass-card overflow-hidden group cursor-pointer bounce-hover">
                    <div className="h-32 bg-gradient-to-br from-primary via-secondary to-accent relative">
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-4 right-4">
                        <Badge 
                          variant={trip.status === 'Booked' ? 'default' : 'secondary'}
                          className="backdrop-blur-sm"
                        >
                          {trip.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{trip.destination}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <Calendar className="h-3 w-3 mr-1" />
                        {trip.date}
                      </div>
                      {trip.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{trip.progress}%</span>
                          </div>
                          <Progress value={trip.progress} className="h-1" />
                        </div>
                      )}
                      <div className="flex justify-between mt-3">
                        <Button size="sm" variant="outline" className="glass-button">
                          <Heart className="h-3 w-3 mr-1" />
                          Saved
                        </Button>
                        <Button size="sm" className="glass-button">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Travel Stats */}
            <Card className="glass-card p-6 animate-fade-in-up">
              <h3 className="font-semibold mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-accent-yellow" />
                Travel Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Countries Visited</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Trips</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Miles Traveled</span>
                  <span className="font-semibold">45,230</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Travel Level</span>
                  <Badge className="bg-secondary text-secondary-foreground">Explorer</Badge>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="glass-card p-6 animate-fade-in-up">
              <h3 className="font-semibold mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-accent-yellow" />
                Achievements
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg text-center transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'glass-card bounce-hover' 
                        : 'bg-muted/50 opacity-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="text-xs font-medium">{achievement.name}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card p-6 animate-fade-in-up">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full glass-button justify-start"
                  onClick={() => navigate('/preferences')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Plan New Trip
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full glass-button justify-start"
                  onClick={() => navigate('/reveal')}
                >
                  <Star className="h-4 w-4 mr-2" />
                  View Saved Packages
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full glass-button justify-start"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Explore Destinations
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