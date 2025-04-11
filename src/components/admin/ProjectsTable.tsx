
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
import { supabase } from "@/integrations/supabase/client";
import { 
  Edit, MoreVertical, Trash2, Eye, Copy, 
  CheckCircle2, XCircle, Clock, Search, Loader2, RefreshCcw
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface Project {
  id: string; // ID'yi sadece string olarak tanımlayalım (UUID)
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
  loading: boolean;
  onRefresh: () => void;
}

export const ProjectsTable = ({
  projects,
  filteredProjects,
  searchTerm,
  categoryFilter,
  statusFilter,
  setSearchTerm,
  setCategoryFilter,
  setStatusFilter,
  setSortConfig,
  sortConfig,
  loading,
  onRefresh
}: ProjectsTableProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  // Sıralama fonksiyonu
  const requestSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const confirmDelete = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (projectToDelete === null) return;
    
    try {
      setProcessingAction("delete");
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete);
      
      if (error) throw error;
      
      toast({
        title: "Proje silindi",
        description: "Proje başarıyla silindi.",
      });
      
      // Projeleri yenile
      onRefresh();
    } catch (error) {
      console.error("Proje silinirken hata:", error);
      toast({
        title: "Hata",
        description: "Proje silinirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      setProcessingAction(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      setProcessingAction(`duplicate-${id}`);
      
      // Önce kopyalanacak projeyi al
      const { data: projectToDuplicate, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (projectToDuplicate) {
        // Yeni slug oluştur
        const newSlug = `${projectToDuplicate.slug}-kopya-${Date.now().toString().slice(-5)}`;
        
        // Kopyalanan projeyi hazırla
        const duplicatedProject = {
          ...projectToDuplicate,
          id: undefined, // Supabase otomatik yeni ID oluşturacak
          title: `${projectToDuplicate.title} (Kopya)`,
          slug: newSlug,
          status: "Taslak",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        delete duplicatedProject.id;
        
        // Yeni projeyi kaydet
        const { error: insertError } = await supabase
          .from('projects')
          .insert(duplicatedProject);
        
        if (insertError) throw insertError;
        
        toast({
          title: "Proje kopyalandı",
          description: "Proje kopyası oluşturuldu ve taslak olarak kaydedildi.",
        });
        
        // Projeleri yenile
        onRefresh();
      }
    } catch (error) {
      console.error("Proje kopyalanırken hata:", error);
      toast({
        title: "Hata",
        description: "Proje kopyalanırken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      setProcessingAction(`feature-${id}`);
      
      const { error } = await supabase
        .from('projects')
        .update({ featured: !currentFeatured })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: currentFeatured 
          ? "Öne çıkarma kaldırıldı" 
          : "Öne çıkarmaya eklendi",
        description: currentFeatured 
          ? "Proje artık öne çıkan projeler arasında gösterilmeyecek." 
          : "Proje öne çıkan projeler arasına eklendi.",
      });
      
      // Projeleri yenile
      onRefresh();
    } catch (error) {
      console.error("Proje öne çıkarma durumu değiştirilirken hata:", error);
      toast({
        title: "Hata",
        description: "Proje öne çıkarma durumu değiştirilirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
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
    <>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="mt-2">Projeler yükleniyor...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <TableRow key={project.id} className={project.featured ? "bg-primary/5" : ""}>
                  <TableCell className="font-medium">{typeof project.id === 'string' && project.id.length > 8 ? project.id.substring(0, 8) + '...' : project.id}</TableCell>
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
                        <DropdownMenuItem 
                          onClick={() => handleDuplicate(project.id)}
                          disabled={processingAction === `duplicate-${project.id}`}
                          className="flex items-center"
                        >
                          {processingAction === `duplicate-${project.id}` ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Copy className="mr-2 h-4 w-4" />
                          )}
                          <span>Kopyala</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => toggleFeatured(project.id, project.featured)}
                          disabled={processingAction === `feature-${project.id}`}
                          className="flex items-center"
                        >
                          {processingAction === `feature-${project.id}` ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : project.featured ? (
                            <XCircle className="mr-2 h-4 w-4" />
                          ) : (
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                          )}
                          <span>
                            {project.featured ? "Öne çıkarmayı kaldır" : "Öne çıkar"}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => confirmDelete(project.id)}
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
      
      {/* Silme onay dialogu */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Projeyi silmek istediğinizden emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz ve proje kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={processingAction === "delete"}
            >
              {processingAction === "delete" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                "Evet, Sil"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
