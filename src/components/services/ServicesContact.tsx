
import { ArrowRight, MessageCircle, PhoneCall, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ServicesContact() {
  return (
    <section className="py-20">
      <div className="section-container">
        <div className="bg-gradient-to-r from-blue-500 to-violet-600 rounded-xl p-8 md:p-12 text-white shadow-xl overflow-hidden relative">
          {/* Background pattern */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 md:max-w-2xl reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Projeniz için özel çözümler üretmeye hazırız
            </h2>
            <p className="text-lg opacity-90 mb-8">
              İhtiyaçlarınıza uygun hizmet paketi için bizimle iletişime geçin. 
              Ücretsiz keşif ve fiyat teklifi sunalım.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <span>+90 530 225 2534</span>
              </div>
              
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  <Mail className="h-5 w-5" />
                </div>
                <span>info@3ddigitallab.com</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" variant="default" className="bg-white text-blue-600 hover:bg-white/90 border-0 group">
                <Link to="/contact" className="flex items-center">
                  İletişime Geç
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                <Link to="/projects" className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Projelerimizi Gör
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
