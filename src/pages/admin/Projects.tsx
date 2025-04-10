
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import AdminLayout from "@/components/admin/AdminLayout";
import { ProjectsFilter } from "@/components/admin/ProjectsFilter";
import { ProjectsTable, Project } from "@/components/admin/ProjectsTable";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState({
    key: "lastUpdated",
    direction: "desc"
  });
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  // Filtreleme ve sıralama mantığı
  useEffect(() => {
    if (!projects.length) return;
    
    let result = [...projects];
    
    // Arama filtresi
    if (searchTerm) {
      result = result.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Kategori filtresi
    if (categoryFilter && categoryFilter !== "all") {
      result = result.filter(project => project.category === categoryFilter);
    }
    
    // Durum filtresi
    if (statusFilter && statusFilter !== "all") {
      result = result.filter(project => project.status === statusFilter);
    }
    
    // Sıralama
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredProjects(result);
  }, [searchTerm, categoryFilter, statusFilter, projects, sortConfig]);

  // Supabase'den projeleri çekme
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Supabase'den gelen veriyi Project tipine dönüştür
        const formattedProjects: Project[] = data.map(item => ({
          id: item.id,
          title: item.title,
          category: item.category,
          status: item.status,
          featured: item.featured || false,
          lastUpdated: new Date(item.updated_at).toISOString().split('T')[0],
          slug: item.slug
        }));
        
        setProjects(formattedProjects);
        
        // Benzersiz kategorileri ayarla
        const categories = Array.from(new Set(formattedProjects.map(project => project.category)));
        setUniqueCategories(categories);
      }
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Hata",
        description: "Projeler yüklenirken bir hata oluştu: " + (error.message || error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    
    // Realtime güncellemeleri dinle
    const channel = supabase
      .channel('public:projects')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'projects' 
        }, 
        () => {
          // Herhangi bir değişiklikte projeleri tekrar çek
          fetchProjects();
        })
      .subscribe();
    
    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AdminLayout title="Projeler">
      <Card className="mb-6">
        <CardContent className="p-6">
          <ProjectsFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            uniqueCategories={uniqueCategories}
          />
        </CardContent>
      </Card>
      
      <ProjectsTable 
        projects={projects}
        filteredProjects={filteredProjects}
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        setSearchTerm={setSearchTerm}
        setCategoryFilter={setCategoryFilter}
        setStatusFilter={setStatusFilter}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        loading={loading}
        onRefresh={fetchProjects}
      />
      
      {filteredProjects.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          Toplam {filteredProjects.length} proje gösteriliyor
          {(searchTerm || categoryFilter !== "all" || statusFilter !== "all") && (
            <Button 
              variant="link" 
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setStatusFilter("all");
              }}
              className="text-sm h-auto p-0 ml-2"
            >
              Filtreleri Temizle
            </Button>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
