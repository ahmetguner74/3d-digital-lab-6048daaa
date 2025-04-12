
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TechnologiesSectionProps {
  className?: string;
}

export default function TechnologiesSection({ className = "" }: TechnologiesSectionProps) {
  // Three.js teknolojileriyle ilgili bölüm verileri
  const technologies = [
    {
      name: "Three.js",
      icon: "/tech/threejs.svg",
      description: "3D modelleri web ortamında görüntülemek için kullanılan JavaScript kütüphanesi"
    },
    {
      name: "Potree",
      icon: "/tech/potree.png",
      description: "Büyük nokta bulutu verilerini web tarayıcıda görselleştirmek için kullanılan WebGL tabanlı görüntüleyici"
    },
    {
      name: "React",
      icon: "/tech/react.svg",
      description: "Kullanıcı arayüzü oluşturmak için kullanılan JavaScript kütüphanesi"
    }
  ];
  
  return (
    <div className={`${className} reveal`}>
      <h2 className="text-3xl font-bold mb-10 text-center">3D Görselleştirme Teknolojilerimiz</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {technologies.map((tech, index) => (
          <div key={index} className="bg-white dark:bg-muted/10 p-6 rounded-lg border border-muted shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex flex-col items-center mb-4">
              <img src={tech.icon} alt={tech.name} className="h-16 mb-3" />
              <h3 className="text-xl font-semibold">{tech.name}</h3>
            </div>
            <p className="text-center text-muted-foreground">{tech.description}</p>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <p className="mb-6 text-lg text-muted-foreground">
          Özel 3D görselleştirme çözümleri ve nokta bulutu entegrasyonu için bize ulaşın.
        </p>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
          <a href="mailto:info@3ddigitallab.com" className="flex items-center">
            Projeniz İçin Teklif Alın
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
