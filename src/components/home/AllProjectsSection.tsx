
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  category: string;
}

export default function AllProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Supabase'den yayında olan projeleri çek
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, slug, cover_image, category')
          .eq('status', 'Yayında')
          .order('created_at', { ascending: false })
          .limit(6);
          
        if (error) {
          throw error;
        }
        
        console.log("Ana sayfa projeleri:", data);
        setProjects(data || []);
      } catch (err) {
        console.error('Projeler yüklenirken hata oluştu:', err);
        setError('Projeler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Veri yoksa varsayılan projeleri göster
  const displayProjects = projects.length > 0 ? projects : [
    {
      id: "1",
      title: "Sivil Mimari Örneği",
      cover_image: "/placeholder.svg",
      slug: "sivil-mimari",
      category: "Mimari"
    },
    {
      id: "2",
      title: "Arkeolojik Eserler",
      cover_image: "/placeholder.svg",
      slug: "arkeolojik-eserler",
      category: "Arkeoloji"
    },
    {
      id: "3",
      title: "Tarihi Yapılar",
      cover_image: "/placeholder.svg",
      slug: "tarihi-yapilar",
      category: "Koruma"
    },
    {
      id: "4",
      title: "Modern Mimari",
      cover_image: "/placeholder.svg",
      slug: "modern-mimari",
      category: "Mimari"
    },
    {
      id: "5",
      title: "Müze Sergileri",
      cover_image: "/placeholder.svg",
      slug: "muze-sergileri",
      category: "Müze"
    },
    {
      id: "6",
      title: "Kültürel Miras",
      cover_image: "/placeholder.svg",
      slug: "kulturel-miras",
      category: "Koruma"
    }
  ];

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
        
        {/* Yükleniyor durumu */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {/* Hata durumu */}
        {error && !loading && (
          <div className="text-center py-4 mb-8">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project) => (
            <Link 
              key={project.id} 
              to={`/projects/${project.slug}`}
              className="group rounded-lg overflow-hidden bg-muted/50 dark:bg-muted/20 reveal"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={project.cover_image || "/placeholder.svg"} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {project.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <Button asChild size="lg">
            <Link to="/projects" className="flex items-center">
              Tüm Projeleri Görüntüle
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
