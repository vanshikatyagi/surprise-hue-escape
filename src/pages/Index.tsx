import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  MapPin, Star, Calendar, DollarSign, Globe, Plane, Search,
  Heart, Menu, X, Sun, Moon, ChevronDown, Timer, Users, Camera,
  Mountain, Waves, Building, Trees, Coffee, Car, Wifi, Play,
  ArrowRight, Eye, Gift, Compass, Shield, Award, Quote, ChevronLeft, 
  ChevronRight, Sparkles, Clock
} from 'lucide-react';
import heroImage from '@/assets/hero-travel.jpg';

const Index = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('EN');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in-on-scroll');
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animate-fade-in-up');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    // Show newsletter modal after 30 seconds
    const timer = setTimeout(() => {
      setShowNewsletterModal(true);
    }, 30000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
    localStorage.setItem('mystigo-favorites', JSON.stringify(favorites));
  };

  const destinations = [
    {
      id: '1',
      name: 'Santorini, Greece',
      country: 'Greece',
      continent: 'Europe',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
      description: 'Stunning white-washed buildings overlooking the Aegean Sea',
      price: { USD: '$1,200', EUR: '€1,100', GBP: '£950', INR: '₹99,000' },
      rating: 4.9,
      category: 'Luxury'
    },
    {
      id: '2',
      name: 'Kyoto, Japan',
      country: 'Japan',
      continent: 'Asia',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      description: 'Ancient temples and traditional culture in Japan\'s former capital',
      price: { USD: '$980', EUR: '€900', GBP: '£780', INR: '₹81,000' },
      rating: 4.8,
      category: 'Cultural'
    },
    {
      id: '3',
      name: 'Maldives',
      country: 'Maldives',
      continent: 'Asia',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
      description: 'Paradise islands with crystal clear waters and luxury resorts',
      price: { USD: '$2,500', EUR: '€2,300', GBP: '£2,000', INR: '₹2,07,000' },
      rating: 4.9,
      category: 'Luxury'
    },
    {
      id: '4',
      name: 'Swiss Alps',
      country: 'Switzerland',
      continent: 'Europe',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
      description: 'Majestic mountain peaks and pristine alpine lakes',
      price: { USD: '$1,800', EUR: '€1,650', GBP: '£1,430', INR: '₹1,49,000' },
      rating: 4.7,
      category: 'Adventure'
    },
    {
      id: '5',
      name: 'Bali, Indonesia',
      country: 'Indonesia',
      continent: 'Asia',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=800&q=80',
      description: 'Tropical paradise with ancient temples and volcanic landscapes',
      price: { USD: '$750', EUR: '€690', GBP: '£600', INR: '₹62,000' },
      rating: 4.6,
      category: 'Cultural'
    },
    {
      id: '6',
      name: 'Iceland',
      country: 'Iceland',
      continent: 'Europe',
      image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80',
      description: 'Land of fire and ice with geysers, waterfalls, and Northern Lights',
      price: { USD: '$1,400', EUR: '€1,280', GBP: '£1,120', INR: '₹1,16,000' },
      rating: 4.8,
      category: 'Adventure'
    },
    {
      id: '7',
      name: 'Morocco',
      country: 'Morocco',
      continent: 'Africa',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=800&q=80',
      description: 'Vibrant souks, desert adventures, and imperial cities',
      price: { USD: '$650', EUR: '€600', GBP: '£520', INR: '₹54,000' },
      rating: 4.5,
      category: 'Cultural'
    },
    {
      id: '8',
      name: 'Peru',
      country: 'Peru',
      continent: 'South America',
      image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
      description: 'Ancient Incan heritage and breathtaking mountain landscapes',
      price: { USD: '$850', EUR: '€780', GBP: '£680', INR: '₹70,000' },
      rating: 4.7,
      category: 'Adventure'
    }
  ];

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
      price: { USD: '$299-899', EUR: '€275-825', GBP: '£240-720', INR: '₹25K-74K' },
      duration: '2-3 days',
      icon: Calendar,
      features: ['Surprise destination reveal 24h before', 'Hotel included', 'Local activity recommendations'],
      popular: false
    },
    {
      id: 'adventure',
      title: 'Adventure Seeker',
      description: 'For thrill seekers and explorers',
      price: { USD: '$799-2,499', EUR: '€735-2,299', GBP: '£640-2,000', INR: '₹66K-2.1L' },
      duration: '5-7 days',
      icon: Mountain,
      features: ['Adventure activities included', 'Professional guide', 'All gear provided', 'Small group experience'],
      popular: true
    },
    {
      id: 'luxury',
      title: 'Luxury Surprise',
      description: 'Premium comfort meets mystery',
      price: { USD: '$1,999-5,999', EUR: '€1,840-5,520', GBP: '£1,600-4,800', INR: '₹1.7L-5L' },
      duration: '7-10 days',
      icon: Award,
      features: ['5-star accommodations', 'Private transfers', 'Concierge service', 'Exclusive experiences'],
      popular: false
    }
  ];

  const features = [
    {
      icon: Gift,
      title: "Choose Your Budget",
      description: "Set your price range and travel preferences, from budget-friendly to luxury experiences."
    },
    {
      icon: Compass,
      title: "We Plan Your Adventure",
      description: "Our travel experts craft the perfect surprise trip based on your style and interests."
    },
    {
      icon: Eye,
      title: "Discover Your Destination",
      description: "Get your destination revealed 24-48 hours before departure for maximum excitement!"
    }
  ];

  const continents = ['All', 'Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'];
  const currencies = ['USD', 'EUR', 'GBP', 'INR'];
  const languages = ['EN', 'ES', 'FR', 'DE', 'JA'];

  const filteredDestinations = selectedContinent === 'All' 
    ? destinations 
    : destinations.filter(dest => dest.continent === selectedContinent);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <h1 className="text-3xl font-serif font-bold gradient-text">MystiGo</h1>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="nav-link hover-scale">Home</a>
              <a href="#destinations" className="nav-link hover-scale">Destinations</a>
              <a href="#packages" className="nav-link hover-scale">Packages</a>
              <a href="#about" className="nav-link hover-scale">About</a>
              <a href="#contact" className="nav-link hover-scale">Contact</a>
              
              {/* Currency Selector */}
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent border border-white/20 rounded-lg px-3 py-1 text-sm"
              >
                {currencies.map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>

              {/* Language Selector */}
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent border border-white/20 rounded-lg px-3 py-1 text-sm"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleDarkMode}
                className="glass-button hover-scale"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button className="glass-button ripple-button" onClick={() => navigate('/preferences')}>
                Book Mystery Trip
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleDarkMode}
                className="mr-2"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-card border-t border-white/10 animate-fade-in">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">Home</a>
              <a href="#destinations" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">Destinations</a>
              <a href="#packages" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">Packages</a>
              <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">About</a>
              <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">Contact</a>
              <Button className="glass-button w-full mt-4" onClick={() => navigate('/preferences')}>
                Book Mystery Trip
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Exact WanderNest Design */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-500">
        {/* Background Image - Mountains */}
        <div 
          className="absolute bottom-0 w-full h-2/3 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            filter: 'brightness(0.9) contrast(1.1)',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)'
          }}
        />
        
        {/* Clouds Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20" />
        
        {/* Stars decorations */}
        <div className="absolute top-16 left-16 text-white/60 text-4xl">✦</div>
        <div className="absolute top-20 right-20 text-white/60 text-3xl">✦</div>
        
        {/* Main Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          {/* Small label */}
          <div className="absolute top-8 left-8 text-white/80 text-sm font-medium tracking-wide">
            CAPA 2023
          </div>
          
          <div className="absolute top-8 right-8 text-white/80 text-sm font-medium tracking-wide">
            DA / LVMBOOK
          </div>
          
          {/* Main Typography - Exact WanderNest Style */}
          <div className="mb-16">
            <h1 className="font-black tracking-tight leading-none mb-4">
              <span className="block text-white text-8xl md:text-9xl drop-shadow-lg">
                Mysti
              </span>
              <span className="block text-yellow-400 text-8xl md:text-9xl drop-shadow-lg -mt-8">
                Go
              </span>
            </h1>
            <h2 className="text-white text-2xl md:text-3xl font-light tracking-wider opacity-90">
              Travel agency
            </h2>
          </div>
          
          {/* Airplane Icon */}
          <div className="absolute bottom-32 right-1/3 text-white">
            <Plane className="h-12 w-12 transform rotate-12" fill="currentColor" />
          </div>
        </div>
        
        {/* Design Labels */}
        <div className="absolute bottom-8 left-8 text-white/60 text-sm font-medium">
          Design concept
        </div>
        <div className="absolute bottom-8 right-8 text-white/60 text-sm font-medium">
          Corporate website
        </div>
      </section>

      {/* Navigation Bar - WanderNest Style */}
      <section className="bg-cyan-500 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center space-x-12 text-white">
            <a href="#home" className="text-lg font-medium hover:text-yellow-300 transition-colors">HOME</a>
            <a href="#about" className="text-lg font-medium hover:text-yellow-300 transition-colors">ABOUT US</a>
            <a href="#tours" className="text-lg font-medium hover:text-yellow-300 transition-colors">TOURS</a>
            <a href="#destinations" className="text-lg font-medium hover:text-yellow-300 transition-colors">DESTINATIONS</a>
            <a href="#blog" className="text-lg font-medium hover:text-yellow-300 transition-colors">BLOG</a>
            <a href="#contact" className="text-lg font-medium hover:text-yellow-300 transition-colors">CONTACT</a>
          </div>
        </div>
      </section>

      {/* About Section - WanderNest Layout */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                About
                <span className="block text-cyan-500">MystiGo</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                We specialize in creating unforgettable mystery travel experiences. Our unique approach 
                combines the thrill of surprise with carefully curated destinations, ensuring every 
                journey is an adventure waiting to unfold.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-10">
                From luxury escapes to adventurous expeditions, we handle every detail while keeping 
                your destination a beautiful secret until the perfect moment.
              </p>
              <Button 
                size="lg" 
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-12 py-4 text-lg font-bold rounded-full transition-all duration-300 hover:scale-105"
              >
                Discover More
              </Button>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Travel Experience"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-3xl font-black text-gray-900">🌟</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid - WanderNest Style */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Our <span className="text-cyan-500">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive travel solutions designed to create your perfect mystery adventure
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Mystery Destinations",
                description: "Carefully selected surprise locations tailored to your preferences",
                icon: "🗺️",
                color: "bg-cyan-500"
              },
              {
                title: "Luxury Accommodations", 
                description: "Premium hotels and unique stays for unforgettable experiences",
                icon: "🏨",
                color: "bg-yellow-400"
              },
              {
                title: "Expert Planning",
                description: "Professional travel consultants handling every detail of your journey",
                icon: "✈️",
                color: "bg-teal-500"
              }
            ].map((service, index) => (
              <Card key={index} className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className={`w-20 h-20 ${service.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                    <span className="text-3xl">{service.icon}</span>
                  </div>
                  <CardTitle className="text-2xl font-black text-gray-900 text-center">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 text-center text-lg leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mystery Trip Packages */}
      <section id="packages" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 fade-in-on-scroll">
            <h2 className="text-5xl md:text-6xl font-serif font-bold gradient-text mb-8">
              Mystery Trip Packages
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose your adventure style and let us surprise you with the perfect destination
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card key={pkg.id} className={`glass-card p-8 fade-in-on-scroll hover-scale relative ${pkg.popular ? 'ring-2 ring-primary' : ''}`}>
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                )}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-6">
                    <pkg.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-2">{pkg.title}</h3>
                  <p className="text-muted-foreground mb-4">{pkg.description}</p>
                  <div className="text-3xl font-bold gradient-text mb-2">{pkg.price[currency as keyof typeof pkg.price]}</div>
                  <p className="text-sm text-muted-foreground">{pkg.duration}</p>
                </div>
                
                <div className="space-y-3 mb-8">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full glass-button ripple-button" onClick={() => navigate('/preferences')}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Book This Package
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Explorer */}
      <section id="destinations" className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 fade-in-on-scroll">
            <h2 className="text-5xl md:text-6xl font-serif font-bold gradient-text mb-8">
              Discover Amazing Destinations
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              From hidden gems to world-famous landmarks, explore our curated collection of destinations
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  placeholder="Search destinations..." 
                  className="pl-12 py-4 text-lg glass-card border-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Continent Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {continents.map((continent) => (
                <Button
                  key={continent}
                  variant={selectedContinent === continent ? "default" : "outline"}
                  onClick={() => setSelectedContinent(continent)}
                  className="px-6 py-3 glass-button"
                >
                  {continent}
                </Button>
              ))}
            </div>
          </div>

          {/* Destinations Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="glass-card overflow-hidden group hover-scale fade-in-on-scroll">
                <div className="relative overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="glass-button hover-scale"
                      onClick={() => toggleFavorite(destination.id)}
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(destination.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="font-semibold text-lg">{destination.name}</p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                      <span>{destination.rating}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif font-bold text-xl mb-2">{destination.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{destination.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold gradient-text">
                      {destination.price[currency as keyof typeof destination.price]}
                    </span>
                    <Button size="sm" className="glass-button">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 fade-in-on-scroll">
            <h2 className="text-5xl md:text-6xl font-serif font-bold gradient-text mb-8">
              Traveler Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear from adventurers who discovered their perfect surprise destinations
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <Card className="glass-card p-12 text-center fade-in-on-scroll">
              <Quote className="h-12 w-12 text-primary mx-auto mb-8 opacity-20" />
              <div className="mb-8">
                <img 
                  src={testimonials[currentTestimonial].image} 
                  alt={testimonials[currentTestimonial].name}
                  className="w-20 h-20 rounded-full mx-auto mb-6 border-4 border-primary/20"
                />
                <blockquote className="text-xl md:text-2xl font-serif italic mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <cite className="text-lg font-semibold">{testimonials[currentTestimonial].name}</cite>
                <p className="text-muted-foreground">{testimonials[currentTestimonial].location}</p>
              </div>
            </Card>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 glass-button"
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 glass-button"
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Booking Section */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 fade-in-on-scroll">
            <h2 className="text-5xl md:text-6xl font-serif font-bold gradient-text mb-8">
              Ready for Your Mystery Adventure?
            </h2>
            <p className="text-xl text-muted-foreground">
              Tell us your preferences and let the magic begin
            </p>
          </div>

          <Card className="glass-card p-8 fade-in-on-scroll">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range</label>
                  <select className="w-full glass-card border-white/20 rounded-lg px-4 py-3">
                    <option>$500 - $1,000</option>
                    <option>$1,000 - $2,500</option>
                    <option>$2,500 - $5,000</option>
                    <option>$5,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Travel Style</label>
                  <select className="w-full glass-card border-white/20 rounded-lg px-4 py-3">
                    <option>Adventure</option>
                    <option>Luxury</option>
                    <option>Cultural</option>
                    <option>Relaxation</option>
                  </select>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Departure Date</label>
                  <Input type="date" className="glass-card border-white/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Travelers</label>
                  <select className="w-full glass-card border-white/20 rounded-lg px-4 py-3">
                    <option>1 Traveler</option>
                    <option>2 Travelers</option>
                    <option>3-4 Travelers</option>
                    <option>5+ Travelers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Special Preferences</label>
                <textarea 
                  className="w-full glass-card border-white/20 rounded-lg px-4 py-3 h-24" 
                  placeholder="Tell us about your interests, any activities you love or want to avoid..."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full glass-button ripple-button text-xl py-6"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/preferences');
                }}
              >
                <Gift className="mr-3 h-6 w-6" />
                Create My Mystery Trip 🎁
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* About MystiGo */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center parallax-slow opacity-30"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl fade-in-on-scroll">
            <h2 className="text-5xl md:text-6xl font-serif font-bold gradient-text mb-8">
              About MystiGo
            </h2>
            <div className="text-xl leading-relaxed space-y-6 text-muted-foreground">
              <p>
                At MystiGo, we believe that the best adventures come from the unexpected. Founded by passionate travelers who understand that sometimes the most memorable journeys are the ones you never planned.
              </p>
              <p>
                Our mission is simple: <strong className="text-foreground">Travel made magical through surprise adventures.</strong> We combine cutting-edge technology with human expertise to match you with destinations that exceed your wildest dreams.
              </p>
              <p>
                From bustling cities to remote islands, ancient temples to modern marvels – every MystiGo trip is carefully crafted to create those "pinch me" moments that make travel truly transformative.
              </p>
            </div>
            
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
                <p className="text-muted-foreground">Happy Travelers</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">100+</div>
                <p className="text-muted-foreground">Countries Covered</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">4.9</div>
                <p className="text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Modal */}
      {showNewsletterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => setShowNewsletterModal(false)} />
          <Card className="glass-card p-8 max-w-md w-full relative animate-scale-in">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => setShowNewsletterModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-2">Stay in the Loop!</h3>
              <p className="text-muted-foreground">Get exclusive mystery destination reveals and special offers</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setShowNewsletterModal(false);
              // Handle newsletter signup
            }}>
              <Input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="mb-4 glass-card border-white/20"
                required
              />
              <Button type="submit" className="w-full glass-button ripple-button">
                Subscribe to Mystery Updates
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-serif font-bold gradient-text mb-4">MystiGo</h3>
              <p className="text-muted-foreground mb-4">
                Your gateway to surprise adventures around the world.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                  <Button key={social} variant="ghost" size="sm" className="glass-button hover-scale">
                    <Globe className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Destinations</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><a href="#" className="hover:text-foreground transition-colors">Europe</a></p>
                <p><a href="#" className="hover:text-foreground transition-colors">Asia</a></p>
                <p><a href="#" className="hover:text-foreground transition-colors">Africa</a></p>
                <p><a href="#" className="hover:text-foreground transition-colors">Americas</a></p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><a href="#" className="hover:text-foreground transition-colors">About Us</a></p>
                <p><a href="#" className="hover:text-foreground transition-colors">How It Works</a></p>
                <p><a href="#" className="hover:text-foreground transition-colors">Safety</a></p>
                <p><a href="#" className="hover:text-foreground transition-colors">Careers</a></p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><a href="#" className="hover:text-foreground transition-colors">Help Center</a></p>
                <p><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></p>
                <p><a href="#" className="hover:text-foreground transition-colors">Terms</a></p>
                <p><a href="#" className="hover:text-foreground transition-colors">Privacy</a></p>
              </div>
            </div>
          </div>
          
          <Separator className="mb-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2024 MystiGo. All rights reserved.</p>
            <p>Made with ❤️ for adventure seekers worldwide</p>
          </div>
        </div>
      </footer>

      {/* Floating Chat Widget */}
      <Button 
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full glass-button shadow-elegant floating"
        onClick={() => alert('Chat feature coming soon!')}
      >
        <Camera className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Index;