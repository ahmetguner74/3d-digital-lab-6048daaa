
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectGrid from "./ProjectGrid";
import ProjectPagination from "./ProjectPagination";
import { useProjects } from "./useProjects";
import ProjectFilters from "./ProjectFilters";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ProjectsListProps {
  className?: string;
  projectsPerPage?: number;
}

export default function ProjectsList({ className = "", projectsPerPage = 9 }: ProjectsListProps) {
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
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
  } = useProjects({ projectsPerPage });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Sayfayı yenilemek için bir süre bekletin
    setTimeout(() => {
      window.location.reload();
      setRefreshing(false);
    }, 500);
    toast({
      description: "Projeler yenileniyor...",
    });
  };

  if (loading) {
    return (
      <div className={`${className} flex flex-col items-center justify-center py-12`}>
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Projeler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive font-medium">{error}</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-2">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Yeniden Dene
          </Button>
        </div>
      )}
      
      <ProjectFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onResetFilters={resetFilters}
      />

      <ProjectGrid projects={projects} className="my-8" />
      
      {totalPages > 1 && (
        <ProjectPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-12"
        />
      )}
      
      {projects.length > 0 && (
        <div className="mt-6 text-sm text-muted-foreground text-center">
          {selectedCategory ? 
            `"${selectedCategory}" kategorisinde ${projects.length} proje gösteriliyor` : 
            `Toplam ${projects.length} proje gösteriliyor`}
        </div>
      )}
    </div>
  );
}
