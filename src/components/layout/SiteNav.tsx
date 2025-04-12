
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, Folder, Home, Info, MessageSquare, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const location = useLocation();

  useEffect(() => {
    // Dialog açıldığında projeleri yükle
    if (open) {
      const fetchProjects = async () => {
        const { data } = await supabase
          .from('projects')
          .select('id, title, slug, category')
          .eq('status', 'Yayında')
          .order('title', { ascending: true });
          
        if (data) {
          setProjects(data);
        }
      };
      
      fetchProjects();
    }
  }, [open]);
  
  const mainPages = [
    { icon: Home, name: "Ana Sayfa", href: "/" },
    { icon: Info, name: "Hakkımızda", href: "/about" },
    { icon: Folder, name: "Projeler", href: "/projects" },
    { icon: HelpCircle, name: "SSS", href: "/faq" },
    { icon: MessageSquare, name: "İletişim", href: "/contact" }
  ];
  
  const adminPages = [
    { icon: Home, name: "Admin Dashboard", href: "/admin/dashboard" },
    { icon: Folder, name: "Projeler Yönetimi", href: "/admin/projects" },
    { icon: MessageSquare, name: "Mesaj Yönetimi", href: "/admin/messages" },
    { icon: Search, name: "Site Ayarları", href: "/admin/settings" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          title="Site navigasyonu"
        >
          <Search className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Site Navigasyonu</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Sayfa veya proje ara..." />
          <CommandList>
            <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
            
            <CommandGroup heading="Ana Sayfalar">
              {mainPages.map((page) => {
                const Icon = page.icon;
                const isActive = location.pathname === page.href;
                
                return (
                  <CommandItem
                    key={page.href}
                    onSelect={() => {
                      window.location.href = page.href;
                      setOpen(false);
                    }}
                    className={isActive ? "bg-muted" : ""}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{page.name}</span>
                    {isActive && (
                      <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        Aktif
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            
            <CommandGroup heading="Yönetim">
              {adminPages.map((page) => {
                const Icon = page.icon;
                const isActive = location.pathname === page.href;
                
                return (
                  <CommandItem
                    key={page.href}
                    onSelect={() => {
                      window.location.href = page.href;
                      setOpen(false);
                    }}
                    className={isActive ? "bg-muted" : ""}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{page.name}</span>
                    {isActive && (
                      <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        Aktif
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            
            {projects.length > 0 && (
              <CommandGroup heading="Projeler">
                {projects.map((project) => {
                  const isActive = location.pathname === `/projects/${project.slug}`;
                  
                  return (
                    <CommandItem
                      key={project.id}
                      onSelect={() => {
                        window.location.href = `/projects/${project.slug}`;
                        setOpen(false);
                      }}
                      className={isActive ? "bg-muted" : ""}
                    >
                      <Folder className="mr-2 h-4 w-4" />
                      <span>{project.title}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {project.category}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
