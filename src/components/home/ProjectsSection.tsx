
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
        const {
          data,
          error
        } = await supabase.from('projects').select('id, title, description, slug, cover_image, category, haspointcloud, pointcloudpath').eq('featured', true).eq('status', 'Yayında').order('updated_at', {
          ascending: false
        }).limit(1);
        if (error) {
          console.error('Öne çıkan proje yüklenirken hata:', error);

          // Test verisi olarak göster
          const testProject = {
            id: '1',
            title: 'Tarihi Köprü Restorasyon Projesi',
            description: '18. yüzyıldan kalma tarihi köprünün 3D tarama ve dijitalleştirme projesi. Lazer tarama ve yüksek çözünürlüklü fotoğraflar kullanılarak köprünün her detayı belgelenmiş ve dijital ortama aktarılmıştır.',
            slug: 'tarihi-kopru',
            cover_image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
            category: 'Tarihi Yapılar',
            haspointcloud: true,
            pointcloudpath: 'https://example.com/pointcloud/project.js'
          };
          setFeaturedProject(testProject);
          setLoading(false);
          return;
        }
        if (data && data.length > 0) {
          console.log("Öne çıkan proje verileri:", data[0]);
          setFeaturedProject(data[0]);
        } else {
          // Eğer öne çıkan proje yoksa test verisi göster
          const testProject = {
            id: '1',
            title: 'Tarihi Köprü Restorasyon Projesi',
            description: '18. yüzyıldan kalma tarihi köprünün 3D tarama ve dijitalleştirme projesi. Lazer tarama ve yüksek çözünürlüklü fotoğraflar kullanılarak köprünün her detayı belgelenmiş ve dijital ortama aktarılmıştır.',
            slug: 'tarihi-kopru',
            cover_image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
            category: 'Tarihi Yapılar',
            haspointcloud: true,
            pointcloudpath: 'https://example.com/pointcloud/project.js'
          };
          setFeaturedProject(testProject);
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
  if (loading) {
    return <section id="projects" className="min-h-screen bg-muted/50 dark:bg-muted/20">
        <div className="section-container min-h-screen flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </section>;
  }
  if (!featuredProject) {
    return null;
  }
  
  // Burada önemli bir hata var, component return ifadesi içermiyor
  // Bu yüzden öne çıkan projeler görünmüyor. Aşağıda doğru return ifadesi eklendi:
  return (
    <section id="projects" className="min-h-screen bg-muted/50 dark:bg-muted/20">
      <div className="section-container min-h-screen grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-6 space-y-6 order-2 md:order-1">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">
              {featuredProject.title}
            </h2>
            <p className="text-primary font-medium">
              {featuredProject.category}
            </p>
          </div>
          
          <p className="text-muted-foreground text-lg">
            {featuredProject.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
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
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <img 
                src={featuredProject.cover_image || "/placeholder.svg"} 
                alt={featuredProject.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
