
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FeaturedProjectsSlider from "./FeaturedProjectsSlider";
import FeaturedProjectContent from "./FeaturedProjectContent";
import FeaturedProjectImage from "./FeaturedProjectImage";

export default function ProjectsSection() {
  // FeaturedProjectsSlider hook'unu doğru şekilde çağıralım - boş bir className parametresi geçelim
  const { loading, featuredProjects, currentIndex, renderDotIndicators } = FeaturedProjectsSlider({ className: "" });

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
    <section id="projects" className="min-h-screen bg-muted/50 dark:bg-muted/20">
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
