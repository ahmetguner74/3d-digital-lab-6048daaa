
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit, MoreVertical, Trash2, Eye, Copy, 
  CheckCircle2, XCircle, Clock, Search,
} from "lucide-react";

export interface Project {
  id: number;
  title: string;
  category: string;
  status: string;
  featured: boolean;
  lastUpdated: string;
}

interface ProjectsTableProps {
  projects: Project[];
  filteredProjects: Project[];
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;
  setSearchTerm: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setSortConfig: (config: { key: string; direction: string }) => void;
  sortConfig: { key: string; direction: string };
}

export const ProjectsTable = ({
  filteredProjects,
  searchTerm,
  categoryFilter,
  statusFilter,
  setSearchTerm,
  setCategoryFilter,
  setStatusFilter,
  setSortConfig,
  sortConfig
}: ProjectsTableProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  // Sıralama fonksiyonu
  const requestSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = (id: number) => {
    // Gerçekte Supabase'den silecek
    setProjects(prev => prev.filter(project => project.id !== id));
    toast({
      title: "Proje silindi",
      description: "Proje başarıyla silindi.",
    });
  };

  const handleDuplicate = (id: number) => {
    const projectToDuplicate = projects.find(project => project.id === id);
    if (projectToDuplicate) {
      const duplicatedProject = {
        ...projectToDuplicate,
        id: Math.max(...projects.map(p => p.id)) + 1,
        title: `${projectToDuplicate.title} (Kopya)`,
        status: "Taslak",
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      setProjects(prev => [...prev, duplicatedProject]);
      toast({
        title: "Proje kopyalandı",
        description: "Proje kopyası oluşturuldu ve taslak olarak kaydedildi.",
      });
    }
  };

  const toggleFeatured = (id: number) => {
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, featured: !project.featured } 
        : project
    ));
    
    const project = projects.find(p => p.id === id);
    toast({
      title: project?.featured 
        ? "Öne çıkarma kaldırıldı" 
        : "Öne çıkarmaya eklendi",
      description: project?.featured 
        ? "Proje artık öne çıkan projeler arasında gösterilmeyecek." 
        : "Proje öne çıkan projeler arasına eklendi.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Yayında":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-700">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      case "Taslak":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      case "Arşiv":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700">
            <XCircle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>
              <button 
                className="font-medium flex items-center"
                onClick={() => requestSort("title")}
              >
                Başlık
                {sortConfig.key === "title" && (
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
                )}
              </button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <button 
                className="font-medium flex items-center"
                onClick={() => requestSort("category")}
              >
                Kategori
                {sortConfig.key === "category" && (
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
                )}
              </button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <button 
                className="font-medium flex items-center"
                onClick={() => requestSort("status")}
              >
                Durum
                {sortConfig.key === "status" && (
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
                )}
              </button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <button 
                className="font-medium flex items-center"
                onClick={() => requestSort("lastUpdated")}
              >
                Son Güncelleme
                {sortConfig.key === "lastUpdated" && (
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
                )}
              </button>
            </TableHead>
            <TableHead className="w-[100px]">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <TableRow key={project.id} className={project.featured ? "bg-primary/5" : ""}>
                <TableCell className="font-medium">{project.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {project.title}
                    {project.featured && (
                      <Badge variant="secondary" className="text-xs">Öne Çıkan</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{project.category}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {getStatusBadge(project.status)}
                </TableCell>
                <TableCell className="hidden md:table-cell">{project.lastUpdated}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">İşlemler</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/projects/${project.id}`} target="_blank" className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Görüntüle</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/projects/${project.id}`} className="flex items-center">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Düzenle</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(project.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Kopyala</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleFeatured(project.id)}>
                        {project.featured ? (
                          <>
                            <XCircle className="mr-2 h-4 w-4" />
                            <span>Öne çıkarmayı kaldır</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            <span>Öne çıkar</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Sil</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                {searchTerm || categoryFilter !== "all" || statusFilter !== "all" ? (
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
          )}
        </TableBody>
      </Table>
    </div>
  );
};
