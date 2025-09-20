import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { 
  Plane, MapPin, Calendar, Star, Sparkles, ArrowRight, Search, Globe, 
  Heart, Menu, X, Sun, Moon, ChevronDown, Timer, Users, Camera,
  Mountain, Waves, Building, Trees, Coffee, Car, Wifi
} from 'lucide-react';
import heroImage from '@/assets/mystigo-hero-mountain.jpg';

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const destinations = [
    { id: 1, name: 'Santorini, Greece', continent: 'Europe', image: '/api/placeholder/400/300', price: '$299', rating: 4.9 },
    { id: 2, name: 'Kyoto, Japan', continent: 'Asia', image: '/api/placeholder/400/300', price: '$449', rating: 4.8 },
    { id: 3, name: 'Bali, Indonesia', continent: 'Asia', image: '/api/placeholder/400/300', price: '$199', rating: 4.7 },
    { id: 4, name: 'Paris, France', continent: 'Europe', image: '/api/placeholder/400/300', price: '$399', rating: 4.9 },
    { id: 5, name: 'Maldives', continent: 'Asia', image: '/api/placeholder/400/300', price: '$899', rating: 5.0 },
    { id: 6, name: 'Iceland', continent: 'Europe', image: '/api/placeholder/400/300', price: '$599', rating: 4.8 },
    { id: 7, name: 'Dubai, UAE', continent: 'Asia', image: '/api/placeholder/400/300', price: '$349', rating: 4.6 },
    { id: 8, name: 'New York, USA', continent: 'North America', image: '/api/placeholder/400/300', price: '$499', rating: 4.7 },
    { id: 9, name: 'Rio de Janeiro, Brazil', continent: 'South America', image: '/api/placeholder/400/300', price: '$299', rating: 4.5 },
    { id: 10, name: 'Cape Town, South Africa', continent: 'Africa', image: '/api/placeholder/400/300', price: '$399', rating: 4.8 },
    { id: 11, name: 'Sydney, Australia', continent: 'Oceania', image: '/api/placeholder/400/300', price: '$699', rating: 4.9 },
    { id: 12, name: 'Morocco', continent: 'Africa', image: '/api/placeholder/400/300', price: '$249', rating: 4.6 },
  ];

  const bestStays = [
    { id: 1, name: 'Villa Santorini Luxury', location: 'Santorini, Greece', rating: 4.9, price: '$299', image: '/api/placeholder/300/200', amenities: ['Wifi', 'Pool', 'Sea View'] },
    { id: 2, name: 'Tokyo Modern Hotel', location: 'Tokyo, Japan', rating: 4.8, price: '$189', image: '/api/placeholder/300/200', amenities: ['Wifi', 'Spa', 'Restaurant'] },
    { id: 3, name: 'Bali Beach Resort', location: 'Bali, Indonesia', rating: 4.7, price: '$159', image: '/api/placeholder/300/200', amenities: ['Pool', 'Beach', 'Spa'] },
    { id: 4, name: 'Paris Boutique Hotel', location: 'Paris, France', rating: 4.9, price: '$249', image: '/api/placeholder/300/200', amenities: ['Wifi', 'Restaurant', 'City Center'] },
    { id: 5, name: 'Maldives Water Villa', location: 'Maldives', rating: 5.0, price: '$899', image: '/api/placeholder/300/200', amenities: ['Pool', 'Spa', 'Private Beach'] },
    { id: 6, name: 'Iceland Cozy Lodge', location: 'Reykjavik, Iceland', rating: 4.8, price: '$199', image: '/api/placeholder/300/200', amenities: ['Hot Tub', 'Northern Lights', 'Breakfast'] },
  ];

  const testimonials = [
    { 
      id: 1, 
      name: 'Sarah Johnson', 
      destination: 'Bali, Indonesia', 
      rating: 5, 
      text: 'MystiGo surprised me with the most incredible hidden villa in Ubud. The mystery element made it so much more exciting!',
      image: '/api/placeholder/80/80'
    },
    { 
      id: 2, 
      name: 'Mike Chen', 
      destination: 'Santorini, Greece', 
      rating: 5, 
      text: 'Best travel decision ever! They found a perfect sunset spot that I never would have discovered myself.',
      image: '/api/placeholder/80/80'
    },
    { 
      id: 3, 
      name: 'Emma Davis', 
      destination: 'Kyoto, Japan', 
      rating: 5, 
      text: 'The surprise factor was amazing. Every detail was perfectly planned, from accommodation to hidden local gems.',
      image: '/api/placeholder/80/80'
    },
  ];

  const continents = ['All', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'];

  const filteredDestinations = selectedContinent === 'All' 
    ? destinations 
    : destinations.filter(dest => dest.continent === selectedContinent);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-serif font-bold text-wandernest-navy dark:text-white">MystiGo</h1>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="nav-link">Home</a>
              <a href="#destinations" className="nav-link">Destinations</a>
              <a href="#stays" className="nav-link">Best Stays</a>
              <a href="#about" className="nav-link">About</a>
              <a href="#contact" className="nav-link">Contact</a>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="ml-4"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button className="wandernest-button">Book Now</Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="mr-2"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="mobile-nav-link">Home</a>
              <a href="#destinations" className="mobile-nav-link">Destinations</a>
              <a href="#stays" className="mobile-nav-link">Best Stays</a>
              <a href="#about" className="mobile-nav-link">About</a>
              <a href="#contact" className="mobile-nav-link">Contact</a>
              <Button className="wandernest-button w-full mt-4">Book Now</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              MystiGo
            </h1>
            <h2 className="text-3xl md:text-4xl font-serif mb-8">
              Discover the World, One Surprise at a Time
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90">
              Choose your budget, and we'll craft your mystery adventure
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="wandernest-button text-lg px-8 py-6"
                onClick={() => navigate('/preferences')}
              >
                <Sparkles className="mr-3 h-6 w-6" />
                Book a Mystery Trip
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-gray-900"
              >
                <Globe className="mr-3 h-6 w-6" />
                Explore Destinations
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white" />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-wandernest-navy dark:text-white mb-6">
              How MystiGo Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the thrill of surprise travel with our simple 4-step process
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <MapPin className="h-12 w-12" />, title: 'Choose Your Budget', description: 'Set your travel budget and let us know your preferences' },
              { icon: <Sparkles className="h-12 w-12" />, title: 'Select Your Style', description: 'Adventure, luxury, culture, or relaxation - pick your vibe' },
              { icon: <Plane className="h-12 w-12" />, title: 'Get Your Surprise', description: 'We reveal your mystery destination at the perfect moment' },
              { icon: <Camera className="h-12 w-12" />, title: 'Pack & Go!', description: 'Everything is planned - just pack your bags and enjoy' },
            ].map((step, index) => (
              <Card key={index} className="wandernest-card text-center p-8 hover:shadow-xl transition-all duration-300">
                <div className="text-wandernest-teal mb-6 flex justify-center">
                  {step.icon}
                </div>
                <div className="mb-4">
                  <Badge className="mb-4">Step {index + 1}</Badge>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Explorer */}
      <section id="destinations" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-wandernest-navy dark:text-white mb-6">
              Discover Amazing Destinations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              From hidden gems to world-famous landmarks, explore our curated collection of destinations
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  placeholder="Search destinations..." 
                  className="pl-10 py-3 text-lg"
                />
              </div>
            </div>

            {/* Continent Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {continents.map((continent) => (
                <Button
                  key={continent}
                  variant={selectedContinent === continent ? "default" : "outline"}
                  onClick={() => setSelectedContinent(continent)}
                  className="px-6 py-2"
                >
                  {continent}
                </Button>
              ))}
            </div>
          </div>

          {/* Destinations Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="wandernest-card overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="font-semibold">{destination.name}</p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{destination.rating}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{destination.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-wandernest-teal">{destination.price}</span>
                    <Button size="sm" className="wandernest-button">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Best Stays */}
      <section id="stays" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-wandernest-navy dark:text-white mb-6">
              Best Stays & Hotels
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Handpicked accommodations that will make your stay unforgettable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestStays.map((stay) => (
              <Card key={stay.id} className="wandernest-card overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src={stay.image} 
                    alt={stay.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{stay.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm">{stay.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{stay.location}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {stay.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-wandernest-teal">{stay.price}</span>
                      <span className="text-gray-600 dark:text-gray-300">/night</span>
                    </div>
                    <Button size="sm" className="wandernest-button">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-wandernest-navy dark:text-white mb-6">
              Special Offers & Seasonal Packages
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Limited-time deals and seasonal adventures you won't want to miss
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: 'Summer in Greece', 
                description: 'Island hopping adventure with 30% off', 
                price: '$599', 
                originalPrice: '$899',
                timeLeft: '5 days left',
                image: '/api/placeholder/400/300'
              },
              { 
                title: 'Winter in Japan', 
                description: 'Cherry blossom season special package', 
                price: '$799', 
                originalPrice: '$1099',
                timeLeft: '2 weeks left',
                image: '/api/placeholder/400/300'
              },
              { 
                title: 'Tropical Paradise', 
                description: 'Maldives luxury resort experience', 
                price: '$1299', 
                originalPrice: '$1699',
                timeLeft: '1 week left',
                image: '/api/placeholder/400/300'
              },
            ].map((offer, index) => (
              <Card key={index} className="wandernest-card overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src={offer.image} 
                    alt={offer.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white">
                      <Timer className="h-3 w-3 mr-1" />
                      {offer.timeLeft}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-xl mb-2">{offer.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{offer.description}</p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-wandernest-teal">{offer.price}</span>
                    <span className="text-lg text-gray-500 line-through">{offer.originalPrice}</span>
                  </div>
                  
                  <Button className="wandernest-button w-full">
                    Book This Deal
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-wandernest-navy dark:text-white mb-6">
              Traveler Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real experiences from our adventurous travelers
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="wandernest-card p-8 text-center">
              <div className="mb-6">
                <img 
                  src={testimonials[currentTestimonial].image} 
                  alt={testimonials[currentTestimonial].name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-xl md:text-2xl italic text-gray-700 dark:text-gray-300 mb-6">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              
              <div>
                <p className="font-semibold text-lg">{testimonials[currentTestimonial].name}</p>
                <p className="text-gray-600 dark:text-gray-400">Traveled to {testimonials[currentTestimonial].destination}</p>
              </div>
            </Card>

            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-wandernest-teal' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-wandernest-navy dark:text-white mb-6">
              Book Your Mystery Adventure
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Fill out the form below and let us create your perfect surprise trip
            </p>
          </div>

          <Card className="wandernest-card p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Destination Preference</label>
                  <Input placeholder="Any continent or specific country" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range</label>
                  <Input placeholder="$500 - $2000" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Departure Date</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Travelers</label>
                  <Input placeholder="2 adults" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Travel Style</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Adventure', 'Luxury', 'Cultural', 'Relaxation'].map((style) => (
                    <Button key={style} variant="outline" type="button" className="h-12">
                      {style}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Special Requests</label>
                <textarea 
                  className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                  rows={4}
                  placeholder="Any special requirements or preferences..."
                />
              </div>
              
              <Button size="lg" className="wandernest-button w-full text-xl py-6">
                <Sparkles className="mr-3 h-6 w-6" />
                Book My Mystery Trip 🎁
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-wandernest-navy dark:text-white mb-6">
                About MystiGo
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                We believe that the best adventures come from the unexpected. MystiGo was founded on the idea that travel should be magical, surprising, and perfectly tailored to your dreams.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Our team of travel experts curates unique experiences around the world, ensuring that every mystery trip we create is unforgettable. From hidden gems to luxury escapes, we make travel dreams come true.
              </p>
              <Button size="lg" className="wandernest-button">
                Learn More About Us
              </Button>
            </div>
            <div className="relative">
              <img 
                src="/api/placeholder/600/400" 
                alt="About MystiGo"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-wandernest-navy dark:bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-serif font-bold mb-4">MystiGo</h3>
              <p className="text-gray-300 mb-4">
                Discover the world, one surprise at a time.
              </p>
              <div className="flex space-x-4">
                {/* Social Icons */}
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <Globe className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <Camera className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                <li><a href="#destinations" className="text-gray-300 hover:text-white transition-colors">Destinations</a></li>
                <li><a href="#stays" className="text-gray-300 hover:text-white transition-colors">Best Stays</a></li>
                <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-300 mb-4">Get surprise travel deals delivered to your inbox</p>
              <div className="flex">
                <Input 
                  placeholder="Your email" 
                  className="rounded-r-none bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button className="rounded-l-none bg-wandernest-teal hover:bg-wandernest-teal/80">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-300">
              © 2024 MystiGo. All rights reserved. Travel made magical through surprise adventures.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="lg" className="rounded-full w-16 h-16 bg-wandernest-teal hover:bg-wandernest-teal/80 shadow-lg">
          <Users className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Index;