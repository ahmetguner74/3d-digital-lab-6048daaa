import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
export default function ProjectsSection() {
  return <section id="projects" className="min-h-screen bg-muted/50 dark:bg-muted/20">
      <div className="section-container min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left content */}
          <div className="space-y-6 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight my-[25px] py-[20px]">
              Mimari objeler
            </h2>
            <p className="text-lg text-muted-foreground py-[34px] my-[48px]">
              Mimari ve arkeolojik araştırmaların yürütülmesinde mimari eserlerin taranması 
              zorunlu bir aşamadır. Bu alanda sürekli çalışarak, hızlı ve kaliteli sonuçlara 
              ulaşmanızı sağlayacak en iyi çözümleri geliştirdik.
            </p>
            
            <div className="pt-4">
              <Button asChild size="lg" className="group">
                <Link to="/demo">
                  Demoyu görüntüle
                  <Play className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Right content - Video area */}
          <div className="relative w-full reveal">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
              {/* Video placeholder - Will be replaced with actual video later */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                <h3 className="text-xl font-medium text-center max-w-md mb-8 px-4">
                  Lazer tarama, binaların inşasında ve restorasyonunda, fotogrametri ise müze sergilerinin 
                  dijitalleştirilmesinde kullanılır; teknolojileri birleştirerek uygulama kapsamını genişletiyoruz.
                </h3>
                <Play className="h-16 w-16 text-primary opacity-60" />
                <p className="mt-4 text-sm text-muted-foreground">Video buraya eklenecek</p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/20 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-secondary/20 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>;
}