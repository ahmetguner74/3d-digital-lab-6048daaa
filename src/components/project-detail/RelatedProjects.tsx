
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Project } from "@/components/projects/types";

interface RelatedProjectsProps {
  relatedProjects: Project[];
}

export default function RelatedProjects({ relatedProjects }: RelatedProjectsProps) {
  // İlgili projeler arasında gezinme için
  const currentSlug = window.location.pathname.split('/').pop();
  const currentIndex = relatedProjects.findIndex(p => p.slug === currentSlug);
  const prevProject = currentIndex > 0 ? relatedProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < relatedProjects.length - 1 ? relatedProjects[currentIndex + 1] : null;

  return (
    <section className="bg-muted/50 dark:bg-muted/20 py-20">
      <div className="section-container">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center reveal">Diğer Projeler</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProjects.map(p => (
            <Link 
              key={p.id} 
              to={`/projects/${p.slug}`} 
              className="group rounded-lg overflow-hidden bg-muted/50 dark:bg-muted/20 reveal"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={p.cover_image || "/placeholder.svg"} 
                  alt={p.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="flex justify-between mt-12">
          <div>
            {prevProject && (
              <Button asChild variant="outline">
                <Link to={`/projects/${prevProject.slug}`} className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Önceki Proje
                </Link>
              </Button>
            )}
          </div>
          
          <Button asChild>
            <Link to="/projects">
              Tüm Projeleri Görüntüle
            </Link>
          </Button>
          
          <div>
            {nextProject && (
              <Button asChild variant="outline">
                <Link to={`/projects/${nextProject.slug}`} className="flex items-center">
                  Sonraki Proje
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
