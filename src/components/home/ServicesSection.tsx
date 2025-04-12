
import { Link } from "react-router-dom";
import { Building2, Scan, Camera, Box, History, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgClass: string;
}

const services: Service[] = [
  {
    id: "3d-laser-scanning",
    title: "3D Lazer Tarama",
    description: "Milimetrik hassasiyetle binaların ve mimari yapıların 3D taraması yapıyoruz.",
    icon: <Scan className="h-10 w-10" />,
    bgClass: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
  },
  {
    id: "photogrammetry",
    title: "Fotogrametri",
    description: "Fotoğraflardan 3D modeller oluşturarak yapıların detaylı dokularını yakalıyoruz.",
    icon: <Camera className="h-10 w-10" />,
    bgClass: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
  },
  {
    id: "bim",
    title: "BIM Modelleme",
    description: "Yapı Bilgi Modelleme ile projelerin detaylı ve parametrik modellerini oluşturuyoruz.",
    icon: <Building2 className="h-10 w-10" />,
    bgClass: "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400"
  },
  {
    id: "historical",
    title: "Tarihi Yapı Belgeleme",
    description: "Kültürel mirasın gelecek nesillere aktarılması için detaylı belgeleme hizmeti.",
    icon: <History className="h-10 w-10" />,
    bgClass: "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400"
  },
  {
    id: "3d-modeling",
    title: "3D Modelleme",
    description: "Mimari projelerin yüksek kaliteli 3D görselleştirmesi ve modellemesi.",
    icon: <Box className="h-10 w-10" />,
    bgClass: "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
  },
  {
    id: "digital-archive",
    title: "Dijital Arşiv",
    description: "Mimari yapıların ve kültürel mirasın uzun ömürlü dijital arşivlerini oluşturuyoruz.",
    icon: <Archive className="h-10 w-10" />,
    bgClass: "bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400"
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white dark:bg-background">
      <div className="section-container">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Hizmetlerimiz</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            En son teknolojilerle mimari yapıları dijitalleştiriyor ve 
            kültürel mirası korumak için çalışıyoruz.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className={cn(
                "p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-300 reveal",
                `reveal-delay-${index * 100}`
              )}
            >
              <div className={cn("p-3 rounded-md w-fit mb-4", service.bgClass)}>
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center reveal">
          <Button asChild size="lg" variant="default">
            <Link to="/services">Tüm Hizmetlerimiz</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
