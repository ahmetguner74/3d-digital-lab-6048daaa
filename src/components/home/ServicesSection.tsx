
import { useState } from "react";
import { 
  ArrowRight, 
  Scan, 
  Building2, 
  Camera,
  FileDigit, 
  PenTool, 
  Layers 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    id: "lazer-tarama",
    title: "Lazer Tarama",
    description: "Yüksek hassasiyetli 3D lazer tarama teknolojisi ile yapıların milimetrik ölçümlerini gerçekleştiriyoruz.",
    icon: Scan,
    color: "from-blue-500 to-cyan-400",
    badge: "Popüler",
  },
  {
    id: "fotogrametri",
    title: "Fotogrametri",
    description: "Fotoğraflar kullanarak yapıların ve nesnelerin üç boyutlu modellerini oluşturuyoruz.",
    icon: Camera,
    color: "from-purple-500 to-pink-500",
    badge: "",
  },
  {
    id: "nokta-bulutu",
    title: "Nokta Bulutu İşleme",
    description: "Tarama sonucu elde edilen nokta bulutlarını işleyerek anlamlı ve kullanılabilir verilere dönüştürüyoruz.",
    icon: Layers,
    color: "from-emerald-500 to-teal-400",
    badge: "",
  },
  {
    id: "bim-modelleme",
    title: "BIM Modelleme",
    description: "Nokta bulutu verilerini kullanarak yapıların BIM (Yapı Bilgi Modellemesi) modellerini oluşturuyoruz.",
    icon: Building2,
    color: "from-orange-500 to-amber-400",
    badge: "Yeni",
  },
  {
    id: "cad-cizim",
    title: "CAD Çizimleri",
    description: "3D verilerden hassas 2D CAD çizimleri ve kesitler üretiyoruz.",
    icon: PenTool,
    color: "from-red-500 to-rose-400",
    badge: "",
  },
  {
    id: "web-3d",
    title: "Web 3D Uygulamaları",
    description: "Taramalardan elde edilen 3D modelleri interaktif web uygulamalarına dönüştürüyoruz.",
    icon: FileDigit,
    color: "from-indigo-500 to-violet-400",
    badge: "Öne Çıkan",
  }
];

export default function ServicesSection() {
  const [activeServiceId, setActiveServiceId] = useState(services[0].id);
  
  const activeService = services.find(service => service.id === activeServiceId) || services[0];

  return (
    <section id="services" className="py-16 md:py-24 bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-12 max-w-2xl mx-auto reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dijital <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Hizmetlerimiz</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Mimari ve kültürel mirası dijital dünyaya taşımak için uzman ekibimiz ve en son teknolojilerle sizlere hizmet veriyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Sol taraf - Hizmet seçimi */}
          <div className="grid grid-cols-2 gap-4 reveal">
            {services.map((service) => (
              <div
                key={service.id}
                className={cn(
                  "relative p-6 rounded-xl cursor-pointer transition-all overflow-hidden group border",
                  activeServiceId === service.id 
                    ? "border-primary/50 bg-primary/5" 
                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                )}
                onClick={() => setActiveServiceId(service.id)}
              >
                <div className="relative z-10">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all",
                    `bg-gradient-to-br ${service.color} text-white`
                  )}>
                    <service.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{service.title}</h3>
                  {service.badge && (
                    <Badge variant="outline" className="absolute top-2 right-2 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                      {service.badge}
                    </Badge>
                  )}
                </div>
                
                {/* Arka plan efekti */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300",
                  activeServiceId === service.id ? "opacity-5" : "group-hover:opacity-5",
                  service.color
                )}></div>
              </div>
            ))}
          </div>

          {/* Sağ taraf - Detaylı bilgi */}
          <div className="bg-muted/50 backdrop-blur-sm rounded-2xl p-8 border relative overflow-hidden reveal">
            <div className="relative z-10">
              <div className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all",
                `bg-gradient-to-br ${activeService.color} text-white`
              )}>
                <activeService.icon className="h-8 w-8" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{activeService.title}</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                {activeService.description}
              </p>
              
              <Button asChild>
                <Link to="/services" className="inline-flex items-center gap-2">
                  Daha Fazla Bilgi
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {/* Arka plan efekti */}
            <div className={cn(
              "absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full bg-gradient-to-r opacity-10 blur-3xl",
              activeService.color
            )}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
