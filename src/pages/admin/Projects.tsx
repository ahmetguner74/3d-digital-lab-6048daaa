
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Edit, 
  MoreVertical, 
  Trash2, 
  Eye, 
  Plus,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample project data - This will be fetched from Supabase in a later step
const initialProjects = [
  {
    id: 1,
    title: "Sivil Mimari Örneği",
    category: "Mimari",
    status: "Yayında",
    lastUpdated: "2024-04-05"
  },
  {
    id: 2,
    title: "Arkeolojik Eserler",
    category: "Arkeoloji",
    status: "Yayında",
    lastUpdated: "2024-04-02"
  },
  {
    id: 3,
    title: "Tarihi Yapılar",
    category: "Restorasyon",
    status: "Yayında",
    lastUpdated: "2024-03-28"
  },
  {
    id: 4,
    title: "Modern Mimari",
    category: "Mimari",
    status: "Taslak",
    lastUpdated: "2024-03-25"
  },
  {
    id: 5,
    title: "Müze Sergileri",
    category: "Müze",
    status: "Yayında",
    lastUpdated: "2024-03-20"
  },
  {
    id: 6,
    title: "Kültürel Miras",
    category: "Koruma",
    status: "Taslak",
    lastUpdated: "2024-03-15"
  }
];

export default function AdminProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState(initialProjects);
  const [filteredProjects, setFilteredProjects] = useState(initialProjects);
  const { toast } = useToast();

  useEffect(() => {
    const filtered = projects.filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  const handleDelete = (id: number) => {
    // In a real implementation, this would delete from Supabase
    setProjects(projects.filter(project => project.id !== id));
    toast({
      title: "Proje silindi",
      description: "Proje başarıyla silindi.",
    });
  };

  return (
    <AdminLayout title="Projeler">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Proje ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button asChild>
          <Link to="/admin/projects/new" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Proje
          </Link>
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead className="hidden md:table-cell">Kategori</TableHead>
              <TableHead className="hidden md:table-cell">Durum</TableHead>
              <TableHead className="hidden md:table-cell">Son Güncelleme</TableHead>
              <TableHead className="w-[100px]">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.id}</TableCell>
                  <TableCell>{project.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{project.category}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span 
                      className={`inline-block px-2 py-1 rounded-full text-xs
                        ${project.status === "Yayında" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                    >
                      {project.status}
                    </span>
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
                          <Link to={`/projects/${project.id.toString().toLowerCase()}`} className="flex items-center">
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
                  Aramanıza uygun proje bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
