
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FeaturedProject } from "./types/FeaturedProject";
import { ProjectCard } from "./ProjectCard";
import { useFeaturedProjectsSlider } from "./hooks/useFeaturedProjectsSlider";
import DotIndicators from "./DotIndicators";
import FeaturedProjectsLoading from "./FeaturedProjectsLoading";

interface FeaturedProjectsSliderProps {
  className?: string;
}

export default function FeaturedProjectsSlider({ className = "" }: FeaturedProjectsSliderProps) {
  const {
    featuredProjects,
    currentIndex,
    setCurrentIndex,
    loading,
    getCurrentProject
  } = useFeaturedProjectsSlider();

  if (loading) {
    return <FeaturedProjectsLoading className={className} />;
  }

  if (!featuredProjects.length) {
    return null;
  }

  const currentProject = getCurrentProject();

  return (
    <div className={`${className} rounded-xl overflow-hidden bg-card border shadow-sm`}>
      <div className="flex flex-col md:flex-row">
        {/* Proje Görseli - Sol Taraf */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
          <Link to={`/projects/${currentProject.slug}`}>
            <img 
              src={currentProject.cover_image || "/placeholder.svg"} 
              alt={currentProject.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </Link>
        </div>

        {/* Proje Bilgisi - Sağ Taraf */}
        <div className="w-full md:w-1/2 p-6">
          <div className="h-full flex flex-col justify-between">
            <div>
              {currentProject.category && (
                <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                  {currentProject.category}
                </span>
              )}
              <h3 className="text-xl font-bold mb-3">
                <Link to={`/projects/${currentProject.slug}`} className="hover:text-primary transition-colors">
                  {currentProject.title}
                </Link>
              </h3>
              <p className="text-muted-foreground line-clamp-4 mb-4">
                {currentProject.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <Button asChild variant="default">
                <Link to={`/projects/${currentProject.slug}`}>
                  Devamını Gör
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <DotIndicators 
                totalCount={featuredProjects.length} 
                activeIndex={currentIndex} 
                onClick={setCurrentIndex}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// FeaturedProject arayüzünü geriye dönük uyumluluk için dışa aktarıyoruz
// isolatedModules etkin olduğunda tür dışa aktarımları için "export type" kullanılmalı
export type { FeaturedProject };
