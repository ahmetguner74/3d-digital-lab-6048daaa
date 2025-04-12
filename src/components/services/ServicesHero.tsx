
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ServicesHero() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center reveal">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Hizmetlerimiz</h1>
          <p className="text-xl text-muted-foreground mb-8">
            3D Dijital Lab olarak, mimari ve arkeolojik yapıların dijitalleştirilmesi için 
            en son teknolojileri kullanarak profesyonel çözümler sunuyoruz.
          </p>
          <Button asChild size="lg" className="group">
            <Link to="/contact" className="flex items-center">
              Bizimle İletişime Geçin
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
