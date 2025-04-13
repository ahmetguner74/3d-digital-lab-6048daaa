
import { Link } from "react-router-dom";
import { Loader2, RefreshCcw } from "lucide-react";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ProjectTableProps } from "./types";
import { ProjectTableHeader } from "./ProjectTableHeader";
import { ProjectTableRow } from "./ProjectTableRow";
import { ProjectTableEmpty } from "./ProjectTableEmpty";
import { ProjectTableLoading } from "./ProjectTableLoading";

export const ProjectsTable = ({
  projects,
  filteredProjects,
  searchTerm,
  categoryFilter,
  statusFilter,
  setSearchTerm,
  setCategoryFilter,
  setStatusFilter,
  sortConfig,
  setSortConfig,
  loading,
  onRefresh
}: ProjectTableProps) => {
  // Sıralama fonksiyonu
  const requestSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-medium">Projeler</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Yenile
          </Button>
          <Button asChild size="sm" className="flex items-center gap-2">
            <Link to="/admin/projects/new">
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Yeni Proje
            </Link>
          </Button>
        </div>
      </div>
      
      <Table>
        <ProjectTableHeader
          sortConfig={sortConfig}
          requestSort={requestSort}
        />
        <TableBody>
          {loading ? (
            <ProjectTableLoading />
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectTableRow 
                key={project.id} 
                project={project} 
                onRefresh={onRefresh}
              />
            ))
          ) : (
            <ProjectTableEmpty
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
              statusFilter={statusFilter}
              setSearchTerm={setSearchTerm}
              setCategoryFilter={setCategoryFilter}
              setStatusFilter={setStatusFilter}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};
