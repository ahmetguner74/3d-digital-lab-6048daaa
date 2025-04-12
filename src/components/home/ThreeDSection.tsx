
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ThreeDSection() {
  return (
    <section className="bg-gradient-to-b from-background to-muted/30 py-16">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 reveal">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">3D Nokta Bulutu Teknolojisi</h2>
            <p className="text-muted-foreground mb-6">
              Nokta bulutu teknolojisi, fiziksel nesnelerin ve alanların üç boyutlu dijital temsilini oluşturmak için kullanılan güçlü bir araçtır. 
              Her nokta, gerçek dünyadaki bir nesnenin yüzeyindeki belirli bir konumu temsil eder ve x, y, z koordinatları ile tanımlanır.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Yüksek Hassasiyet</h3>
                  <p className="text-muted-foreground">Lazer tarama teknolojisiyle milimetre hassasiyetinde ölçümler</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Web Tabanlı Görüntüleme</h3>
                  <p className="text-muted-foreground">Potree teknolojisi ile büyük nokta bulutu verilerini tarayıcınızda sorunsuz görüntüleyin</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Dijital İkiz</h3>
                  <p className="text-muted-foreground">Gerçek dünya varlıklarının dijital kopyalarını oluşturun ve analiz edin</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link to="/3d-viewer" className="flex items-center">
                  Görüntüleyiciyi Dene
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/services">Hizmetlerimiz Hakkında</Link>
              </Button>
            </div>
          </div>

          <div className="order-1 lg:order-2 reveal">
            <div className="relative">
              <img 
                src="/tech/potree.png" 
                alt="3D Nokta Bulutu Teknolojisi" 
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg"; 
                }}
              />
              <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-primary/10 blur-xl -z-10"></div>
              <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-secondary/10 blur-xl -z-10"></div>
              
              <div className="absolute top-0 left-0 bg-gradient-to-br from-primary/20 to-transparent w-full h-full rounded-lg opacity-60"></div>
              
              <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-4 py-2 rounded shadow-lg">
                <p className="text-sm font-medium">Potree & WebGL Teknolojisi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
