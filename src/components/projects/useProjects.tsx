
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "./types";

interface UseProjectsOptions {
  projectsPerPage?: number;
}

export function useProjects({ projectsPerPage = 9 }: UseProjectsOptions = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // Demo projeleri oluşturan yardımcı fonksiyon
  const getDemoProjects = (): Project[] => {
    return [
      {
        id: "1",
        title: "Tarihi Kent Merkezi Dijitalleştirme",
        slug: "tarihi-kent-merkezi",
        description: "Tarihi kent merkezinin 3D lazer tarama teknolojileri ile belgelenmesi ve dijitalleştirilmesi",
        category: "Mimari",
        cover_image: "/placeholder.svg",
        featured: true
      },
      {
        id: "2",
        title: "Arkeolojik Alan Belgeleme",
        slug: "arkeolojik-alan",
        description: "Kazı alanının yüksek çözünürlüklü 3D modellenmesi ve web ortamında sergilenmesi",
        category: "Arkeoloji",
        cover_image: "/placeholder.svg",
        featured: false
      },
      {
        id: "3",
        title: "Müze Eserleri Dijital Arşivi",
        slug: "muze-eserleri",
        description: "Müzedeki eserlerin fotogrametri yöntemiyle 3D olarak arşivlenmesi",
        category: "Müzecilik",
        cover_image: "/placeholder.svg",
        featured: false
      },
      {
        id: "4",
        title: "Tarihi Yapı Restorasyonu",
        slug: "tarihi-yapi-restorasyonu",
        description: "Tarihi yapının 3D taraması ve restorasyon öncesi-sonrası karşılaştırmalı analizleri",
        category: "Restorasyon",
        cover_image: "/placeholder.svg",
        featured: true
      },
      {
        id: "5",
        title: "Kentsel Dönüşüm Projesi",
        slug: "kentsel-donusum",
        description: "Kentsel dönüşüm alanının dijital ikizinin oluşturulması ve simülasyonu",
        category: "Şehircilik",
        cover_image: "/placeholder.svg",
        featured: false
      },
      {
        id: "6",
        title: "Endüstriyel Miras Belgelemesi",
        slug: "endustriyel-miras",
        description: "Tarihi fabrika yapısının detaylı 3D modellemesi ve sanal tur uygulaması",
        category: "Endüstriyel Miras",
        cover_image: "/placeholder.svg",
        featured: false
      }
    ];
  };

  // Projeleri yükleme fonksiyonu
  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Supabase'den sadece yayında olan projeleri çek
      const { data, error, count } = await supabase
        .from('projects')
        .select('id, title, slug, description, category, cover_image, featured', { count: 'exact' })
        .eq('status', 'Yayında')
        .order('updated_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      console.log("Çekilen projeler:", data);
      
      if (data && data.length > 0) {
        setProjects(data);
        
        // Toplam sayfa sayısını hesapla
        if (count) {
          setTotalPages(Math.ceil(count / projectsPerPage));
        }
      } else {
        console.log("Proje bulunamadı, demo verileri gösteriliyor");
        // Gerçek veri yoksa demo projeleri göster
        const demoProjects = getDemoProjects();
        setProjects(demoProjects);
        setTotalPages(Math.ceil(demoProjects.length / projectsPerPage));
      }
    } catch (err: any) {
      console.error('Projeler yüklenirken hata oluştu:', err);
      setError('Projeler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      toast({
        title: "Hata",
        description: "Projeler yüklenirken bir hata oluştu: " + (err.message || err),
        variant: "destructive"
      });
      
      // Hata durumunda demo projeleri göster
      const demoProjects = getDemoProjects();
      setProjects(demoProjects);
      setTotalPages(Math.ceil(demoProjects.length / projectsPerPage));
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    
    // Supabase realtime aboneliği oluştur
    const channel = supabase
      .channel('public:projects')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' }, 
        () => {
          fetchProjects(); // Herhangi bir değişiklikte projeleri yeniden yükle
        })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, projectsPerPage]);

  // Geçerli sayfadaki projeleri hesapla
  const getCurrentPageProjects = () => {
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    return projects.slice(startIndex, endIndex);
  };

  // Sayfa değiştirme işlevi
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    projects: getCurrentPageProjects(),
    allProjects: projects,
    loading,
    error,
    currentPage,
    totalPages,
    handlePageChange
  };
}
