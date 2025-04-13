
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
          .order('updated_at', { ascending: false })
          .limit(3);
          
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

  return { loading, featuredProjects, currentIndex, setCurrentIndex, renderDotIndicators };
}
