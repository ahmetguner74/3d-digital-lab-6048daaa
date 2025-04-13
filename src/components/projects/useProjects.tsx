
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "./types";
import { FilterOption } from "./ProjectFilters";

interface UseProjectsProps {
  projectsPerPage?: number;
  featuredOnly?: boolean;
}

export function useProjects({ projectsPerPage = 9, featuredOnly = false }: UseProjectsProps = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Toplam sayfa sayısını hesapla
  const totalPages = Math.max(1, Math.ceil(totalCount / projectsPerPage));

  // Sayfa değiştirme işlevi
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Sayfayı yukarı kaydır
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Kategori değiştirme işlevi
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Filtre değiştiğinde ilk sayfaya dön
  };

  // Filtreleri sıfırlama işlevi
  const resetFilters = () => {
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  // Projeler ve kategorileri yükle
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        console.log("Projeler yükleniyor...", { currentPage, selectedCategory, featuredOnly, projectsPerPage });
        
        // Sorgu parametrelerini hazırla
        let query = supabase
          .from('projects')
          .select('*', { count: 'exact' })
          .eq('status', 'Yayında');
          
        // Kategori filtresini ekle
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }
        
        // Featured filtresini ekle
        if (featuredOnly) {
          query = query.eq('featured', true);
        }
        
        // Sıralama ekle
        query = query.order('created_at', { ascending: false });
        
        // Sayfalama ekle
        const from = (currentPage - 1) * projectsPerPage;
        const to = from + projectsPerPage - 1;
        query = query.range(from, to);
        
        // Sorguyu çalıştır
        const { data, error, count } = await query;
        
        if (error) {
          console.error("Projeler yüklenirken hata:", error);
          throw error;
        }
        
        console.log("Projeler yüklendi:", { data, count });
        
        setProjects(data || []);
        setTotalCount(count || 0);
        
        // Kategorileri getir (eğer daha önce yüklenmediyse)
        if (categories.length === 0) {
          const { data: categoryData, error: categoryError } = await supabase
            .from('projects')
            .select('category')
            .eq('status', 'Yayında')
            .order('category');
            
          if (categoryError) {
            console.error("Kategoriler yüklenirken hata:", categoryError);
            throw categoryError;
          }
          
          // Benzersiz kategorileri al
          const uniqueCategories = Array.from(
            new Set((categoryData || []).map(item => item.category))
          ).map(category => ({
            value: category,
            label: category
          }));
          
          console.log("Benzersiz kategoriler:", uniqueCategories);
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error('Projeler yüklenirken hata:', err);
        setError('Projeler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    
    // Realtime değişiklikleri dinle
    const channel = supabase
      .channel('projects-list-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'projects',
          filter: 'status=eq.Yayında' 
        }, 
        payload => {
          console.log('Projelerde değişiklik algılandı:', payload);
          // Değişiklik olduğunda projeleri yeniden yükle
          fetchProjects();
        })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentPage, selectedCategory, featuredOnly, projectsPerPage]);

  return {
    projects,
    loading,
    error,
    currentPage,
    totalPages,
    handlePageChange,
    categories,
    selectedCategory,
    handleCategoryChange,
    resetFilters
  };
}
