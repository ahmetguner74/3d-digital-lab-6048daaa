
import { PhoneCall, FileSearch, Scan, Box, RefreshCw, Presentation, ThumbsUp } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: "consultation",
    title: "İlk Görüşme",
    description: "Projelerinizi ve ihtiyaçlarınızı anlamak için kapsamlı bir konsültasyon gerçekleştiriyoruz.",
    icon: <PhoneCall className="h-6 w-6" />
  },
  {
    id: "analysis",
    title: "Proje Analizi",
    description: "Projenizin gereksinimlerini analiz edip en uygun teknoloji ve yaklaşımı belirliyoruz.",
    icon: <FileSearch className="h-6 w-6" />
  },
  {
    id: "data-collection",
    title: "Veri Toplama",
    description: "Lazer tarama, fotogrametri ve diğer yöntemlerle sahadan veri topluyoruz.",
    icon: <Scan className="h-6 w-6" />
  },
  {
    id: "processing",
    title: "Veri İşleme",
    description: "Toplanan verileri yüksek doğrulukta işleyerek 3D modelleri oluşturuyoruz.",
    icon: <Box className="h-6 w-6" />
  },
  {
    id: "refinement",
    title: "Model İyileştirme",
    description: "Modellerinizi ihtiyaçlarınıza göre optimize ediyor ve gerekli düzenlemeleri yapıyoruz.",
    icon: <RefreshCw className="h-6 w-6" />
  },
  {
    id: "presentation",
    title: "Sunum ve Teslim",
    description: "İşlenmiş verileri istenilen formatta sunuyor ve detaylı dokümantasyon sağlıyoruz.",
    icon: <Presentation className="h-6 w-6" />
  },
  {
    id: "support",
    title: "Sürekli Destek",
    description: "Proje sonrasında da teknik destek ve danışmanlık hizmetleri sunmaya devam ediyoruz.",
    icon: <ThumbsUp className="h-6 w-6" />
  }
];

export default function ServiceProcess() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Çalışma Sürecimiz</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            3D Dijital Lab olarak her projemizde izlediğimiz sistemli bir süreç ile en yüksek kalitede 
            sonuçlar elde etmeyi hedefliyoruz.
          </p>
        </div>
        
        <div className="relative">
          {/* Bağlantı çizgisi (dikey) */}
          <div className="absolute left-[39px] md:left-1/2 md:-ml-[1px] top-0 bottom-0 w-[2px] bg-primary/20">
          </div>
          
          <div className="space-y-12 relative">
            {steps.map((step, index) => (
              <div key={step.id} className="reveal">
                <div className={`md:grid md:grid-cols-2 md:gap-8 items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  {/* Adım numarası ve içeriği */}
                  <div className={`relative flex ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'} mb-6 md:mb-0`}>
                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary border-4 border-background relative z-10">
                        <span className="text-2xl font-bold">{index + 1}</span>
                      </div>
                      
                      <div className="ml-6 flex flex-col md:w-80">
                        <div className="flex items-center mb-2">
                          <div className="p-2 rounded-md bg-primary/10 text-primary mr-3">
                            {step.icon}
                          </div>
                          <h3 className="text-xl font-bold">{step.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Boş alan (alternatif taraf) */}
                  <div className="hidden md:block">
                    {/* Sadece grid yapısı için */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
