
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-muted/20">
      <div className="section-container min-h-[90vh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 reveal">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
              Yenilikçi 3D Teknolojileri
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              <span className="text-gradient">3D Mimari</span> Dijitalleştirme <br />
              <span className="relative">
                Atölyesi
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10C59.9737 4.8 203.647 -1.1 356 5.9" stroke="url(#paint0_linear)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="2" y1="10" x2="356" y2="5.9" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#2563EB"/>
                      <stop offset="1" stopColor="#7C3AED"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              En yenilikçi gelişmiş teknolojileri kullanarak mimari ve arkeolojik 
              yapıları milimetrik hassasiyetle dijitalleştiriyoruz.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="group bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">
                <Link to="/contact">
                  İletişime Geç
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg">
                <Link to="/projects">
                  Projelerimiz
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative w-full max-w-xl mx-auto lg:max-w-none reveal">
            {/* Modern dikdörtgen görsel alanı */}
            <div className="aspect-video rounded-lg overflow-hidden transform rotate-2 hover:rotate-0 transition-all duration-300">
              {/* Modern görsel konteyner */}
              <div className="relative w-full h-full">
                {/* Ana görsel */}
                <div className="absolute inset-0 z-10">
                  <img 
                    alt="Mimari Görsel" 
                    src="/lovable-uploads/2c24c907-a746-42ed-84b3-91972d11f7b7.jpg" 
                    className="h-full w-full object-cover" 
                  />
                </div>
                
                {/* Dekoratif arka plan eleman */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-secondary/30 blur-xl z-0"></div>
              </div>
            </div>
            
            {/* Dekoratif elementler */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/30 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/30 blur-3xl"></div>
            
            {/* Bilgilendirme rozetleri */}
            <div className="absolute -right-8 top-1/4 bg-white dark:bg-background p-3 rounded-lg shadow-lg border border-border transform rotate-3 hover:rotate-0 transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Milimetrik Hassasiyet</span>
              </div>
            </div>
            
            <div className="absolute -left-8 bottom-1/4 bg-white dark:bg-background p-3 rounded-lg shadow-lg border border-border transform -rotate-3 hover:rotate-0 transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Hızlı Teslimat</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
          <span className="text-sm text-muted-foreground mb-2">Aşağı Kaydır</span>
          <div className="h-10 w-6 rounded-full border-2 border-muted-foreground/30 flex justify-center">
            <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
