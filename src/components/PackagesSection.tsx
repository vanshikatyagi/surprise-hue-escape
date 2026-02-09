import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, Check, Plane } from "lucide-react";

const packages = [
  {
    id: "weekend",
    title: "Weekend Getaway",
    description: "Perfect for couples or small groups looking for a quick escape to a surprise destination.",
    price: "$299",
    priceNote: "/person",
    duration: "2-3 Days",
    people: "2-4 People",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    features: ["Hotel included", "Local experiences", "Transport arranged"],
    popular: false,
    badge: "Popular",
  },
  {
    id: "adventure",
    title: "Adventure Seeker",
    description: "For thrill seekers ready to explore unknown territories and embrace exciting challenges.",
    price: "$599",
    priceNote: "/person",
    duration: "5-7 Days",
    people: "1-6 People",
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500",
    features: ["Adventure activities", "Professional guides", "All gear included"],
    popular: true,
    badge: "🏔️Adventure Seeker",
  },
  {
    id: "luxury",
    title: "Luxury Surprise",
    description: "Indulge in premium experiences with luxury accommodations and exclusive activities.",
    price: "$1299",
    priceNote: "/person",
    duration: "7-10 Days",
    people: "2-8 People",
    rating: 5.0,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500",
    features: ["5-star hotels", "Private transfers", "Concierge service"],
    popular: false,
    badge: "Popular",
  },
];

const PackagesSection = () => {
  return (
    <section id="packages" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">Mystery Trip Packages</h2>
          <p className="text-gray-500 text-sm">
            Choose your adventure level and let us surprise you with the perfect destination
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
              {/* Image */}
              <div className="relative h-44">
                <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                <Badge className="absolute top-3 right-3 bg-red-500 text-white border-0 text-[10px] rounded-sm px-2 py-0.5">
                  {pkg.badge}
                </Badge>
              </div>

              <CardContent className="p-5">
                {/* Title + Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-black text-sm">{pkg.title}</h3>
                  <div className="flex items-center gap-1 ml-auto">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium text-black">{pkg.rating}</span>
                    <span className="text-xs text-gray-400">({pkg.reviews})</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-3 leading-relaxed">{pkg.description}</p>

                {/* Duration & People */}
                <div className="flex gap-3 mb-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                    <Clock className="w-3 h-3" />
                    {pkg.duration}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                    <Users className="w-3 h-3" />
                    {pkg.people}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-1.5 mb-4">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="w-3 h-3 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price + CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-black">{pkg.price}</span>
                    <span className="text-xs text-gray-400">{pkg.priceNote}</span>
                  </div>
                  <Button className="bg-primary text-white hover:bg-primary/90 rounded-lg px-4 py-2 text-xs font-semibold">
                    Book Mystery <Plane className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" className="border-gray-300 text-black hover:bg-gray-50 rounded-full px-8 text-sm">
            View All Packages →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
