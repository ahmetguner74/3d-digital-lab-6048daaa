
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export default function BeforeAfterSlider({ beforeImage, afterImage }: BeforeAfterSliderProps) {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <div className="space-y-8">
      <div className="relative aspect-video w-full max-w-5xl mx-auto border border-border rounded-lg overflow-hidden reveal">
        <div className="relative w-full h-full">
          <img src={afterImage} alt="After" className="absolute w-full h-full object-cover" />
          
          <div className="absolute top-0 left-0 h-full overflow-hidden" style={{
            width: `${sliderValue}%`
          }}>
            <img src={beforeImage} alt="Before" className="w-[100vw] h-full object-cover" />
            
            <div className="absolute top-0 bottom-0 right-0 w-1 bg-primary cursor-ew-resize">
              <div className="absolute top-1/2 right-0 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-4 border-primary bg-white flex items-center justify-center">
                <div className="flex gap-0.5">
                  <ArrowLeft className="h-3 w-3 text-primary" />
                  <ArrowRight className="h-3 w-3 text-primary" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 text-white text-sm rounded">
            Öncesi
          </div>
          <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 text-white text-sm rounded">
            Sonrası
          </div>
        </div>
        
        <div className="mt-4 px-4">
          <Slider value={[sliderValue]} onValueChange={value => setSliderValue(value[0])} max={100} step={1} className="w-full" />
        </div>
      </div>
      
      <p className="text-lg text-center mt-8 max-w-3xl mx-auto text-muted-foreground reveal">
        Kaydırıcıyı hareket ettirerek öncesi ve sonrası arasındaki farkı görebilirsiniz.
      </p>
    </div>
  );
}
