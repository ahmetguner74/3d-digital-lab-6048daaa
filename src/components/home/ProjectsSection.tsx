
import { useEffect, useState } from "react";
import { Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  slug: string;
  cover_image: string;
}

export default function ProjectsSection() {
  const [featuredProject, setFeaturedProject] = useState<FeaturedProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProject = async () => {
      try {
        setLoading(true);
        
        // Admin panelinden "featured" olarak işaretlenmiş ve yayında olan projeleri çek
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, description, slug, cover_image')
          .eq('featured', true)
          .eq('status', 'Yayında')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();
          
        if (error) {
          console.error('Öne çıkan proje yüklenirken hata:', error);
          setLoading(false);
          return;
        }
        
        if (data) {
          setFeaturedProject(data);
        }
      } catch (err) {
        console.error('Öne çıkan proje yüklenirken beklenmeyen hata:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedProject();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="min-h-screen bg-muted/50 dark:bg-muted/20">
        <div className="section-container min-h-screen flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </section>
    );
  }

  // Öne çıkan proje yoksa varsayılan içerik göster
  if (!featuredProject) {
    return (
      <section id="projects" className="min-h-screen bg-muted/50 dark:bg-muted/20">
        <div className="section-container min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left content */}
            <div className="space-y-6 reveal">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Öne Çıkan Projeler
              </h2>
              <p className="text-lg text-muted-foreground">
                Henüz öne çıkan bir proje yok. Admin panelinden bir projeyi öne çıkarabilirsiniz.
              </p>
              
              <div className="pt-4">
                <Button asChild size="lg" className="group">
                  <Link to="/admin/projects" className="py-0 my-[10px]">
                    Proje Ekle
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Right content - Placeholder */}
            <div className="relative w-full reveal">
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                  <p className="mt-4 text-sm text-muted-foreground">Henüz öne çıkan bir proje yok</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="min-h-screen bg-muted/50 dark:bg-muted/20">
      <div className="section-container min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left content */}
          <div className="space-y-6 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {featuredProject.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {featuredProject.description || 'Binaları geliştirdiğimiz son teknoloji sistemleri ile modelliyoruz. Lazer tarama teknolojisi ve yüksek çözünürlüklü fotogrametri ile yapıların detaylı 3D modellerini oluşturuyor, mimari ve tarihi değerleri dijital ortama aktarıyoruz.'}
            </p>
            
            <div className="pt-4">
              <Button asChild size="lg" className="group">
                <Link to={`/projects/${featuredProject.slug}`} className="py-0 my-[10px]">
                  Projeyi Görüntüle
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Right content - Video area with link to project */}
          <div className="relative w-full reveal">
            <Link to={`/projects/${featuredProject.slug}`} className="block">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted cursor-pointer">
                {/* Cover image or video placeholder */}
                {featuredProject.cover_image ? (
                  <img 
                    src={featuredProject.cover_image} 
                    alt={featuredProject.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                    <Play className="h-16 w-16 text-primary opacity-60" />
                    <p className="mt-4 text-sm text-muted-foreground">Görsel burada gösterilecek</p>
                  </div>
                )}
                
                {/* Overlay for hover effect */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium px-4 py-2 bg-primary/80 rounded-md">
                    Projeyi Görüntüle
                  </span>
                </div>
              </div>
            </Link>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/20 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-secondary/20 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
