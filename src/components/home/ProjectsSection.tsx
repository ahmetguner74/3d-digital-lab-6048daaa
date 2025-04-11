
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
  const [featuredProject, setFeaturedProject] = useState<FeaturedProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProject = async () => {
      try {
        setLoading(true);

        // Admin panelinden "featured" olarak işaretlenmiş ve yayında olan projeleri çek
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, description, slug, cover_image, category, haspointcloud, pointcloudpath')
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
          console.log("Öne çıkan proje verileri:", data);
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

  // Öne çıkan proje yoksa veya yükleme devam ediyorsa bir şey gösterme
  if (loading || !featuredProject) {
    return null;
  }

  return (
    <section id="projects" className="min-h-screen bg-muted/50 dark:bg-muted/20">
      <div className="section-container min-h-screen flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
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
                <Link to={`/projects/${featuredProject.slug}`} className="py-0 my-[10px] flex items-center">
                  Projeyi Görüntüle
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right content - Cover image with link to project */}
          <div className="relative w-full reveal">
            <Link to={`/projects/${featuredProject.slug}`} className="block">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted border border-muted cursor-pointer">
                {/* Cover image or placeholder */}
                {featuredProject.cover_image ? (
                  <img 
                    src={featuredProject.cover_image} 
                    alt={featuredProject.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50">
                    <p className="mt-4 text-sm text-muted-foreground">Fotoğraf buraya eklenecek</p>
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
          </div>
        </div>
      </div>
    </section>
  );
}
