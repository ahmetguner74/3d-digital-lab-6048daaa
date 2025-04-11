
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample project data - This will be fetched from Supabase in a later step
const sampleProjects = [
  {
    id: 1,
    title: "Sivil Mimari Örneği",
    image: "/placeholder.svg",
    slug: "sivil-mimari"
  },
  {
    id: 2,
    title: "Arkeolojik Eserler",
    image: "/placeholder.svg",
    slug: "arkeolojik-eserler"
  },
  {
    id: 3,
    title: "Tarihi Yapılar",
    image: "/placeholder.svg",
    slug: "tarihi-yapilar"
  },
  {
    id: 4,
    title: "Modern Mimari",
    image: "/placeholder.svg",
    slug: "modern-mimari"
  },
  {
    id: 5,
    title: "Müze Sergileri",
    image: "/placeholder.svg",
    slug: "muze-sergileri"
  },
  {
    id: 6,
    title: "Kültürel Miras",
    image: "/placeholder.svg",
    slug: "kulturel-miras"
  }
];

export default function AllProjectsSection() {
  return (
    <section className="min-h-screen bg-background">
      <div className="section-container py-20">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Tüm Projelerimiz
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            3D dijitalleştirme alanında gerçekleştirdiğimiz çalışmalarımızdan bazıları.
            Her bir proje, mimari ve kültürel değerlerin korunmasına katkıda bulunuyor.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleProjects.map((project) => (
            <Link 
              key={project.id} 
              to={`/projects/${project.slug}`}
              target="_blank"
              className="group rounded-lg overflow-hidden bg-muted/50 dark:bg-muted/20 reveal"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <Button asChild size="lg">
            <Link to="/projects" target="_blank" className="flex items-center">
              Tüm Projeleri Görüntüle
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
