
import { Building2, Scan3d, Camera, Box, History, Archive, FileDigit, Building, Boxes, PanelTopOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ServiceProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
  delay: number;
}

const serviceItems: ServiceProps[] = [
  {
    title: "3D Lazer Tarama",
    description: "Yapıların iç ve dış mekanlarının milimetrik hassasiyette 3 boyutlu taranması, nokta bulutu oluşturulması ve CAD modellerine dönüştürülmesi.",
    icon: <Scan3d className="h-10 w-10" />,
    features: [
      "Milimetrik hassasiyetle ölçüm",
      "Yüksek çözünürlüklü nokta bulutu",
      "CAD uyumlu çıktılar",
      "Büyük alanlarda hızlı tarama"
    ],
    color: "blue",
    delay: 0
  },
  {
    title: "Fotogrametri",
    description: "Fotoğraflardan 3 boyutlu modeller oluşturarak yapıların detaylı dokularını yakalama ve gerçekçi 3D modeller elde etme.",
    icon: <Camera className="h-10 w-10" />,
    features: [
      "Gerçekçi doku detayları",
      "Drone destekli veri toplama",
      "Yüksek çözünürlüklü modelleme",
      "Maliyet etkin çözümler"
    ],
    color: "amber",
    delay: 0.1
  },
  {
    title: "BIM Modelleme",
    description: "Yapı Bilgi Modellemesi ile binaların parametrik ve akıllı 3D modellerinin oluşturulması, yapı yaşam döngüsü yönetimi.",
    icon: <Building2 className="h-10 w-10" />,
    features: [
      "Revit uyumlu BIM modelleri",
      "Parametrik nesne kütüphanesi",
      "MEP sistemleri entegrasyonu",
      "Çakışma tespiti ve analizi"
    ],
    color: "green",
    delay: 0.2
  },
  {
    title: "Tarihi Yapı Belgeleme",
    description: "Kültürel mirasın korunması için tarihi yapıların detaylı belgelenmesi ve dijital arşivlenmesi hizmetleri.",
    icon: <History className="h-10 w-10" />,
    features: [
      "Restorasyon projelerine altlık",
      "Arşivleme ve belgeleme",
      "Hasar tespiti",
      "Zaman içinde değişim analizi"
    ],
    color: "violet",
    delay: 0.3
  },
  {
    title: "3D Modelleme",
    description: "Mimari projelerin yüksek kaliteli 3D görselleştirilmesi, render hizmetleri ve animasyon çalışmaları.",
    icon: <Box className="h-10 w-10" />,
    features: [
      "Fotorealistik renderlar",
      "İnteraktif 3D görselleştirmeler",
      "Animasyon ve flythrough",
      "Sanal gerçeklik entegrasyonu"
    ],
    color: "rose",
    delay: 0.4
  },
  {
    title: "Dijital İkiz",
    description: "Yapıların gerçek zamanlı veri toplama ve analiz için dijital ikizlerinin oluşturulması ve yönetim çözümleri.",
    icon: <FileDigit className="h-10 w-10" />,
    features: [
      "IoT sensör entegrasyonu",
      "Gerçek zamanlı veri analizi",
      "Performans izleme",
      "Bakım planlama ve optimizasyon"
    ],
    color: "indigo",
    delay: 0.5
  },
  {
    title: "As-built Dokümantasyon",
    description: "İnşaat sonrası gerçekleşen yapının mevcut durum modellemesi ve dokümantasyonu hizmetleri.",
    icon: <Building className="h-10 w-10" />,
    features: [
      "Gerçekleşen yapı analizi",
      "Yapısal uygunluk kontrolleri",
      "Detaylı raporlama",
      "Teknik dokümantasyon"
    ],
    color: "teal",
    delay: 0.6
  },
  {
    title: "Karmaşık Geometri Modelleme",
    description: "Parametrik tasarım ve algoritmatik modelleme ile kompleks geometriye sahip yapıların 3D olarak modellenmesi.",
    icon: <Boxes className="h-10 w-10" />,
    features: [
      "Grasshopper ve Dynamo entegrasyonu",
      "Parametrik modelleme",
      "Üretilebilir geometriler",
      "Optimizasyon ve analiz"
    ],
    color: "orange",
    delay: 0.7
  },
  {
    title: "Cephe Analizi",
    description: "Bina cephelerinin detaylı analizi, termal haritalama ve bakım planlama hizmetleri.",
    icon: <PanelTopOpen className="h-10 w-10" />,
    features: [
      "Termal performans analizi",
      "Güneş ışınımı simülasyonu",
      "Cephe elemanları detaylandırma",
      "Malzeme ve detay dokümantasyonu"
    ],
    color: "cyan",
    delay: 0.8
  }
];

export default function ServicesList() {
  const getColorClasses = (color: string) => {
    const colorMap: {[key: string]: string} = {
      blue: "border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-950/30",
      amber: "border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/30",
      green: "border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-950/30",
      violet: "border-violet-200 dark:border-violet-900/30 bg-violet-50 dark:bg-violet-950/30",
      rose: "border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-950/30",
      indigo: "border-indigo-200 dark:border-indigo-900/30 bg-indigo-50 dark:bg-indigo-950/30",
      teal: "border-teal-200 dark:border-teal-900/30 bg-teal-50 dark:bg-teal-950/30",
      orange: "border-orange-200 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-950/30",
      cyan: "border-cyan-200 dark:border-cyan-900/30 bg-cyan-50 dark:bg-cyan-950/30",
    };
    
    return colorMap[color] || "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900";
  };
  
  const getTextColorClasses = (color: string) => {
    const textColorMap: {[key: string]: string} = {
      blue: "text-blue-600 dark:text-blue-400",
      amber: "text-amber-600 dark:text-amber-400",
      green: "text-green-600 dark:text-green-400",
      violet: "text-violet-600 dark:text-violet-400",
      rose: "text-rose-600 dark:text-rose-400",
      indigo: "text-indigo-600 dark:text-indigo-400",
      teal: "text-teal-600 dark:text-teal-400",
      orange: "text-orange-600 dark:text-orange-400",
      cyan: "text-cyan-600 dark:text-cyan-400",
    };
    
    return textColorMap[color] || "text-gray-600 dark:text-gray-400";
  };
  
  return (
    <section className="py-20">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceItems.map((service, index) => (
            <div 
              key={index}
              className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-muted/10 reveal`}
              style={{ animationDelay: `${service.delay}s` }}
            >
              <div className={`p-6 ${getColorClasses(service.color)}`}>
                <div className={`inline-block p-3 rounded-md ${getTextColorClasses(service.color)}`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mt-4">{service.title}</h3>
                <p className="mt-2 text-muted-foreground">{service.description}</p>
              </div>
              
              <div className="p-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">TEMEL ÖZELLİKLER</h4>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className={`mr-2 h-5 w-5 ${getTextColorClasses(service.color)}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
