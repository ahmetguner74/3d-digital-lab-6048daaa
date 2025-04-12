
import CountUp from 'react-countup';
import { cn } from "@/lib/utils";
import { Building, Users, FileText, LineChart } from "lucide-react";

interface Stat {
  id: string;
  title: string;
  value: number;
  suffix: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const stats: Stat[] = [
  {
    id: "completed-projects",
    title: "Tamamlanan Projeler",
    value: 120,
    suffix: "+",
    description: "Başarıyla tamamlanan mimari ve arkeolojik projeler",
    icon: <Building className="h-8 w-8" />,
    delay: 0
  },
  {
    id: "happy-clients",
    title: "Mutlu Müşteriler",
    value: 45,
    suffix: "+",
    description: "Hizmetlerimizden memnun kalan kurumlar ve bireyler",
    icon: <Users className="h-8 w-8" />,
    delay: 0.1
  },
  {
    id: "documented-sites",
    title: "Belgelenen Yapılar",
    value: 250,
    suffix: "+",
    description: "Dijital olarak belgelenen tarihi ve modern yapılar",
    icon: <FileText className="h-8 w-8" />,
    delay: 0.2
  },
  {
    id: "project-growth",
    title: "Yıllık Büyüme",
    value: 35,
    suffix: "%",
    description: "Son yıldaki proje sayımızdaki artış oranı",
    icon: <LineChart className="h-8 w-8" />,
    delay: 0.3
  }
];

export default function StatisticsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Sayılarla Biz</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Yılların tecrübesi ve teknolojik altyapımızla mimari yapıların dijitalleştirilmesinde 
            lider konumumuzu sürdürüyoruz.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className={cn(
                "bg-background p-6 rounded-lg border border-border shadow-sm text-center reveal",
                `reveal-delay-${stat.delay * 1000}`
              )}
            >
              <div className="bg-primary/10 rounded-full p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4 text-primary">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold mb-2">
                <CountUp 
                  end={stat.value} 
                  duration={2.5}
                  suffix={stat.suffix}
                  enableScrollSpy 
                  scrollSpyOnce
                />
              </div>
              <h3 className="text-lg font-medium mb-2">{stat.title}</h3>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
