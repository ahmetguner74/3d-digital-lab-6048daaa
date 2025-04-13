
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortConfig } from "./types";

interface ProjectTableHeaderProps {
  sortConfig: SortConfig;
  requestSort: (key: string) => void;
}

export const ProjectTableHeader = ({ sortConfig, requestSort }: ProjectTableHeaderProps) => {
  const SortArrow = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig.key === columnKey) {
      return (
        <svg 
          className={`ml-1 h-3 w-3 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M7 15l5 5 5-5"></path>
          <path d="M7 9l5-5 5 5"></path>
        </svg>
      );
    }
    return null;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">ID</TableHead>
        <TableHead>
          <button 
            className="font-medium flex items-center"
            onClick={() => requestSort("title")}
          >
            Başlık
            <SortArrow columnKey="title" />
          </button>
        </TableHead>
        <TableHead className="hidden md:table-cell">
          <button 
            className="font-medium flex items-center"
            onClick={() => requestSort("category")}
          >
            Kategori
            <SortArrow columnKey="category" />
          </button>
        </TableHead>
        <TableHead className="hidden md:table-cell">
          <button 
            className="font-medium flex items-center"
            onClick={() => requestSort("status")}
          >
            Durum
            <SortArrow columnKey="status" />
          </button>
        </TableHead>
        <TableHead className="hidden md:table-cell">
          <button 
            className="font-medium flex items-center"
            onClick={() => requestSort("lastUpdated")}
          >
            Son Güncelleme
            <SortArrow columnKey="lastUpdated" />
          </button>
        </TableHead>
        <TableHead className="w-[100px]">İşlemler</TableHead>
      </TableRow>
    </TableHeader>
  );
};
