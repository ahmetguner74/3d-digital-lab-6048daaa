import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
export default function AboutSection() {
  return <section id="about" className="bg-background py-[17px]">
      <div className="section-container my-0 mx-0 px-0 py-0">
        <h2 className="section-title reveal px-0 py-0 my-0 mx-0 text-4xl font-medium text-slate-950">Hakkımızda</h2>
        
        <div className="mt-12">
          <div className="space-y-6 reveal max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground">
              3D Dijital Lab olarak, mimari ve arkeolojik yapıları en son teknolojilerle dijitalleştiriyoruz. 
              Lazer tarama ve fotogrametri teknolojilerini kullanarak, yapıların milimetrik hassasiyette 
              3D modellerini oluşturup, gelecek nesillere aktarılmasını sağlıyoruz.
            </p>
            
            <p className="text-lg text-muted-foreground">
              Ekibimiz, mimarlık, mühendislik ve bilişim alanlarında uzmanlaşmış profesyonellerden oluşuyor. 
              Projelerimizde en yüksek kaliteyi sunmak için sürekli kendimizi geliştiriyor ve 
              teknolojideki son yenilikleri takip ediyoruz.
            </p>
            
            <div className="text-center mt-8">
              <Button asChild variant="default">
                <Link to="/contact">İletişime Geçin</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
}