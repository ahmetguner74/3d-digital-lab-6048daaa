
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortConfig } from "./types";
import { ArrowDown, ArrowUp } from "lucide-react";

interface ProjectTableHeaderProps {
  sortConfig: SortConfig;
  requestSort: (key: string) => void;
}

export const ProjectTableHeader = ({ sortConfig, requestSort }: ProjectTableHeaderProps) => {
  const getSortDirection = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="w-[100px]"
          onClick={() => requestSort("id")}
        >
          <div className="flex items-center cursor-pointer">
            ID {getSortDirection("id")}
          </div>
        </TableHead>
        <TableHead 
          className="min-w-[150px]"
          onClick={() => requestSort("title")}
        >
          <div className="flex items-center cursor-pointer">
            Başlık {getSortDirection("title")}
          </div>
        </TableHead>
        <TableHead 
          className="hidden md:table-cell"
          onClick={() => requestSort("category")}
        >
          <div className="flex items-center cursor-pointer">
            Kategori {getSortDirection("category")}
          </div>
        </TableHead>
        <TableHead 
          className="hidden md:table-cell"
          onClick={() => requestSort("status")}
        >
          <div className="flex items-center cursor-pointer">
            Durum {getSortDirection("status")}
          </div>
        </TableHead>
        <TableHead 
          className="hidden md:table-cell"
          onClick={() => requestSort("lastUpdated")}
        >
          <div className="flex items-center cursor-pointer">
            Son Güncelleme {getSortDirection("lastUpdated")}
          </div>
        </TableHead>
        <TableHead className="w-[70px]">İşlemler</TableHead>
      </TableRow>
    </TableHeader>
  );
};
