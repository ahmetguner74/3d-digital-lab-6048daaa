import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
export default function HeroSection() {
  return <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-muted/20">
      <div className="section-container min-h-[90vh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 reveal">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Merhaba, ben <span className="text-gradient">Dijitalleştirme Atölyesi</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              Front-end geliştirici ve UI/UX tasarımcısı olarak modern ve kullanıcı dostu web deneyimleri oluşturuyorum.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="group">
                <Link to="/contact">
                  İletişime Geç
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="group">
                <a href="/cv.pdf" download>
                  CV İndir
                  <FileText className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          
          <div className="relative w-full max-w-md mx-auto lg:max-w-none reveal">
            <div className="aspect-square rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur p-1">
              <div className="h-full w-full rounded-full overflow-hidden bg-muted/50">
                {/* Replace with your profile image */}
                <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80" alt="Profile" className="h-full w-full object-cover" />
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/30 blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-secondary/30 blur-2xl"></div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
          <span className="text-sm text-muted-foreground mb-2">Kaydır</span>
          <div className="h-10 w-6 rounded-full border-2 border-muted-foreground/30 flex justify-center">
            <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2"></div>
          </div>
        </div>
      </div>
    </section>;
}