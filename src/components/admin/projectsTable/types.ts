
export interface Project {
  id: string;
  title: string;
  category: string;
  status: string;
  featured: boolean;
  lastUpdated: string;
  slug: string;
}

export interface ProjectTableProps {
  projects: Project[];
  filteredProjects: Project[];
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;
  setSearchTerm: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  sortConfig: {
    key: string;
    direction: string;
  };
  setSortConfig: (value: { key: string; direction: string }) => void;
  loading: boolean;
  onRefresh: () => void;
}
