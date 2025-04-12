
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FeaturedProject {
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
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);

        // Admin panelinden "featured" olarak işaretlenmiş ve yayında olan projeleri çek
        const {
          data,
          error
        } = await supabase.from('projects')
          .select('id, title, description, slug, cover_image, category, haspointcloud, pointcloudpath')
          .eq('featured', true)
          .eq('status', 'Yayında')
          .order('updated_at', { ascending: false })
          .limit(3);
          
        if (error) {
          console.error('Öne çıkan proje yüklenirken hata:', error);
          setLoading(false);
          return;
        }
        
        if (data && data.length > 0) {
          console.log("Öne çıkan projeler verileri:", data);
          setFeaturedProjects(data);
        } else {
          console.log("Öne çıkan proje bulunamadı");
          // Demo veriler
          const demoProjects = [
            {
              id: "1",
              title: "3. Proje",
              slug: "proje-3",
              description: "inanılmaz proje",
              cover_image: "/placeholder.svg",
              category: "Koruma"
            },
            {
              id: "2",
              title: "bbbbb",
              slug: "bbbbb",
              description: "asdsad",
              cover_image: "/placeholder.svg",
              category: "Mimari"
            },
            {
              id: "3",
              title: "proje2",
              slug: "proje-2",
              description: "çok güzel proje",
              cover_image: "/placeholder.svg", 
              category: "Arkeoloji"
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
        () => {
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
        <div className="md:col-span-6 space-y-6 order-2 md:order-1">
          <div className="space-y-2">
            <div className="flex items-center mb-2">
              <h2 className="text-3xl md:text-4xl font-bold">
                {featuredProject.title}
              </h2>
              {featuredProjects.length > 1 && (
                <div className="flex ml-4 items-center space-x-1">
                  {featuredProjects.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-primary' : 'bg-gray-300'}`}
                      aria-label={`Proje ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <p className="text-primary font-medium">
              {featuredProject.category}
            </p>
          </div>
          
          <p className="text-muted-foreground text-lg">
            {featuredProject.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to={`/projects/${featuredProject.slug}`} className="flex items-center">
                İncele
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button variant="outline" asChild size="lg">
              <Link to="/projects" className="flex items-center">
                Tüm Projeleri Gör
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-6 aspect-video order-1 md:order-2">
          <Link to={`/projects/${featuredProject.slug}`}>
            <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg">
              <img 
                src={featuredProject.cover_image || "/placeholder.svg"} 
                alt={featuredProject.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                <p className="text-sm md:text-base">Öne Çıkan Proje</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
