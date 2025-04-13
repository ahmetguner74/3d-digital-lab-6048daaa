
import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
// ProjectCard artık bu dosyada tanımlandığı için ayrıca import edilmesine gerek yok

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

interface FeaturedProjectsSliderProps {
  className?: string;
}

export default function FeaturedProjectsSlider({ className = "" }: FeaturedProjectsSliderProps) {
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);

        // Admin panelinden "featured" olarak işaretlenmiş ve yayında olan projeleri çek
        const { data, error } = await supabase.from('projects')
          .select('id, title, description, slug, cover_image, category, haspointcloud, pointcloudpath')
          .eq('featured', true)
          .eq('status', 'Yayında')
          .order('updated_at', { ascending: false });
          
        if (error) {
          console.error('Öne çıkan proje yüklenirken hata:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log("Öne çıkan projeler yüklendi:", data);
          setFeaturedProjects(data);
        } else {
          console.log("Öne çıkan proje bulunamadı, demo veriler yükleniyor");
          // Demo veriler
          const demoProjects = [
            {
              id: "1",
              title: "Tarihi Kent Dokusunun 3D Dijitalleştirilmesi",
              slug: "tarihi-kent-dokusu",
              description: "Tarihi kent dokusunun lazer tarama ve fotogrametri teknikleri ile dijitalleştirilmesi ve sanal ortama aktarılması projesi",
              cover_image: "/placeholder.svg",
              category: "Koruma"
            },
            {
              id: "2",
              title: "Arkeolojik Alanın 3D Belgelenmesi",
              slug: "arkeolojik-alan-belgelemesi",
              description: "Arkeolojik kalıntıların yüksek çözünürlüklü nokta bulutu ve 3D modellenmesi",
              cover_image: "/placeholder.svg",
              category: "Arkeoloji"
            },
            {
              id: "3",
              title: "Modern Mimari Eser Dijitalleştirme",
              slug: "modern-mimari-dijitallestirme",
              description: "Modern mimari yapının iç ve dış mekanlarının Three.js teknolojisi ile web ortamında interaktif sunumu",
              cover_image: "/placeholder.svg", 
              category: "Mimari"
            }
          ];
          setFeaturedProjects(demoProjects);
        }
      } catch (err: any) {
        console.error('Öne çıkan proje yüklenirken beklenmeyen hata:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedProjects();
    
    // Realtime değişiklikleri dinle
    const channel = supabase
      .channel('public:projects')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'projects',
          filter: 'featured=eq.true' 
        }, 
        payload => {
          console.log('Öne çıkan projelerde değişiklik algılandı:', payload);
          // Öne çıkan projelerde değişiklik olduğunda yeniden yükle
          fetchFeaturedProjects();
        })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Öne çıkan projeleri otomatik olarak değiştir
  useEffect(() => {
    if (featuredProjects.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredProjects.length);
      }, 7000); // Her 7 saniyede bir değiştir
      
      return () => clearInterval(interval);
    }
  }, [featuredProjects]);

  // Nokta göstergeleri oluştur
  const renderDotIndicators = () => {
    if (featuredProjects.length <= 1) return null;
    
    return (
      <div className="flex ml-4 items-center space-x-1">
        {featuredProjects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full ${idx === currentIndex ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
            aria-label={`Proje ${idx + 1}`}
          />
        ))}
      </div>
    );
  };

  const getCurrentProject = () => {
    return featuredProjects[currentIndex];
  };

  if (loading) {
    return (
      <div className={`${className} flex justify-center items-center h-64`}>
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
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

              {renderDotIndicators()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ProjectCard bileşeni - öne çıkan projeler için basitleştirilmiş kart
export function ProjectCard({ project }: { project: FeaturedProject }) {
  return (
    <div className="rounded-xl overflow-hidden bg-card border shadow-sm h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Link to={`/projects/${project.slug}`}>
          <img 
            src={project.cover_image || "/placeholder.svg"} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </Link>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        {project.category && (
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
            {project.category}
          </span>
        )}
        <h3 className="text-lg font-semibold mb-2">
          <Link to={`/projects/${project.slug}`} className="hover:text-primary transition-colors">
            {project.title}
          </Link>
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 flex-1">{project.description}</p>
        <div className="mt-4">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to={`/projects/${project.slug}`}>Detaylar</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
