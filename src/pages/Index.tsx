import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Plane, MapPin, Calendar, Star, Sparkles, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const steps = [
    {
      icon: '✨',
      title: 'Tell Us Your Vibe',
      description: 'Share your travel preferences, budget, and dream experiences',
      color: 'primary'
    },
    {
      icon: '🎯',
      title: 'We Craft Magic',
      description: 'Our AI creates personalized mystery packages just for you',
      color: 'secondary'
    },
    {
      icon: '🎁',
      title: 'Reveal & Book',
      description: 'Unveil your surprise destinations and book your adventure',
      color: 'accent'
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating absolute top-20 left-10 text-6xl opacity-60">🎈</div>
        <div className="floating-delayed absolute top-40 right-20 text-5xl opacity-50">✈️</div>
        <div className="floating absolute bottom-40 left-20 text-4xl opacity-40">☁️</div>
        <div className="floating-delayed absolute top-60 left-1/2 text-3xl opacity-30">⭐</div>
        <div className="floating absolute bottom-20 right-40 text-5xl opacity-50">🌍</div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-7xl md:text-8xl font-bold gradient-text mb-4 animate-fade-in-up">
                ✈️ Surprise Travel
              </h1>
              <h2 className="text-5xl md:text-6xl font-bold gradient-text animate-fade-in-up">
                Planner
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-2xl md:text-3xl text-muted-foreground mb-8 animate-fade-in-up">
              Tell us your budget & vibe, we'll craft your <span className="gradient-text font-semibold">mystery trip!</span>
            </p>

            {/* CTA Button */}
            <Button 
              size="lg"
              className="glass-button ripple-button text-xl px-12 py-6 mb-16 animate-bounce-in shadow-floating"
              onClick={() => navigate('/preferences')}
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Plan My Surprise Trip
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>

            {/* Trust Indicators */}
            <div className="flex justify-center space-x-8 text-muted-foreground animate-fade-in-up">
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-accent-yellow" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <span>100+ Destinations</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-secondary" />
                <span>10k+ Happy Travelers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold gradient-text mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to your perfect adventure</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card 
                key={index}
                className="glass-card p-8 text-center bounce-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-6xl mb-6">{step.icon}</div>
                <div className="mb-4">
                  <Badge className="text-lg px-4 py-2 mb-4">
                    Step {index + 1}
                  </Badge>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
              </Card>
            ))}
          </div>

          {/* Features */}
          <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎯', label: 'Personalized' },
              { icon: '🔒', label: 'Secure Booking' },
              { icon: '📱', label: 'Mobile Ready' },
              { icon: '🌟', label: 'Premium Experience' }
            ].map((feature, index) => (
              <Card key={index} className="glass-card p-6 text-center bounce-hover">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <div className="font-semibold">{feature.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass-card p-12">
            <h2 className="text-4xl font-bold gradient-text mb-6">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of travelers who've discovered their perfect getaway through our surprise packages.
            </p>
            <Button 
              size="lg"
              className="glass-button ripple-button text-xl px-12 py-6 shadow-floating"
              onClick={() => navigate('/preferences')}
            >
              <Plane className="mr-3 h-6 w-6" />
              Start Planning Now
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
