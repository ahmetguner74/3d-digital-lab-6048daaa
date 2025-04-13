
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FeaturedProject } from "../types/FeaturedProject";

export function useFeaturedProjectsSlider() {
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

  const getCurrentProject = () => {
    return featuredProjects[currentIndex];
  };

  return {
    featuredProjects,
    currentIndex,
    setCurrentIndex,
    loading,
    getCurrentProject
  };
}
