
export interface Project {
  id: string;
  title: string;
  category: string;
  status: string;
  featured: boolean;
  lastUpdated: string;
  slug?: string;
}

export interface SortConfig {
  key: string;
  direction: string;
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
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
  loading: boolean;
  onRefresh: () => void;
}
