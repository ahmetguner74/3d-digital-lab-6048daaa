
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface TechnologiesSectionProps {
  className?: string;
}

export default function TechnologiesSection({
  className = ""
}: TechnologiesSectionProps) {
  // Three.js teknolojileriyle ilgili bölüm verileri
  const technologies = [{
    name: "Three.js",
    icon: "/tech/threejs.svg",
    description: "3D modelleri web ortamında görüntülemek için kullanılan JavaScript kütüphanesi"
  }, {
    name: "Potree",
    icon: "/tech/potree.png",
    description: "Büyük nokta bulutu verilerini web tarayıcıda görselleştirmek için kullanılan WebGL tabanlı görüntüleyici"
  }, {
    name: "React",
    icon: "/tech/react.svg",
    description: "Kullanıcı arayüzü oluşturmak için kullanılan JavaScript kütüphanesi"
  }];

  return (
    <section className={`${className} py-16 bg-muted/30 dark:bg-muted/10 rounded-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Kullandığımız Teknolojiler</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Projelerimizde en güncel ve verimli teknolojileri kullanarak yüksek kaliteli sonuçlar elde ediyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {technologies.map((tech) => (
            <div 
              key={tech.name} 
              className="bg-background rounded-lg p-6 shadow-sm border border-muted transition-all hover:shadow-md flex flex-col items-center text-center"
            >
              <div className="h-24 w-24 flex items-center justify-center mb-4">
                <img src={tech.icon} alt={tech.name} className="max-h-full max-w-full" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{tech.name}</h3>
              <p className="text-muted-foreground mb-4">{tech.description}</p>
              <div className="mt-auto pt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/projects?tech=${tech.name.toLowerCase()}`} className="flex items-center">
                    Bu teknolojiyle projeler
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link to="/contact" className="flex items-center">
              Teknolojik çözümlerimiz hakkında bilgi alın
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
