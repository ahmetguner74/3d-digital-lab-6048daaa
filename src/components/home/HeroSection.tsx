import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
export default function HeroSection() {
  return <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-muted/20">
      <div className="section-container min-h-[90vh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 reveal">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              <span className="text-gradient">3D Mimari</span> Dijitalleştirme Atölyesi
            </h1>
            <p className="text-xl text-muted-foreground">
              En yenilikçi gelişmiş teknolojileri kullanarak verilerinizi oluşturuyoruz.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="group">
                <Link to="/contact">
                  İletişime Geç
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative w-full max-w-xl mx-auto lg:max-w-none reveal">
            {/* Modern dikdörtgen görsel alanı */}
            <div className="aspect-video rounded-lg overflow-hidden transform rotate-2 hover:rotate-0 transition-all duration-300">
              {/* Modern görsel konteyner */}
              <div className="relative w-full h-full py-[4px]">
                {/* Ana görsel */}
                <div className="absolute inset-0 z-10">
                  <img alt="Mimari Görsel" src="/lovable-uploads/2c24c907-a746-42ed-84b3-91972d11f7b7.jpg" className="h-full w-full object-cover" />
                </div>
                
                {/* Dekoratif arka plan eleman */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-secondary/30 blur-xl z-0"></div>
              </div>
            </div>
            
            {/* Dekoratif elementler */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/30 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/30 blur-3xl"></div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
          <span className="text-sm text-muted-foreground mb-2">Aşağı Kaydır</span>
          <div className="h-10 w-6 rounded-full border-2 border-muted-foreground/30 flex justify-center">
            <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2"></div>
          </div>
        </div>
      </div>
    </section>;
}