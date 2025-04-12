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
  return;
}