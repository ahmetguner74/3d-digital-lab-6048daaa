
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Edit, 
  MoreVertical, 
  Trash2, 
  Eye, 
  Plus,
  Search,
  Copy,
  ArrowDownUp,
  CheckCircle2,
  XCircle,
  Clock,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Örnek proje verisi - İlerleyen adımda Supabase'den çekilecek
const initialProjects = [
  {
    id: 1,
    title: "Sivil Mimari Örneği",
    category: "Mimari",
    status: "Yayında",
    featured: true,
    lastUpdated: "2024-04-05"
  },
  {
    id: 2,
    title: "Arkeolojik Eserler",
    category: "Arkeoloji",
    status: "Yayında",
    featured: false,
    lastUpdated: "2024-04-02"
  },
  {
    id: 3,
    title: "Tarihi Yapılar",
    category: "Restorasyon",
    status: "Yayında",
    featured: true,
    lastUpdated: "2024-03-28"
  },
  {
    id: 4,
    title: "Modern Mimari",
    category: "Mimari",
    status: "Taslak",
    featured: false,
    lastUpdated: "2024-03-25"
  },
  {
    id: 5,
    title: "Müze Sergileri",
    category: "Müze",
    status: "Yayında",
    featured: false,
    lastUpdated: "2024-03-20"
  },
  {
    id: 6,
    title: "Kültürel Miras",
    category: "Koruma",
    status: "Taslak",
    featured: false,
    lastUpdated: "2024-03-15"
  }
];

export default function AdminProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [projects, setProjects] = useState(initialProjects);
  const [filteredProjects, setFilteredProjects] = useState(initialProjects);
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState({
    key: "lastUpdated",
    direction: "desc"
  });

  // Filtreleme ve sıralama mantığı
  useEffect(() => {
    let result = [...projects];
    
    // Arama filtresi
    if (searchTerm) {
      result = result.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Kategori filtresi
    if (categoryFilter) {
      result = result.filter(project => project.category === categoryFilter);
    }
    
    // Durum filtresi
    if (statusFilter) {
      result = result.filter(project => project.status === statusFilter);
    }
    
    // Sıralama
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredProjects(result);
  }, [searchTerm, categoryFilter, statusFilter, projects, sortConfig]);

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
    setProjects(projects.filter(project => project.id !== id));
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
      
      setProjects([...projects, duplicatedProject]);
      toast({
        title: "Proje kopyalandı",
        description: "Proje kopyası oluşturuldu ve taslak olarak kaydedildi.",
      });
    }
  };

  const toggleFeatured = (id: number) => {
    setProjects(projects.map(project => 
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

  // Benzersiz kategori listesini elde et
  const uniqueCategories = Array.from(new Set(projects.map(project => project.category)));

  return (
    <AdminLayout title="Projeler">
      <Card className="mb-6">
        <CardContent className="p-6">
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
                    {categoryFilter || "Kategori"}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tümü</SelectItem>
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
                    {statusFilter || "Durum"}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tümü</SelectItem>
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
        </CardContent>
      </Card>
      
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
                    <ArrowDownUp className={`ml-1 h-3 w-3 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`} />
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
                    <ArrowDownUp className={`ml-1 h-3 w-3 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`} />
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
                    <ArrowDownUp className={`ml-1 h-3 w-3 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`} />
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
                    <ArrowDownUp className={`ml-1 h-3 w-3 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`} />
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
                  {searchTerm || categoryFilter || statusFilter ? (
                    <div className="flex flex-col items-center">
                      <Search className="h-6 w-6 text-muted-foreground mb-2" />
                      <p>Aramanıza uygun proje bulunamadı.</p>
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setSearchTerm("");
                          setCategoryFilter("");
                          setStatusFilter("");
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
                          <Plus className="mr-2 h-4 w-4" />
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
      
      {filteredProjects.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          Toplam {filteredProjects.length} proje gösteriliyor
          {(searchTerm || categoryFilter || statusFilter) && (
            <Button 
              variant="link" 
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
                setStatusFilter("");
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
