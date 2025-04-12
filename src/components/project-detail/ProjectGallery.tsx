
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
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

export default function ProjectGallery({ projectImages, projectTitle }: ProjectGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(projectImages.length);
  
  // emblaApi hazır olduğunda ve her slayt değiştiğinde
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap() + 1);
    setTotal(emblaApi.scrollSnapList().length);
  }, [emblaApi]);

  // emblaApi hazır olduğunda
  useEffect(() => {
    if (emblaApi) {
      onSelect();
      emblaApi.on('select', onSelect);
      return () => {
        emblaApi.off('select', onSelect);
      };
    }
  }, [emblaApi, onSelect]);
  
  return (
    <section className="min-h-screen bg-background flex items-center">
      <div className="section-container py-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center reveal">Proje Galerisi</h2>
        
        <div className="relative w-full max-w-5xl mx-auto reveal">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {projectImages.map(image => (
                <div 
                  key={image.id} 
                  className="min-w-0 flex-[0_0_100%] pl-4"
                >
                  <div className="p-1">
                    <div className="aspect-video overflow-hidden rounded-lg">
                      <img 
                        src={image.image_url} 
                        alt={image.alt_text || `${projectTitle} görsel`} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Gezinme düğmeleri */}
          <button 
            className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 border border-border flex items-center justify-center"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!emblaApi?.canScrollPrev()}
          >
            <span className="sr-only">Önceki görsel</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </button>
          
          <button 
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 border border-border flex items-center justify-center"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!emblaApi?.canScrollNext()}
          >
            <span className="sr-only">Sonraki görsel</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
          
          {/* Sayfa göstergeleri */}
          <CarouselDots selectedIndex={current - 1} slideCount={total} />
          
          {/* Minimal sayfa numarası göstergesi */}
          <div className="absolute bottom-[-30px] right-0 text-xs text-muted-foreground/60 font-light">
            {current} / {total}
          </div>
        </div>
      </div>
    </section>
  );
}
