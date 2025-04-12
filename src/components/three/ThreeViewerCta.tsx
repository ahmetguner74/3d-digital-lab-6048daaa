
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ThreeViewerCtaProps {
  className?: string;
}

export default function ThreeViewerCta({ className = "" }: ThreeViewerCtaProps) {
  return (
    <div className={`${className} bg-muted/30 p-8 rounded-lg`}>
      <h2 className="text-2xl font-bold mb-4 text-center">3D Modelleme ve Görselleştirme</h2>
      <p className="mb-6 text-center text-muted-foreground">
        Profesyonel 3D modelleme ve görselleştirme çözümlerimiz ile projelerinizi hayata geçirin.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-muted/10 p-6 rounded-lg border border-muted">
          <h3 className="text-xl font-semibold mb-3">3D Modelleme Hizmetlerimiz</h3>
          <p className="mb-4 text-muted-foreground">
            Mimari, arkeolojik ve kültürel mirasın 3D modellenmesi için profesyonel çözümler sunuyoruz.
            Lazer tarama, fotogrametri ve manuel modelleme yöntemleriyle projenize en uygun tekniği kullanıyoruz.
          </p>
          <Button asChild className="w-full">
            <Link to="/contact">
              Bizimle İletişime Geçin
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="bg-white dark:bg-muted/10 p-6 rounded-lg border border-muted">
          <h3 className="text-xl font-semibold mb-3">Teknoloji Entegrasyonları</h3>
          <p className="mb-4 text-muted-foreground">
            Web sitenize veya uygulamanıza 3D görselleştirme teknolojilerini entegre ediyoruz.
            WebGL, Three.js, Potree veya özel çözümlerle benzersiz kullanıcı deneyimleri oluşturuyoruz.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/projects">
              Projelerimizi İnceleyin
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
