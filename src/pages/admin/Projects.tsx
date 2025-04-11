
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

// Örnek proje verisi - İlerleyen adımda Supabase'den çekilecek
const initialProjects = [
  {
    id: 1,
    title: "Sivil Mimari Örneği",
    category: "Mimari",
    status: "Yayında",
    featured: true,
    lastUpdated: "2024-04-05"
  },
  {
    id: 2,
    title: "Arkeolojik Eserler",
    category: "Arkeoloji",
    status: "Yayında",
    featured: false,
    lastUpdated: "2024-04-02"
  },
  {
    id: 3,
    title: "Tarihi Yapılar",
    category: "Restorasyon",
    status: "Yayında",
    featured: true,
    lastUpdated: "2024-03-28"
  },
  {
    id: 4,
    title: "Modern Mimari",
    category: "Mimari",
    status: "Taslak",
    featured: false,
    lastUpdated: "2024-03-25"
  },
  {
    id: 5,
    title: "Müze Sergileri",
    category: "Müze",
    status: "Yayında",
    featured: false,
    lastUpdated: "2024-03-20"
  },
  {
    id: 6,
    title: "Kültürel Miras",
    category: "Koruma",
    status: "Taslak",
    featured: false,
    lastUpdated: "2024-03-15"
  }
];

export default function AdminProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialProjects);
  const [sortConfig, setSortConfig] = useState({
    key: "lastUpdated",
    direction: "desc"
  });

  // Filtreleme ve sıralama mantığı
  useEffect(() => {
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

  // Supabase'den projeleri çekme (ileride implement edilecek)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          // Verileri uygun biçime dönüştürür
          // setProjects(data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    // fetchProjects();
    // Şu an için örnek veri kullanıyoruz
  }, []);

  // Benzersiz kategori listesini elde et
  const uniqueCategories = Array.from(new Set(projects.map(project => project.category)));

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
