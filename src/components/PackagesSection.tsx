import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, Check, Plane } from "lucide-react";
import GenerateItineraryDialog from "@/components/GenerateItineraryDialog";

// Numeric base prices (USD). We'll convert to user's currency on render.
const packages = [
  {
    id: "weekend",
    title: "Weekend Getaway",
    description: "Perfect for couples or small groups looking for a quick escape to a surprise destination.",
    basePrice: 299,
    priceNote: "/person",
    duration: "2-3 Days",
    people: "2-4 People",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    features: ["Hotel included", "Local experiences", "Transport arranged"],
    badge: "Popular",
    presets: { trip_duration: "Weekend Getaway", budget: "Comfortable", travel_style: "Beach & Relaxation" },
  },
  {
    id: "adventure",
    title: "Adventure Seeker",
    description: "For thrill seekers ready to explore unknown territories and embrace exciting challenges.",
    basePrice: 599,
    priceNote: "/person",
    duration: "5-7 Days",
    people: "1-6 People",
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500",
    features: ["Adventure activities", "Professional guides", "All gear included"],
    badge: "🏔️ Adventure Seeker",
    presets: { trip_duration: "Short Break", budget: "Premium", travel_style: "Adventure & Outdoors" },
  },
  {
    id: "luxury",
    title: "Luxury Surprise",
    description: "Indulge in premium experiences with luxury accommodations and exclusive activities.",
    basePrice: 1299,
    priceNote: "/person",
    duration: "7-10 Days",
    people: "2-8 People",
    rating: 5.0,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500",
    features: ["5-star hotels", "Private transfers", "Concierge service"],
    badge: "Popular",
    presets: { trip_duration: "Full Week", budget: "Luxury", travel_style: "Culture & History" },
  },
];

// Rough conversion table from USD (good enough for display).
const FX: Record<string, number> = {
  USD: 1, INR: 83, EUR: 0.92, GBP: 0.79, AED: 3.67, THB: 36, JPY: 155, AUD: 1.5,
  SGD: 1.34, MYR: 4.7, CAD: 1.36, KRW: 1370, CNY: 7.2, CHF: 0.88, SEK: 10.5,
  NOK: 10.7, DKK: 6.9, NZD: 1.65, ZAR: 18.5, BRL: 5.1, MXN: 17, TRY: 32, RUB: 92,
  PLN: 4, CZK: 23, HUF: 360, PHP: 56, IDR: 15800, VND: 25000, TWD: 32, HKD: 7.8,
  SAR: 3.75, QAR: 3.64, KWD: 0.31, BHD: 0.38, OMR: 0.39, EGP: 49, NGN: 1500,
  KES: 130, GHS: 15, PKR: 280, LKR: 300, BDT: 117, NPR: 133, MMK: 2100, CLP: 950,
  COP: 4000, ARS: 1000, PEN: 3.7, UAH: 41, RON: 4.6, BGN: 1.8, HRK: 6.9, ISK: 138,
  JOD: 0.71, MAD: 10, TND: 3.1, GEL: 2.7, AMD: 390, UZS: 12700, KZT: 480,
};

function parseCurrency(label: string | null): { code: string; symbol: string } {
  if (!label) return { code: "USD", symbol: "$" };
  const m = label.match(/^(\w+)\s*\((.+)\)$/);
  if (m) return { code: m[1], symbol: m[2] };
  return { code: "USD", symbol: "$" };
}

const PackagesSection = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<{ code: string; symbol: string }>({ code: "USD", symbol: "$" });
  const [genOpen, setGenOpen] = useState(false);
  const [genPresets, setGenPresets] = useState<Record<string, string> | undefined>(undefined);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mystigo_currency");
      if (saved) setCurrency(parseCurrency(saved));
    } catch {}
  }, []);

  const formatted = useMemo(
    () =>
      packages.map((p) => {
        const rate = FX[currency.code] ?? 1;
        const amount = Math.round(p.basePrice * rate);
        const display =
          amount >= 1000 ? `${currency.symbol}${amount.toLocaleString()}` : `${currency.symbol}${amount}`;
        return { ...p, displayPrice: display };
      }),
    [currency]
  );

  const openItinerary = (pkg: (typeof packages)[number]) => {
    setGenPresets({
      ...pkg.presets,
      currency: `${currency.code} (${currency.symbol})`,
      package_title: pkg.title,
    });
    setGenOpen(true);
  };

  const viewAll = () => navigate("/dashboard");

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
          {formatted.map((pkg) => (
            <Card
              key={pkg.id}
              onClick={() => openItinerary(pkg)}
              className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="relative h-44">
                <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                <Badge className="absolute top-3 right-3 bg-red-500 text-white border-0 text-[10px] rounded-sm px-2 py-0.5">
                  {pkg.badge}
                </Badge>
              </div>

              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-black text-sm">{pkg.title}</h3>
                  <div className="flex items-center gap-1 ml-auto">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium text-black">{pkg.rating}</span>
                    <span className="text-xs text-gray-400">({pkg.reviews})</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-3 leading-relaxed">{pkg.description}</p>

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

                <ul className="space-y-1.5 mb-4">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="w-3 h-3 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-black">{pkg.displayPrice}</span>
                    <span className="text-xs text-gray-400">{pkg.priceNote}</span>
                  </div>
                  <Button
                    onClick={(e) => { e.stopPropagation(); openItinerary(pkg); }}
                    className="bg-primary text-white hover:bg-primary/90 rounded-lg px-4 py-2 text-xs font-semibold"
                  >
                    Book Mystery <Plane className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={viewAll}
            variant="outline"
            className="border-gray-300 text-black hover:bg-gray-50 rounded-full px-8 text-sm"
          >
            View All Packages →
          </Button>
        </div>
      </div>

      <GenerateItineraryDialog open={genOpen} onOpenChange={setGenOpen} presetAnswers={genPresets} />
    </section>
  );
};

export default PackagesSection;
