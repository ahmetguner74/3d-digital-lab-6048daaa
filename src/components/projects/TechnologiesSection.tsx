
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface TechnologiesSectionProps {
  className?: string;
}

export default function TechnologiesSection({ className = "" }: TechnologiesSectionProps) {
  const technologies = [
    {
      name: "Three.js",
      image: "/tech/threejs.svg",
      description: "WebGL tabanlı 3D görselleştirme kütüphanesi",
      link: "https://threejs.org/"
    },
    {
      name: "Potree",
      image: "/tech/potree.png",
      description: "Büyük nokta bulutu verileri için WebGL görüntüleyici",
      link: "https://potree.github.io/"
    },
    {
      name: "React",
      image: "/tech/react.svg",
      description: "Kullanıcı arayüzü ve etkileşimli bileşenler için JavaScript kütüphanesi",
      link: "https://react.dev/"
    },
    {
      name: "TypeScript",
      image: "/tech/typescript.svg",
      description: "Tip güvenliği sağlayan JavaScript süper kümesi",
      link: "https://www.typescriptlang.org/"
    },
    {
      name: "Supabase",
      image: "/tech/supabase.svg",
      description: "Firebase alternatifi açık kaynaklı arka uç servisi",
      link: "https://supabase.io/"
    },
    {
      name: "Tailwind CSS",
      image: "/tech/tailwind.svg",
      description: "Yardımcı sınıflarla çalışan CSS çerçevesi",
      link: "https://tailwindcss.com/"
    }
  ];

  return (
    <div className={`mt-16 pt-16 border-t border-muted ${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Kullandığımız Teknolojiler</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Projelerimizde kullandığımız modern ve yüksek performanslı teknolojiler, en iyi kullanıcı deneyimini sağlar.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {technologies.map((tech, index) => (
          <a 
            key={index}
            href={tech.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 bg-card hover:bg-accent/50 rounded-lg transition-all hover:shadow-md group"
          >
            <div className="w-16 h-16 p-2 mb-4 flex items-center justify-center">
              <img 
                src={tech.image} 
                alt={tech.name} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            <h3 className="font-medium mb-1">{tech.name}</h3>
            <p className="text-xs text-center text-muted-foreground">{tech.description}</p>
            <span className="mt-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              Daha Fazla <ExternalLink className="ml-1 h-3 w-3" />
            </span>
          </a>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button asChild variant="outline">
          <Link to="/3d-viewer" className="flex items-center">
            3D Görüntüleyiciyi Deneyin
          </Link>
        </Button>
      </div>
    </div>
  );
}
