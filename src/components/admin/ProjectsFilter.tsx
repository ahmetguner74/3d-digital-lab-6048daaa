
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectsFilterProps {
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;
  uniqueCategories: string[];
  setSearchTerm: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
}

export const ProjectsFilter = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  uniqueCategories,
}: ProjectsFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Proje ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              {categoryFilter === "all" ? "Kategori" : categoryFilter}
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            {uniqueCategories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              {statusFilter === "all" ? "Durum" : statusFilter}
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="Taslak">Taslak</SelectItem>
            <SelectItem value="Yayında">Yayında</SelectItem>
            <SelectItem value="Arşiv">Arşiv</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button asChild className="whitespace-nowrap">
        <Link to="/admin/projects/new" className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Yeni Proje
        </Link>
      </Button>
    </div>
  );
};
