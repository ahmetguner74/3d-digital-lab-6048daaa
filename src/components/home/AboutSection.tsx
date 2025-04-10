import { Code, Database, Globe, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
const skills = [{
  name: "React"
}, {
  name: "TypeScript"
}, {
  name: "Next.js"
}, {
  name: "Tailwind CSS"
}, {
  name: "Node.js"
}, {
  name: "GraphQL"
}, {
  name: "Figma"
}, {
  name: "Git"
}];
export default function AboutSection() {
  return <section id="about" className="bg-background">
      <div className="section-container">
        <h2 className="section-title reveal px-0 py-0 my-0 mx-0 text-4xl font-medium text-slate-950">Hakkımızda</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          <div className="space-y-6 reveal">
            <p className="text-lg text-muted-foreground">Gerçeği dijitale taşıyoruz.

Yüksek hassasiyetli 3D mimari dijitalleştirme hizmeti sunuyoruz. Lazer tarama ve fotogrametri teknolojilerini bir araya getirerek binaların, yapısal elemanların ve alanların dijital ikizlerini milimetre hassasiyetinde oluşturuyoruz. Her projede, fiziksel dünyanın en doğru temsilini üretmeyi hedefliyoruz.</p>
            <p className="text-lg text-muted-foreground">Mimarlık, mühendislik, restorasyon ve şehir planlama gibi birçok alanda, dijital veri üretimiyle süreçleri hızlandırıyor, hata payını azaltıyoruz. Gerçeklik yakalama teknolojilerine hâkim ekibimiz, dijital dönüşüm yolculuğunuzda size güvenilir bir ortak olmayı amaçlar.</p>
            <p className="text-lg text-muted-foreground">Geleceği, bugünden modelliyoruz.</p>
            
            <div>
              <Button asChild variant="secondary">
                <Link to="/about">Detaylı Bilgi</Link>
              </Button>
            </div>
          </div>
          
          <div className="space-y-8 reveal">
            <h3 className="text-2xl font-semibold">Yeteneklerim</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map(skill => <span key={skill.name} className="skill-tag">
                  {skill.name}
                </span>)}
            </div>
            
            <h3 className="text-2xl font-semibold mt-8">Hizmetlerim</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors">
                <Globe className="h-8 w-8 text-primary mb-3" />
                <h4 className="text-lg font-semibold mb-1">Web Geliştirme</h4>
                <p className="text-sm text-muted-foreground">
                  Modern ve kullanıcı dostu web siteleri ve uygulamaları
                </p>
              </div>
              
              <div className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors">
                <Palette className="h-8 w-8 text-primary mb-3" />
                <h4 className="text-lg font-semibold mb-1">UI/UX Tasarım</h4>
                <p className="text-sm text-muted-foreground">
                  Kullanıcı odaklı, sezgisel ve çekici arayüzler
                </p>
              </div>
              
              <div className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors">
                <Code className="h-8 w-8 text-primary mb-3" />
                <h4 className="text-lg font-semibold mb-1">Front-end Geliştirme</h4>
                <p className="text-sm text-muted-foreground">
                  Performanslı ve modern JavaScript/React çözümleri
                </p>
              </div>
              
              <div className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors">
                <Database className="h-8 w-8 text-primary mb-3" />
                <h4 className="text-lg font-semibold mb-1">CMS Entegrasyonu</h4>
                <p className="text-sm text-muted-foreground">
                  Headless CMS sistemleri ile içerik yönetimi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}