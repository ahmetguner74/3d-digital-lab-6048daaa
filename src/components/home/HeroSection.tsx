import { useState, useEffect } from "react";
import { ArrowDown, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
const HERO_TEXTS = ["Mimariye Dijital Dokunuş", "3D Lazer Tarama Teknolojisi", "Kültürel Mirasın Korunması", "Dijital İkizler"];
export default function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Metin değiştirme efekti
  useEffect(() => {
    const textInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTextIndex(prevIndex => (prevIndex + 1) % HERO_TEXTS.length);
        setIsVisible(true);
      }, 500); // Metin değişme gecikmesi
    }, 4000); // Metin değişim süresi

    return () => clearInterval(textInterval);
  }, []);

  // Aşağı kaydırma işlevi
  const scrollToSection = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Arka plan gradient ve desen */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/20 z-0"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>
      
      {/* Ana içerik */}
      <div className="section-container relative z-10 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sol içerik */}
          <div className="lg:col-span-6 space-y-6 reveal">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              Mimari Dijitalleştirme Teknolojileri
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              <span className="block">Mekanların Dijital</span>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dönüşümü</span>
            </h1>
            
            <div className="h-16 flex items-center">
              <p className={cn("text-xl md:text-2xl text-muted-foreground transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
                {HERO_TEXTS[currentTextIndex]}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="group">
                <Link to="/projects" className="flex items-center gap-2">
                  Projelerimizi Keşfet
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Bizimle İletişime Geçin</Link>
              </Button>
            </div>
          </div>
          
          {/* Sağ animasyon/görsel */}
          <div className="lg:col-span-6 relative reveal">
            <div className="aspect-square max-w-lg mx-auto relative">
              {/* 3D model görseli veya animasyon buraya eklenebilir */}
              <img alt="3D Dijitalleştirme" className="w-full h-full object-contain" onError={e => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }} src="/lovable-uploads/f4e7f291-d8c4-4f35-9728-2660bef865f8.jpg" />
              
              {/* Arka plan efektleri */}
              <div className="absolute -z-10 -inset-10 bg-gradient-radial from-primary/20 to-transparent opacity-60 blur-2xl"></div>
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-gradient-to-br from-secondary/20 to-transparent opacity-70 blur-3xl animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Aşağı kaydırma düğmesi */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <button onClick={scrollToSection} aria-label="Aşağı kaydır" className="flex items-center justify-center w-12 h-12 rounded-full border border-border/50 bg-background/60 backdrop-blur-sm shadow-sm hover:bg-background transition-colors animate-bounce hover:animate-none">
            <ArrowDown className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </section>;
}