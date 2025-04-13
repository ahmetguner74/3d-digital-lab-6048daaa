
import { FeaturedProject } from "./FeaturedProjectsSlider";
import FeaturedProjectContent from "./FeaturedProjectContent";
import FeaturedProjectImage from "./FeaturedProjectImage";
import DotIndicators from "./projects/DotIndicators";
import EmptyState from "./projects/EmptyState";
import FeaturedProjectControls from "./projects/FeaturedProjectControls";
import LoadingState from "./projects/LoadingState";
import { useFeaturedProjects } from "./projects/useFeaturedProjects";

// FeaturedProject tipini burada tanımlayalım
export interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  slug: string;
  cover_image: string;
  category?: string;
  haspointcloud?: boolean;
  pointcloudpath?: string;
}

export default function ProjectsSection() {
  const {
    featuredProjects,
    currentIndex,
    setCurrentIndex,
    loading,
    goToPrevious,
    goToNext
  } = useFeaturedProjects();

  // Nokta göstergeleri oluştur
  const renderDotIndicators = () => {
    return (
      <DotIndicators
        totalCount={featuredProjects.length}
        activeIndex={currentIndex}
        onClick={setCurrentIndex}
      />
    );
  };

  if (loading) {
    return (
      <section id="projects" className="min-h-screen bg-muted/50 dark:bg-muted/20">
        <div className="section-container min-h-screen flex items-center justify-center">
          <LoadingState />
        </div>
      </section>
    );
  }

  if (featuredProjects.length === 0) {
    return (
      <section id="projects" className="min-h-screen bg-muted/50 dark:bg-muted/20">
        <div className="section-container min-h-screen">
          <EmptyState />
        </div>
      </section>
    );
  }

  // Görüntülenecek güncel projeyi al
  const featuredProject = featuredProjects[currentIndex];

  return (
    <section id="projects" className="min-h-screen bg-muted/50 dark:bg-muted/20 relative">
      <FeaturedProjectControls
        goToPrevious={goToPrevious}
        goToNext={goToNext}
      />

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
