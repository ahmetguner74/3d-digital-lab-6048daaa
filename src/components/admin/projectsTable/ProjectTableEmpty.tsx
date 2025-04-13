
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface ProjectTableEmptyProps {
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;
  setSearchTerm: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
}

export const ProjectTableEmpty = ({
  searchTerm,
  categoryFilter,
  statusFilter,
  setSearchTerm,
  setCategoryFilter,
  setStatusFilter
}: ProjectTableEmptyProps) => {
  const hasActiveFilters = searchTerm || categoryFilter !== "all" || statusFilter !== "all";
  
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-6">
        {hasActiveFilters ? (
          <div className="flex flex-col items-center">
            <Search className="h-6 w-6 text-muted-foreground mb-2" />
            <p>Aramanıza uygun proje bulunamadı.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setStatusFilter("all");
              }}
            >
              Filtreleri Temizle
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="mb-2">Henüz proje bulunmuyor.</p>
            <Button asChild>
              <Link to="/admin/projects/new">
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                İlk Projeyi Ekle
              </Link>
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};
