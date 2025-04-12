
import { useState, useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { useCarouselContext } from "embla-carousel-react";
import { cn } from "@/lib/utils";

interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
  sequence_order: number;
}

interface ProjectGalleryProps {
  projectImages: ProjectImage[];
  projectTitle: string;
}

// Sayfa göstergeleri için özel bileşen
const CarouselDots = ({ selectedIndex, slideCount }: { selectedIndex: number; slideCount: number }) => {
  return (
    <div className="flex justify-center gap-1.5 mt-4">
      {Array.from({ length: slideCount }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            selectedIndex === index 
              ? "w-4 bg-primary/70" 
              : "w-1.5 bg-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
};

// Carouselden geçerli slayt bilgisini alan bir bileşen
const CarouselProgress = ({ className }: { className?: string }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  
  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setSlideCount(emblaApi.scrollSnapList().length);
  }, []);
  
  return (
    <CarouselContext onSelect={onSelect}>
      <CarouselDots selectedIndex={selectedIndex} slideCount={slideCount} />
    </CarouselContext>
  );
};

// Carousel API'sine erişmek için yardımcı bileşen
const CarouselContext = ({ 
  children, 
  onSelect 
}: { 
  children: React.ReactNode; 
  onSelect: (emblaApi: any) => void;
}) => {
  const carouselContext = useCarouselContext();
  const [emblaApi, setEmblaApi] = useState(carouselContext?.emblaApi);

  const onSelectCallback = useCallback(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
  }, [emblaApi, onSelect]);

  // API değiştiğinde
  useState(() => {
    if (carouselContext?.emblaApi) {
      setEmblaApi(carouselContext.emblaApi);
    }
  });

  // API hazır olduğunda
  useState(() => {
    if (emblaApi) {
      onSelect(emblaApi);
      emblaApi.on('select', onSelectCallback);
      return () => {
        emblaApi.off('select', onSelectCallback);
      };
    }
  });

  return <>{children}</>;
};

export default function ProjectGallery({ projectImages, projectTitle }: ProjectGalleryProps) {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(projectImages.length);
  
  const onCreated = useCallback((api: any) => {
    setApi(api);
  }, []);
  
  const handleSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);
    setTotal(api.scrollSnapList().length);
  }, [api]);
  
  return (
    <section className="min-h-screen bg-background flex items-center">
      <div className="section-container py-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center reveal">Proje Galerisi</h2>
        
        <div className="relative w-full max-w-5xl mx-auto reveal">
          <Carousel className="w-full" onCreated={onCreated} onSelect={handleSelect}>
            <CarouselContent>
              {projectImages.map(image => (
                <CarouselItem key={image.id}>
                  <div className="p-1">
                    <div className="aspect-video overflow-hidden rounded-lg">
                      <img 
                        src={image.image_url} 
                        alt={image.alt_text || `${projectTitle} görsel`} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
          
          {/* Sayfa göstergeleri */}
          <div className="flex justify-center gap-1.5 mt-4">
            {projectImages.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  current === index + 1 
                    ? "w-4 bg-primary/70" 
                    : "w-1.5 bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
          
          {/* Alternatif olarak, şeffaf ve minimal sayfa numarası */}
          <div className="absolute bottom-[-30px] right-0 text-xs text-muted-foreground/60 font-light">
            {current} / {total}
          </div>
        </div>
      </div>
    </section>
  );
}
