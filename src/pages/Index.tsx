import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Heart, 
  Star, 
  Users, 
  Mail, 
  Globe, 
  Compass, 
  Gift,
  ChevronLeft,
  ChevronRight,
  Mountain,
  Camera,
  Coffee,
  Utensils,
  Music,
  Sunset,
  Waves,
  Menu
} from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";

const Index = () => {
  const { toast } = useToast();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      location: "Discovered in Morocco",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80",
      text: "MystiGo completely surprised me! I thought I was going somewhere tropical, but ended up in the magical souks of Marrakech. Best decision ever!",
      rating: 5
    },
    {
      id: 2,
      name: "James Rodriguez", 
      location: "Discovered in Norway",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      text: "The Northern Lights weren't even on my bucket list until MystiGo sent me to Norway. Now I can't stop thinking about my next mystery trip!",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Thompson",
      location: "Discovered in Peru", 
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      text: "Hiking Machu Picchu was incredible, but the real magic was not knowing where I was going until the last minute. Pure adventure!",
      rating: 5
    }
  ];

  const packages = [
    {
      id: 'weekend',
      title: 'Weekend Getaway',
      description: 'Perfect for a quick escape',
      price: '$299-899',
      duration: '2-3 days',
      icon: Calendar,
      features: ['Surprise destination reveal 24h before', 'Hotel included', 'Local activity recommendations'],
      popular: false
    },
    {
      id: 'adventure',
      title: 'Adventure Seeker',
      description: 'For thrill seekers and explorers',
      price: '$799-2,499',
      duration: '5-7 days',
      icon: Mountain,
      features: ['Adventure activities included', 'Professional guide', 'All gear provided', 'Small group experience'],
      popular: true
    },
    {
      id: 'luxury',
      title: 'Luxury Surprise',
      description: 'Premium comfort meets mystery',
      price: '$1,999-5,999',
      duration: '7-10 days',
      icon: Star,
      features: ['5-star accommodations', 'Private transfers', 'Concierge service', 'Exclusive experiences'],
      popular: false
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Welcome to MystiGo!",
      description: "You'll receive our latest mystery destinations and exclusive offers.",
    });
    setIsNewsletterOpen(false);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Booking Request Received!",
      description: "We'll contact you within 24 hours to plan your mystery adventure.",
    });
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="relative z-50 bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">
              MystiGo
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-white hover:text-accent transition-colors">Home</a>
              <a href="#packages" className="text-white hover:text-accent transition-colors">Packages</a>
              <a href="#about" className="text-white hover:text-accent transition-colors">About</a>
              <a href="#contact" className="text-white hover:text-accent transition-colors">Contact</a>
            </nav>
            <div className="md:hidden">
              <Menu className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Exact WanderNest Style */}
      <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-primary">
        {/* Main Title */}
        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto mb-20">
          <h1 className="text-[10rem] md:text-[12rem] lg:text-[15rem] xl:text-[18rem] font-black leading-[0.8] tracking-tight mb-4">
            <span className="text-white drop-shadow-2xl block">Mysti</span>
            <span className="text-accent drop-shadow-2xl block -mt-8">Go</span>
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl text-white/90 font-light mt-8">
            Travel agency
          </p>
        </div>

        {/* Mountain Landscape at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-96 z-10">
          <img 
            src={heroImage} 
            alt="Mountain landscape" 
            className="w-full h-full object-cover object-bottom opacity-80"
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-32 left-20 text-white/20">
          <div className="w-6 h-6 border-2 border-current rotate-45"></div>
        </div>
        <div className="absolute top-40 right-20 text-white/20">
          <div className="w-6 h-6 border-2 border-current rotate-45"></div>
        </div>
      </section>

      {/* Left Side - Adventure Section */}
      <section className="flex min-h-screen">
        <div className="w-full lg:w-1/2 bg-black/50 backdrop-blur-sm relative overflow-hidden">
          <img 
            src={heroImage} 
            alt="Adventure landscape" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-center p-8 lg:p-16">
            <div className="max-w-md">
              <div className="mb-6">
                <span className="text-white/60 text-sm uppercase tracking-wide">Now booking</span>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-white border-white/30">Bali</Badge>
                  <Badge variant="outline" className="text-white border-white/30">UAE</Badge>
                  <Badge variant="outline" className="text-white border-white/30">Thailand</Badge>
                  <Badge variant="outline" className="text-white border-white/30">Greece</Badge>
                </div>
              </div>
              
              <p className="text-white/80 text-sm mb-8 leading-relaxed">
                Travel beyond where curiosity leads and let your wanderlust merge in perfect harmony. Let your curiosity lead you to new heights where unforgettable experiences and breathtaking places await.
              </p>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-8">
                TRAVELS<br />
                BEYOND<br />
                THE ORDINARY
              </h2>
              
              <Button 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-3 rounded-none"
              >
                Explore now →
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Destination Cards */}
        <div className="hidden lg:block w-1/2 bg-black p-8">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Dubai Card */}
            <Card className="bg-black border-gray-800 overflow-hidden group cursor-pointer">
              <div className="relative h-64">
                <img 
                  src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400" 
                  alt="Dubai" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-white/80 text-xs">from</span>
                  <span className="text-white text-lg font-bold ml-1">$1,129</span>
                </div>
                <div className="absolute top-4 right-4">
                  <h3 className="text-white text-lg font-bold">Dubai</h3>
                </div>
                <div className="absolute bottom-4 left-4 text-white/80 text-xs">
                  4 nights, 2 adults
                </div>
              </div>
            </Card>

            {/* France Card */}
            <Card className="bg-black border-gray-800 overflow-hidden group cursor-pointer">
              <div className="relative h-64">
                <img 
                  src="https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400" 
                  alt="France" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-white/80 text-xs">from</span>
                  <span className="text-white text-lg font-bold ml-1">$1,800</span>
                </div>
                <div className="absolute top-4 right-4">
                  <h3 className="text-white text-lg font-bold">France</h3>
                </div>
                <div className="absolute bottom-4 left-4 text-white/80 text-xs">
                  7 nights, 2 adults
                </div>
              </div>
            </Card>

            <Card className="bg-black border-gray-800 overflow-hidden group cursor-pointer">
              <div className="relative h-64">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" 
                  alt="Mountain Resort" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-white/80 text-xs">from</span>
                  <span className="text-white text-lg font-bold ml-1">$890</span>
                </div>
                <div className="absolute top-4 right-4">
                  <h3 className="text-white text-lg font-bold">Alps</h3>
                </div>
                <div className="absolute bottom-4 left-4 text-white/80 text-xs">
                  5 nights, 2 adults
                </div>
              </div>
            </Card>

            <Card className="bg-black border-gray-800 overflow-hidden group cursor-pointer">
              <div className="relative h-64">
                <img 
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400" 
                  alt="Beach Resort" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-white/80 text-xs">from</span>
                  <span className="text-white text-lg font-bold ml-1">$1,450</span>
                </div>
                <div className="absolute top-4 right-4">
                  <h3 className="text-white text-lg font-bold">Maldives</h3>
                </div>
                <div className="absolute bottom-4 left-4 text-white/80 text-xs">
                  6 nights, 2 adults
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Mobile Recommended Tours Section */}
      <section className="lg:hidden bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-gray-500 text-sm uppercase tracking-wide">RECOMMENDED TOURS</span>
            <h2 className="text-4xl font-bold text-black mt-2 mb-8">
              Tours<br />
              you will love
            </h2>
          </div>

          <Card className="bg-white shadow-lg rounded-3xl overflow-hidden mb-4">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600" 
                alt="Bali, Uluwatu Cliff Resort" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4">
                <div className="flex items-center text-black text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  Bali, Uluwatu Cliff Resort
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-black mb-2">Included</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Private infinity pool</div>
                  <div>Daily spa credit</div>
                  <div>VIP airport fast-track</div>
                </div>
              </div>
              <div className="bg-black text-white rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm ml-2">(178 reviews)</span>
                  </div>
                  <div className="text-2xl font-bold">$720<span className="text-sm font-normal">/Night</span></div>
                </div>
                <Button className="bg-accent text-black hover:bg-accent/90">
                  Book now
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full bg-accent text-black hover:bg-accent/90 rounded-full py-3">
            Show all
          </Button>
        </div>
      </section>

      {/* Statistics Section - WanderNest Style */}
      <section className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600")'
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 300+ Card */}
            <Card className="bg-accent border-0 p-8 text-center relative overflow-hidden">
              <div className="absolute -top-4 -left-4 w-8 h-8">
                <div className="grid grid-cols-8 gap-1">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-black/20 rounded-full"></div>
                  ))}
                </div>
              </div>
              <div className="text-6xl lg:text-7xl font-black text-black mb-2">300+</div>
              <div className="text-black font-medium text-sm">
                CURATED TRAVEL<br />EXPERIENCES
              </div>
            </Card>

            {/* 98% Card */}
            <Card className="bg-accent border-0 p-8 text-center relative overflow-hidden">
              <div className="absolute -top-4 -left-4 w-8 h-8">
                <div className="grid grid-cols-8 gap-1">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-black/20 rounded-full"></div>
                  ))}
                </div>
              </div>
              <div className="text-6xl lg:text-7xl font-black text-black mb-2">98%</div>
              <div className="text-black font-medium text-sm">
                CLIENT<br />SATISFACTION
              </div>
            </Card>

            {/* 40% Card */}
            <Card className="bg-accent border-0 p-8 text-center relative overflow-hidden">
              <div className="absolute -top-4 -left-4 w-8 h-8">
                <div className="grid grid-cols-8 gap-1">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-black/20 rounded-full"></div>
                  ))}
                </div>
              </div>
              <div className="text-6xl lg:text-7xl font-black text-black mb-2">40%</div>
              <div className="text-black font-medium text-sm">
                SAVINGS WITH<br />EARLY BOOKING
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Resort Cards Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gray-500 text-sm uppercase tracking-wide">SPECIAL OFFERS</span>
            <h2 className="text-4xl font-bold text-black mt-2 mb-8">
              Where comfort<br />
              meets adventure
            </h2>
            <div className="flex justify-center gap-4 mb-8">
              <Badge variant="outline" className="bg-red-500 text-white border-red-500">Maldives</Badge>
              <Badge variant="outline" className="border-gray-300">China</Badge>
              <Badge variant="outline" className="border-gray-300">Chile</Badge>
              <Badge variant="outline" className="border-gray-300">Sri Lanka</Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {/* Resort Cards */}
            {[
              { name: "Soneva Jani", price: "$1,500/night", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400" },
              { name: "Conrad Maldives", price: "$1,200/night", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400" },
              { name: "Kuredu Island Resort", price: "$420/night", image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=400" },
              { name: "Finaidhoo Island Resort", price: "$290/night", image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400" },
              { name: "Banyan Tree Vabbinfaru", price: "$890/night", image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400" }
            ].map((resort, index) => (
              <Card key={index} className="overflow-hidden group cursor-pointer">
                <div className="relative h-64">
                  <img 
                    src={resort.image} 
                    alt={resort.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white/20 rounded-full backdrop-blur-sm">
                    <Heart className="w-4 h-4 text-white" />
                  </button>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-semibold text-sm">{resort.name}</h3>
                    <p className="text-white/80 text-xs">{resort.price}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button className="bg-accent text-black hover:bg-accent/90 rounded-full px-8">
              Show all
            </Button>
          </div>
        </div>
      </section>

      {/* Mystery Packages Section */}
      <section id="packages" className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Mystery Packages</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Choose your adventure level and let us surprise you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <Card key={pkg.id} className={`bg-gray-900 border-gray-800 relative overflow-hidden ${pkg.popular ? 'ring-2 ring-accent' : ''}`}>
                {pkg.popular && (
                  <div className="absolute top-4 right-4 bg-accent text-black text-xs px-3 py-1 rounded-full font-medium">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <pkg.icon className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">{pkg.title}</h3>
                    <p className="text-white/60 mb-4">{pkg.description}</p>
                    <div className="text-3xl font-bold text-accent mb-2">{pkg.price}</div>
                    <div className="text-white/60 text-sm">{pkg.duration}</div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-white/80">
                        <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${pkg.popular ? 'bg-accent text-black hover:bg-accent/90' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    Choose Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">What Our Travelers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real mystery travelers
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-50 border-0 p-8 text-center">
              <CardContent className="p-0">
                <div className="mb-6">
                  <img 
                    src={testimonials[currentTestimonial].image} 
                    alt={testimonials[currentTestimonial].name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-xl text-gray-800 mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                
                <div className="text-black font-semibold">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-600 text-sm">
                  {testimonials[currentTestimonial].location}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-accent' : 'bg-gray-300'
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Start Your Mystery</h2>
            <p className="text-xl text-white/80 mb-12">
              Tell us your preferences and budget, and we'll craft the perfect surprise adventure
            </p>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-white">Full Name</Label>
                      <Input id="name" placeholder="Enter your name" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" required />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" required />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="budget" className="text-white">Budget Range</Label>
                      <Select>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="budget">$500 - $1,000</SelectItem>
                          <SelectItem value="mid">$1,000 - $2,500</SelectItem>
                          <SelectItem value="luxury">$2,500 - $5,000</SelectItem>
                          <SelectItem value="premium">$5,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="travelers" className="text-white">Number of Travelers</Label>
                      <Select>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
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

                  <div>
                    <Label htmlFor="preferences" className="text-white">Travel Preferences</Label>
                    <Textarea 
                      id="preferences" 
                      placeholder="Tell us about your interests, activity level, climate preferences, etc."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[100px]"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-accent text-black hover:bg-accent/90 text-lg py-6">
                    <Gift className="w-5 h-5 mr-2" />
                    Book My Mystery Trip
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">MystiGo</h3>
              <p className="text-gray-400 mb-4">
                Creating unforgettable mystery travel experiences since 2020.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Globe className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Mail className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#press" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#safety" className="hover:text-white transition-colors">Safety</a></li>
                <li><a href="#cancellation" className="hover:text-white transition-colors">Cancellation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Get mystery destinations in your inbox</p>
              <Dialog open={isNewsletterOpen} onOpenChange={setIsNewsletterOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-accent text-black hover:bg-accent/90">
                    Subscribe
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">Join Our Newsletter</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <Input 
                      type="email" 
                      placeholder="Enter your email"
                      className="bg-white/10 border-white/20 text-white"
                      required
                    />
                    <Button type="submit" className="w-full bg-accent text-black hover:bg-accent/90">
                      Subscribe
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 MystiGo. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#cookies" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;