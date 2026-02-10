import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Globe, Mail, Star } from "lucide-react";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TravelsBeyondSection from "@/components/TravelsBeyondSection";
import ResortCardsSection from "@/components/ResortCardsSection";
import StatsSection from "@/components/StatsSection";
import QuizSection from "@/components/QuizSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PackagesSection from "@/components/PackagesSection";
import DestinationsSection from "@/components/DestinationsSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingBudget, setBookingBudget] = useState("");
  const [bookingTravelers, setBookingTravelers] = useState("");
  const [bookingPreferences, setBookingPreferences] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      location: "Discovered in Morocco",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80",
      text: "MystiGo completely surprised me! I thought I was going somewhere tropical, but ended up in the magical souks of Marrakech. Best decision ever!",
      rating: 5,
    },
    {
      id: 2,
      name: "James Rodriguez",
      location: "Discovered in Norway",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      text: "The Northern Lights weren't even on my bucket list until MystiGo sent me to Norway. Now I can't stop thinking about my next mystery trip!",
      rating: 5,
    },
    {
      id: 3,
      name: "Emily Thompson",
      location: "Discovered in Peru",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      text: "Hiking Machu Picchu was incredible, but the real magic was not knowing where I was going until the last minute. Pure adventure!",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Welcome to MystiGo!",
      description: "You'll receive our latest mystery destinations and exclusive offers.",
    });
    setIsNewsletterOpen(false);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to book a mystery trip." });
      navigate("/auth");
      return;
    }
    setBookingLoading(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      full_name: bookingName,
      email: bookingEmail,
      budget_range: bookingBudget,
      num_travelers: bookingTravelers,
      preferences: bookingPreferences,
    });
    setBookingLoading(false);
    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booking Request Received!", description: "We'll contact you within 24 hours." });
      setBookingName(""); setBookingEmail(""); setBookingBudget(""); setBookingTravelers(""); setBookingPreferences("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-[52px]" />

      <HeroSection />
      <TravelsBeyondSection />
      <ResortCardsSection />
      <StatsSection />
      <QuizSection />
      <HowItWorksSection />
      <PackagesSection />
      <DestinationsSection />
      <CTASection />

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">What Our Travelers Say</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Real stories from real mystery travelers
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="bg-gray-50 border-0 p-8 text-center rounded-2xl">
              <CardContent className="p-0">
                <div className="mb-6">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <blockquote className="text-lg text-gray-800 mb-6 leading-relaxed italic">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>

                <div className="text-black font-semibold text-sm">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-500 text-xs">
                  {testimonials[currentTestimonial].location}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-accent" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="contact" className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Your Mystery</h2>
            <p className="text-white/80 text-sm mb-10">
              Tell us your preferences and budget, and we'll craft the perfect surprise adventure
            </p>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="text-left">
                      <Label htmlFor="name" className="text-white text-xs">Full Name</Label>
                      <Input id="name" placeholder="Enter your name" value={bookingName} onChange={(e) => setBookingName(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm" required />
                    </div>
                    <div className="text-left">
                      <Label htmlFor="email" className="text-white text-xs">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" value={bookingEmail} onChange={(e) => setBookingEmail(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm" required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="text-left">
                      <Label htmlFor="budget" className="text-white text-xs">Budget Range</Label>
                      <Select value={bookingBudget} onValueChange={setBookingBudget}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white text-sm">
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="$500 - $1,000">$500 - $1,000</SelectItem>
                          <SelectItem value="$1,000 - $2,500">$1,000 - $2,500</SelectItem>
                          <SelectItem value="$2,500 - $5,000">$2,500 - $5,000</SelectItem>
                          <SelectItem value="$5,000+">$5,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-left">
                      <Label htmlFor="travelers" className="text-white text-xs">Number of Travelers</Label>
                      <Select value={bookingTravelers} onValueChange={setBookingTravelers}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white text-sm">
                          <SelectValue placeholder="Select travelers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Traveler</SelectItem>
                          <SelectItem value="2">2 Travelers</SelectItem>
                          <SelectItem value="3-4">3-4 Travelers</SelectItem>
                          <SelectItem value="5+">5+ Travelers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="text-left">
                    <Label htmlFor="preferences" className="text-white text-xs">Travel Preferences</Label>
                    <Textarea
                      id="preferences"
                      placeholder="Tell us about your interests, activity level, climate preferences, etc."
                      value={bookingPreferences}
                      onChange={(e) => setBookingPreferences(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[80px] text-sm"
                    />
                  </div>

                  <Button type="submit" disabled={bookingLoading} className="w-full bg-accent text-black hover:bg-accent/90 text-sm py-5 font-semibold">
                    <Gift className="w-4 h-4 mr-2" />
                    {bookingLoading ? "Submitting..." : "Book My Mystery Trip"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-extrabold tracking-widest uppercase mb-4">MYSTIGO</h3>
              <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                Creating unforgettable mystery travel experiences since 2020.
              </p>
              <div className="flex space-x-3">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Globe className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-xs">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#press" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-xs">
                <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#safety" className="hover:text-white transition-colors">Safety</a></li>
                <li><a href="#cancellation" className="hover:text-white transition-colors">Cancellation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Newsletter</h4>
              <p className="text-gray-400 text-xs mb-4">Get mystery destinations in your inbox</p>
              <Dialog open={isNewsletterOpen} onOpenChange={setIsNewsletterOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-accent text-black hover:bg-accent/90 text-xs">Subscribe</Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1a1a1a] border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">Join Our Newsletter</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <Input type="email" placeholder="Enter your email" className="bg-white/10 border-white/20 text-white text-sm" required />
                    <Button type="submit" className="w-full bg-accent text-black hover:bg-accent/90 text-sm">Subscribe</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs">© 2024 MystiGo. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#privacy" className="text-gray-400 hover:text-white text-xs transition-colors">Privacy Policy</a>
              <a href="#terms" className="text-gray-400 hover:text-white text-xs transition-colors">Terms of Service</a>
              <a href="#cookies" className="text-gray-400 hover:text-white text-xs transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
