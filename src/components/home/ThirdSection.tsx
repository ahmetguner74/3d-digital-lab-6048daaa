
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ThirdSection() {
  return (
    <section className="min-h-screen bg-background">
      <div className="section-container min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left content */}
          <div className="space-y-6 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Arkeolojik Eserler
            </h2>
            <p className="text-lg text-muted-foreground">
              Arkeolojik eserlerin korunması ve belgelenmesi için yüksek hassasiyetli 
              3D tarama teknolojilerimizi kullanıyoruz. Milimetrik doğrulukla oluşturulan 
              modeller, eserlerin dijital arşivlenmesi ve restorasyonunda hayati rol oynuyor.
            </p>
            
            <div className="pt-4">
              <Button asChild size="lg" className="group">
                <Link to="/projects/arkeolojik-eserler">
                  Projeyi Görüntüle
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Right content - Image area */}
          <div className="relative w-full reveal">
            <Link to="/projects/arkeolojik-eserler" className="block">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
                {/* Image placeholder - Will be replaced with actual image */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                  <p className="text-sm text-muted-foreground">Fotoğraf buraya eklenecek</p>
                </div>
                
                {/* Overlay for hover effect */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium px-4 py-2 bg-primary/80 rounded-md">
                    Projeyi Görüntüle
                  </span>
                </div>
              </div>
            </Link>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/20 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-secondary/20 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
