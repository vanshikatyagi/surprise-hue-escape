import { Plane } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Full Background Mountain Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Mountain landscape"
          className="w-full h-full object-cover"
        />
        {/* Turquoise gradient overlay on top portion */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-transparent" />
      </div>

      {/* Star decorations */}
      <div className="absolute top-28 left-16 z-10 text-white/40 text-5xl">☆</div>
      <div className="absolute top-28 right-16 z-10 text-white/40 text-5xl">☆</div>

      {/* Main Title */}
      <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
        <h1 className="text-[7rem] sm:text-[10rem] md:text-[12rem] lg:text-[16rem] xl:text-[18rem] font-black leading-[0.85] tracking-tight">
          <span className="text-white drop-shadow-2xl block" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>Mystigo</span>
          <span className="text-accent drop-shadow-2xl block -mt-4 md:-mt-8" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>Go</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-light mt-4 tracking-wide">
          Travel agency
        </p>
        <div className="mt-6">
          <Plane className="w-6 h-6 text-white/60 mx-auto rotate-45" />
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-8 left-8 z-20 text-white/60 text-xs font-mono tracking-widest">
        23.08.2029
      </div>
      <div className="absolute bottom-8 right-8 z-20 text-white/60 text-xs font-mono tracking-widest">
        GV + UP
      </div>
    </section>
  );
};

export default HeroSection;
