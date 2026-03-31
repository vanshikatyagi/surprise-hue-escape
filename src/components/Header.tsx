import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, LogOut, User, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "FEATURES", target: "features" },
  { label: "DESTINATIONS", target: "destinations" },
  { label: "LOCAL SECRETS", href: "/local-secrets" },
  { label: "ABOUT", target: "about" },
  { label: "CONTACT", target: "contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (link: typeof navLinks[0]) => {
    setMobileOpen(false);
    if ('href' in link && link.href) {
      navigate(link.href);
    } else if ('target' in link && link.target) {
      scrollToSection(link.target);
    }
  };

  const handleAuthAction = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#2d2d2d]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <a href="/" className="text-xl font-extrabold tracking-widest text-white uppercase">
            MYSTIGO
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className="text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => document.documentElement.classList.toggle("dark")}
              className="w-10 h-10 rounded-full bg-[#3d3d3d] flex items-center justify-center text-white hover:bg-[#4d4d4d] transition-colors"
              title="Toggle dark mode"
            >
              <Moon className="w-4 h-4" />
            </button>
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Button onClick={() => navigate("/dashboard")} className="bg-accent text-black font-bold hover:bg-accent/90 rounded-md px-4 py-2 text-sm">
                  <User className="w-4 h-4 mr-1" /> Dashboard
                </Button>
                <Button onClick={handleSignOut} variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-md px-4 py-2 text-sm">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={handleAuthAction} className="hidden md:flex bg-accent text-black font-bold hover:bg-accent/90 rounded-md px-6 py-2 text-sm tracking-wide">
                START JOURNEY
              </Button>
            )}
            <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className="block text-white/80 hover:text-white text-sm font-medium w-full text-left"
              >
                {link.label}
              </button>
            ))}
            {user ? (
              <>
                <Button onClick={() => navigate("/dashboard")} className="w-full bg-accent text-black font-bold hover:bg-accent/90 rounded-md text-sm">
                  Dashboard
                </Button>
                <Button onClick={handleSignOut} variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 text-sm">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={handleAuthAction} className="w-full bg-accent text-black font-bold hover:bg-accent/90 rounded-md text-sm">
                START JOURNEY
              </Button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
