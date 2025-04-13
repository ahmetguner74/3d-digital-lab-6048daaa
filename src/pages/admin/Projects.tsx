
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminLayout from "@/components/admin/AdminLayout";
import { ProjectsFilter } from "@/components/admin/ProjectsFilter";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { useAdminProjects } from "@/hooks/useAdminProjects";
import ProjectsErrorView from "@/components/admin/ProjectsErrorView";

export default function AdminProjects() {
  const {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    projects,
    filteredProjects,
    loading,
    error,
    sortConfig,
    setSortConfig,
    uniqueCategories,
    refreshing,
    handleRefresh,
    fetchProjects
  } = useAdminProjects();

  return (
    <AdminLayout title="Projeler">
      <ProjectsErrorView
        error={error}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      
      {!error && (
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
