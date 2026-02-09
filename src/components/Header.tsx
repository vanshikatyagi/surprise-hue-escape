import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun } from "lucide-react";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#2d2d2d]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-extrabold tracking-widest text-white uppercase">
            MYSTIGO
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors">FEATURES</a>
            <a href="#destinations" className="text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors">DESTINATIONS</a>
            <a href="#about" className="text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors">ABOUT</a>
            <a href="#contact" className="text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors">CONTACT</a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-[#3d3d3d] flex items-center justify-center text-white hover:bg-[#4d4d4d] transition-colors">
              <Moon className="w-4 h-4" />
            </button>
            <Button className="hidden md:flex bg-accent text-black font-bold hover:bg-accent/90 rounded-md px-6 py-2 text-sm tracking-wide">
              START JOURNEY
            </Button>
            <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3">
            <a href="#features" className="block text-white/80 hover:text-white text-sm font-medium">FEATURES</a>
            <a href="#destinations" className="block text-white/80 hover:text-white text-sm font-medium">DESTINATIONS</a>
            <a href="#about" className="block text-white/80 hover:text-white text-sm font-medium">ABOUT</a>
            <a href="#contact" className="block text-white/80 hover:text-white text-sm font-medium">CONTACT</a>
            <Button className="w-full bg-accent text-black font-bold hover:bg-accent/90 rounded-md text-sm">
              START JOURNEY
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
