// Deterministic cross-site price comparison generator.
// We don't have live booking-engine APIs, so we synthesise realistic ±variance
// pricing per site and produce real deep-link URLs the user can actually open.

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function variance(seed: string, min: number, max: number): number {
  const h = hash(seed);
  const range = max - min;
  return min + (h % 1000) / 1000 * range;
}

export interface CompareSite {
  site: string;
  price: number;
  url: string;
  cancellation?: string;
  badge?: "lowest" | "verified" | null;
}

const datePlusDays = (d: number) =>
  new Date(Date.now() + d * 86400000).toISOString().split("T")[0];

// ─── HOTELS ──────────────────────────────────────────────────────────────
export function getHotelComparisons(hotel: { name: string; city: string; price: number }): CompareSite[] {
  const cin = datePlusDays(14);
  const cout = datePlusDays(21);
  const q = encodeURIComponent(`${hotel.name} ${hotel.city}`);
  const cityQ = encodeURIComponent(hotel.city.split(",")[0]);
  const base = hotel.price;

  const sites: Omit<CompareSite, "badge">[] = [
    {
      site: "Booking.com",
      price: Math.round(base * variance(`${hotel.name}-bk`, 0.96, 1.04)),
      url: `https://www.booking.com/searchresults.html?ss=${q}&checkin=${cin}&checkout=${cout}&group_adults=2`,
      cancellation: "Free cancellation",
    },
    {
      site: "Expedia",
      price: Math.round(base * variance(`${hotel.name}-ex`, 0.97, 1.06)),
      url: `https://www.expedia.com/Hotel-Search?destination=${q}&startDate=${cin}&endDate=${cout}&adults=2`,
      cancellation: "Pay later",
    },
    {
      site: "Hotels.com",
      price: Math.round(base * variance(`${hotel.name}-hc`, 0.95, 1.05)),
      url: `https://www.hotels.com/Hotel-Search?destination=${q}&startDate=${cin}&endDate=${cout}&adults=2`,
      cancellation: "10th night free",
    },
    {
      site: "Agoda",
      price: Math.round(base * variance(`${hotel.name}-ag`, 0.92, 1.02)),
      url: `https://www.agoda.com/search?city=${cityQ}&checkIn=${cin}&checkOut=${cout}&adults=2&textToSearch=${q}`,
      cancellation: "Best price guarantee",
    },
    {
      site: "Trivago",
      price: Math.round(base * variance(`${hotel.name}-tv`, 0.94, 1.07)),
      url: `https://www.trivago.com/?query=${q}`,
      cancellation: "Compares 200+ sites",
    },
    {
      site: "Kayak",
      price: Math.round(base * variance(`${hotel.name}-kk`, 0.96, 1.05)),
      url: `https://www.kayak.com/hotels/${cityQ}/${cin}/${cout}/2adults`,
      cancellation: "Member rates",
    },
  ];

  // Mark cheapest as "lowest"
  const minPrice = Math.min(...sites.map((s) => s.price));
  return sites
    .map((s) => ({ ...s, badge: s.price === minPrice ? "lowest" : null } as CompareSite))
    .sort((a, b) => a.price - b.price);
}

// ─── TRANSPORT (mode-aware) ──────────────────────────────────────────────
export function getTransportComparisons(t: {
  mode: string; from: string; to: string; price: number; operator: string; service_name?: string;
}): CompareSite[] {
  const fromQ = encodeURIComponent(t.from);
  const toQ = encodeURIComponent(t.to);
  const date = datePlusDays(14);
  const yymmdd = date.slice(2).replace(/-/g, "");
  const seed = `${t.operator}-${t.service_name || ""}-${t.from}-${t.to}`;
  const base = t.price;

  const fromCode = (t.from || "").slice(0, 3).toUpperCase();
  const toCode = (t.to || "").slice(0, 3).toUpperCase();

  let raw: Omit<CompareSite, "badge">[] = [];

  switch (t.mode) {
    case "flight":
      raw = [
        { site: "Skyscanner", price: Math.round(base * variance(seed + "sky", 0.96, 1.05)),
          url: `https://www.skyscanner.com/transport/flights/${fromCode}/${toCode}/${yymmdd}/`, cancellation: "Compare 1200+ airlines" },
        { site: "Google Flights", price: Math.round(base * variance(seed + "gf", 0.95, 1.04)),
          url: `https://www.google.com/travel/flights?q=Flights%20from%20${fromQ}%20to%20${toQ}%20on%20${date}`, cancellation: "Price tracking" },
        { site: "Kayak", price: Math.round(base * variance(seed + "kk", 0.97, 1.06)),
          url: `https://www.kayak.com/flights/${fromCode}-${toCode}/${date}`, cancellation: "Hacker fares" },
        { site: "Expedia", price: Math.round(base * variance(seed + "ex", 0.98, 1.07)),
          url: `https://www.expedia.com/Flights-Search?leg1=from:${fromQ},to:${toQ},departure:${date}TANYT&trip=oneway&passengers=adults:1`, cancellation: "Bundle & save" },
        { site: "Momondo", price: Math.round(base * variance(seed + "mo", 0.93, 1.03)),
          url: `https://www.momondo.com/flight-search/${fromCode}-${toCode}/${date}`, cancellation: "Mix & match airlines" },
      ];
      break;
    case "train":
      raw = [
        { site: "Trainline", price: Math.round(base * variance(seed + "tl", 0.95, 1.05)),
          url: `https://www.thetrainline.com/book/results?origin=${fromQ}&destination=${toQ}&outwardDate=${date}`, cancellation: "Mobile tickets" },
        { site: "Omio", price: Math.round(base * variance(seed + "om", 0.97, 1.07)),
          url: `https://www.omio.com/search-frontend/results/${fromQ}/${toQ}/${date}?passengers=A`, cancellation: "Compare rail+bus" },
        { site: "12Go", price: Math.round(base * variance(seed + "tg", 0.93, 1.04)),
          url: `https://12go.asia/en/travel/${fromQ}/${toQ}?date=${date}`, cancellation: "SE Asia routes" },
        { site: "Rail Europe", price: Math.round(base * variance(seed + "re", 0.96, 1.06)),
          url: `https://www.raileurope.com/en/search?origin=${fromQ}&destination=${toQ}&outboundDate=${date}`, cancellation: "Eurail passes" },
      ];
      break;
    case "bus":
    case "shared_taxi":
      raw = [
        { site: "12Go", price: Math.round(base * variance(seed + "tg", 0.94, 1.05)),
          url: `https://12go.asia/en/travel/${fromQ}/${toQ}?date=${date}`, cancellation: "Free cancellation" },
        { site: "BusBud", price: Math.round(base * variance(seed + "bb", 0.96, 1.06)),
          url: `https://www.busbud.com/en/bus-schedules/${fromQ}/${toQ}`, cancellation: "Mobile boarding" },
        { site: "RedBus", price: Math.round(base * variance(seed + "rb", 0.92, 1.03)),
          url: `https://www.redbus.in/search?fromCityName=${fromQ}&toCityName=${toQ}&onward=${date}`, cancellation: "India / SEA" },
        { site: "FlixBus", price: Math.round(base * variance(seed + "fx", 0.95, 1.05)),
          url: `https://global.flixbus.com/search?departureCity=${fromQ}&arrivalCity=${toQ}&rideDate=${date}`, cancellation: "Europe / US" },
      ];
      break;
    case "car_rental":
      raw = [
        { site: "Rentalcars", price: Math.round(base * variance(seed + "rc", 0.95, 1.05)),
          url: `https://www.rentalcars.com/SearchResults.do?location=${toQ}`, cancellation: "Free cancellation" },
        { site: "Hertz", price: Math.round(base * variance(seed + "hz", 0.97, 1.08)),
          url: `https://www.hertz.com/rentacar/reservation/?pickupLocation=${toQ}`, cancellation: "Loyalty perks" },
        { site: "Enterprise", price: Math.round(base * variance(seed + "en", 0.96, 1.07)),
          url: `https://www.enterprise.com/en/car-rental/locations.html?q=${toQ}`, cancellation: "Wide network" },
        { site: "Discover Cars", price: Math.round(base * variance(seed + "dc", 0.92, 1.03)),
          url: `https://www.discovercars.com/?country=&pickup_city=${toQ}`, cancellation: "Compares 500+ suppliers" },
        { site: "Sixt", price: Math.round(base * variance(seed + "sx", 0.96, 1.06)),
          url: `https://www.sixt.com/php/reservation/online/reservation?destination=${toQ}`, cancellation: "Premium fleet" },
      ];
      break;
    case "rideshare":
      raw = [
        { site: "Uber", price: Math.round(base * variance(seed + "ub", 0.97, 1.06)),
          url: `https://m.uber.com/?action=setPickup&pickup[formatted_address]=${fromQ}&dropoff[formatted_address]=${toQ}`, cancellation: "Available worldwide" },
        { site: "Bolt", price: Math.round(base * variance(seed + "bo", 0.93, 1.02)),
          url: `https://bolt.eu/en/cities/`, cancellation: "Lower fees" },
        { site: "Ola", price: Math.round(base * variance(seed + "ol", 0.91, 1.01)),
          url: `https://book.olacabs.com/?pickup_name=${fromQ}&drop_name=${toQ}`, cancellation: "India" },
        { site: "Lyft", price: Math.round(base * variance(seed + "lf", 0.96, 1.05)),
          url: `https://ride.lyft.com/ridetype?destination=${toQ}`, cancellation: "US / Canada" },
      ];
      break;
    case "ferry":
    case "cruise":
      raw = [
        { site: "Direct Ferries", price: Math.round(base * variance(seed + "df", 0.95, 1.05)),
          url: `https://www.directferries.com/ferry_route_search.htm?dept=${fromQ}&arr=${toQ}`, cancellation: "All operators" },
        { site: "FerryHopper", price: Math.round(base * variance(seed + "fh", 0.93, 1.04)),
          url: `https://www.ferryhopper.com/en/ferry/${fromQ}/${toQ}`, cancellation: "Greek/Med specialist" },
        { site: "AFerry", price: Math.round(base * variance(seed + "af", 0.96, 1.06)),
          url: `https://www.aferry.com/Ferry-Routes.htm`, cancellation: "Worldwide" },
      ];
      break;
    default:
      raw = [
        { site: "Google Search", price: base, url: `https://www.google.com/search?q=${encodeURIComponent(`${t.mode} from ${t.from} to ${t.to} ${date}`)}`, cancellation: "Find providers" },
        { site: "Rome2Rio", price: Math.round(base * variance(seed + "r2r", 0.92, 1.08)), url: `https://www.rome2rio.com/map/${fromQ}/${toQ}`, cancellation: "Multi-modal planner" },
      ];
  }

  const minPrice = Math.min(...raw.map((s) => s.price));
  return raw
    .map((s) => ({ ...s, badge: s.price === minPrice ? "lowest" : null } as CompareSite))
    .sort((a, b) => a.price - b.price);
}
