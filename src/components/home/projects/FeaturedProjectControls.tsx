
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FeaturedProjectControlsProps {
  goToPrevious: () => void;
  goToNext: () => void;
}

export default function FeaturedProjectControls({ 
  goToPrevious, 
  goToNext 
}: FeaturedProjectControlsProps) {
  return (
    <>
      {/* Sol geçiş butonu */}
      <button 
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-full md:h-4/5 w-16 md:w-24 flex items-center justify-start pl-2 md:pl-4 bg-gradient-to-r from-black/10 to-transparent hover:from-black/20 transition-all duration-300"
        aria-label="Önceki proje"
      >
        <ChevronLeft className="h-8 w-8 md:h-10 md:w-10 text-white drop-shadow-md" />
      </button>
      
      {/* Sağ geçiş butonu */}
      <button 
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full md:h-4/5 w-16 md:w-24 flex items-center justify-end pr-2 md:pr-4 bg-gradient-to-l from-black/10 to-transparent hover:from-black/20 transition-all duration-300"
        aria-label="Sonraki proje"
      >
        <ChevronRight className="h-8 w-8 md:h-10 md:w-10 text-white drop-shadow-md" />
      </button>
    </>
  );
}
