
import { Link } from "react-router-dom";
import { Eye, ExternalLink, MoreHorizontal } from "lucide-react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  title: string;
  category: string;
  status: string;
  lastUpdated: string;
  featured: boolean;
  slug: string;
}

interface RecentProjectsProps {
  projects: Project[];
  isLoading?: boolean;
}

export default function RecentProjects({ projects, isLoading = false }: RecentProjectsProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="p-4 bg-muted/30">
          <div className="h-5 w-48 bg-muted rounded animate-pulse"></div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Proje</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Son Güncelleme</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="animate-pulse">
                  <div className="h-5 w-32 bg-muted rounded"></div>
                </TableCell>
                <TableCell className="animate-pulse">
                  <div className="h-5 w-20 bg-muted rounded"></div>
                </TableCell>
                <TableCell className="animate-pulse">
                  <div className="h-5 w-24 bg-muted rounded"></div>
                </TableCell>
                <TableCell className="animate-pulse">
                  <div className="h-6 w-16 bg-muted rounded"></div>
                </TableCell>
                <TableCell className="text-right animate-pulse">
                  <div className="h-8 w-8 bg-muted rounded ml-auto"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Son Projeler</h3>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/projects">Tümünü Gör</Link>
          </Button>
        </div>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Henüz proje bulunmuyor.</p>
          <Button asChild className="mt-4">
            <Link to="/admin/projects/new">Yeni Proje Ekle</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="p-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Son Projeler</h3>
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin/projects">Tümünü Gör</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Proje</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Son Güncelleme</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.slice(0, 5).map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  {project.title}
                  {project.featured && (
                    <Badge variant="default" className="ml-2 bg-amber-500 hover:bg-amber-600">Öne Çıkan</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{project.category}</TableCell>
              <TableCell>{project.lastUpdated}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`${
                    project.status === "Yayında"
                      ? "border-green-500 text-green-500 bg-green-50 dark:bg-green-950/20"
                      : project.status === "Taslak"
                      ? "border-amber-500 text-amber-500 bg-amber-50 dark:bg-amber-950/20"
                      : "border-slate-500 text-slate-500 bg-slate-50 dark:bg-slate-950/20"
                  }`}
                >
                  {project.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Eylemler</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/projects/${project.id}/edit`} className="cursor-pointer">
                        Düzenle
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/projects/${project.slug}`} target="_blank" className="cursor-pointer flex items-center">
                        Görüntüle <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
