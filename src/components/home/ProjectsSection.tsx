
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FeaturedProjectsSlider from "./FeaturedProjectsSlider";
import FeaturedProjectContent from "./FeaturedProjectContent";
import FeaturedProjectImage from "./FeaturedProjectImage";

export default function ProjectsSection() {
  // FeaturedProjectsSlider hook'unu çağıralım
  const { loading, featuredProjects, currentIndex, setCurrentIndex, renderDotIndicators } = FeaturedProjectsSlider({ className: "" });

  // Manuel olarak önceki projeye geçiş
  const goToPrevious = () => {
    if (featuredProjects.length <= 1) return;
    const newIndex = currentIndex === 0 ? featuredProjects.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  // Manuel olarak sonraki projeye geçiş
  const goToNext = () => {
    if (featuredProjects.length <= 1) return;
    const newIndex = (currentIndex + 1) % featuredProjects.length;
    setCurrentIndex(newIndex);
  };

  if (loading) {
    return (
      <section id="projects" className="min-h-screen bg-muted/50 dark:bg-muted/20">
        <div className="section-container min-h-screen flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </section>
    );
  }

  if (featuredProjects.length === 0) {
    return (
      <section id="projects" className="min-h-screen bg-muted/50 dark:bg-muted/20">
        <div className="section-container min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Öne Çıkan Projelerimiz</h2>
          <p className="text-muted-foreground text-lg text-center mb-8 max-w-2xl">
            Henüz öne çıkan proje bulunmuyor. Admin panelinden bir projeyi "öne çıkan" olarak işaretleyebilirsiniz.
          </p>
          <Button asChild variant="outline" size="lg">
            <Link to="/projects" className="flex items-center">
              Tüm Projeleri Gör
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  // Görüntülenecek güncel projeyi al
  const featuredProject = featuredProjects[currentIndex];

  return (
    <section id="projects" className="min-h-screen bg-muted/50 dark:bg-muted/20 relative">
      {/* Sol geçiş butonu */}
      <button 
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-full md:h-4/5 w-16 md:w-24 flex items-center justify-start pl-2 md:pl-4 bg-gradient-to-r from-black/10 to-transparent hover:from-black/20 transition-all duration-300"
        aria-label="Önceki proje"
      >
        <ChevronLeft className="h-8 w-8 md:h-10 md:w-10 text-white drop-shadow-md" />
      </button>
      
      {/* Sağ geçiş butonu */}
      <button 
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full md:h-4/5 w-16 md:w-24 flex items-center justify-end pr-2 md:pr-4 bg-gradient-to-l from-black/10 to-transparent hover:from-black/20 transition-all duration-300"
        aria-label="Sonraki proje"
      >
        <ChevronRight className="h-8 w-8 md:h-10 md:w-10 text-white drop-shadow-md" />
      </button>

      <div className="section-container min-h-screen grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <FeaturedProjectContent 
          project={featuredProject}
          dotIndicators={renderDotIndicators()}
        />
        <FeaturedProjectImage project={featuredProject} />
      </div>
    </section>
  );
}
