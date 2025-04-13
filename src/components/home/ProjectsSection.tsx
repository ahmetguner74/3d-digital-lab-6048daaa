
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FeaturedProjectsSlider from "./FeaturedProjectsSlider";
import FeaturedProjectContent from "./FeaturedProjectContent";
import FeaturedProjectImage from "./FeaturedProjectImage";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FeaturedProject } from "./FeaturedProjectsSlider";

export default function ProjectsSection() {
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);
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
      } catch (err) {
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
