import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PreferencesForm from "./pages/PreferencesForm";
import PackageReveal from "./pages/PackageReveal";
import Dashboard from "./pages/Dashboard";
import FlightBooking from "./pages/FlightBooking";
import HotelBooking from "./pages/HotelBooking";
import ItineraryView from "./pages/ItineraryView";
import TripReveal from "./pages/TripReveal";
import SharedItinerary from "./pages/SharedItinerary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/preferences" element={<PreferencesForm />} />
            <Route path="/reveal" element={<ProtectedRoute><TripReveal /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/flights" element={<FlightBooking />} />
            <Route path="/hotels" element={<HotelBooking />} />
            <Route path="/itinerary" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
            <Route path="/shared/:token" element={<SharedItinerary />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
