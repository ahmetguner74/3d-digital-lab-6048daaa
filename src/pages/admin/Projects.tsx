
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminLayout from "@/components/admin/AdminLayout";
import { ProjectsFilter } from "@/components/admin/ProjectsFilter";
import { ProjectsTable, Project } from "@/components/admin/ProjectsTable";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";

export default function AdminProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState({
    key: "lastUpdated",
    direction: "desc"
  });
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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
      setError(null);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('featured', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        setError(`Projeler yüklenirken bir hata oluştu: ${error.message}`);
        return;
      }

      if (data) {
        // Supabase'den gelen veriyi Project tipine dönüştür
        const formattedProjects: Project[] = data.map(item => ({
          id: item.id,
          title: item.title,
          category: item.category,
          status: item.status,
          featured: item.featured || false,
          lastUpdated: new Date(item.updated_at || Date.now()).toISOString().split('T')[0],
          slug: item.slug
        }));
        
        setProjects(formattedProjects);
        console.log("Admin paneli - projeler yüklendi:", formattedProjects.length);
        
        // Benzersiz kategorileri ayarla
        const categories = Array.from(new Set(formattedProjects.map(project => project.category)));
        setUniqueCategories(categories);
      }
    } catch (err: any) {
      console.error('Projeler yüklenirken beklenmeyen hata:', err);
      setError(`Projeler yüklenirken bir hata oluştu: ${err.message || err}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProjects();
    toast({
      description: "Projeler yenileniyor...",
    });
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
        (payload) => {
          console.log('Projelerde değişiklik algılandı:', payload);
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
      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="ml-auto"
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Yenileniyor...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Yeniden Dene
              </>
            )}
          </Button>
        </Alert>
      ) : (
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
      )}
      
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
