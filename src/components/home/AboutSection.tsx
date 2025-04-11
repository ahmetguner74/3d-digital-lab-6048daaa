
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const technologies = [
  { name: "React", logo: "/tech/react.svg" },
  { name: "TypeScript", logo: "/tech/typescript.svg" },
  { name: "Tailwind CSS", logo: "/tech/tailwind.svg" },
  { name: "Supabase", logo: "/tech/supabase.svg" },
  { name: "Three.js", logo: "/tech/threejs.svg" },
  { name: "Potree", logo: "/tech/potree.png" },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-background">
      <div className="section-container">
        <h2 className="section-title reveal px-0 py-0 my-0 mx-0 text-4xl font-medium text-slate-950">Hakkımızda</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          <div className="space-y-6 reveal">
            <p className="text-lg text-muted-foreground">
              Mimari ve arkeolojik yapıları en son teknolojilerle dijitalleştiren uzman ekibimizle, 
              fiziksel dünyanın en doğru dijital temsillerini oluşturuyoruz.
            </p>
            <p className="text-lg text-muted-foreground">
              Lazer tarama ve fotogrametri teknolojilerini entegre ederek, milimetrik hassasiyette 3D modeller üretiyor,
              mimari, mühendislik ve koruma alanlarında öncü çözümler sunuyoruz.
            </p>
            
            <div>
              <Button asChild variant="secondary">
                <Link to="/about">Detaylı Bilgi</Link>
              </Button>
            </div>
          </div>
          
          <div className="reveal">
            <h3 className="text-2xl font-semibold mb-8">Teknolojilerimiz</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {technologies.map((tech) => (
                <div key={tech.name} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-4 flex items-center justify-center bg-background rounded-lg p-2 border border-border">
                    <img 
                      src={tech.logo} 
                      alt={tech.name} 
                      className="max-w-full max-h-full object-contain" 
                    />
                  </div>
                  <span className="text-sm font-medium">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
