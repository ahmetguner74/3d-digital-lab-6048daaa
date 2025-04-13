
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  LayoutDashboard, 
  FileText, 
  Settings as SettingsIcon, 
  MessageSquare, 
  LogOut, 
  ChevronLeft 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Gösterge Paneli",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      title: "Projeler",
      icon: FileText,
      href: "/admin/projects",
    },
    {
      title: "Mesajlar",
      icon: MessageSquare,
      href: "/admin/messages",
    },
    {
      title: "Ayarlar",
      icon: SettingsIcon,
      href: "/admin/settings",
    },
  ];
  
  const handleLogout = () => {
    // Burada çıkış işlemi yapılabilir, şimdilik sadece ana sayfaya yönlendiriyoruz
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Helmet>
        <title>{title} | Admin Panel</title>
      </Helmet>
      
      <header className="bg-background border-b sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" />
              <span>Siteye Dön</span>
            </Link>
            <div className="hidden md:block h-6 w-px bg-border"></div>
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Çıkış Yap</span>
          </button>
        </div>
      </header>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="bg-background border-r hidden md:block p-4 space-y-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        
        {/* Mobile menu */}
        <div className="md:hidden flex overflow-x-auto border-b bg-background sticky top-16 z-20">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex-shrink-0 flex flex-col items-center px-4 py-2 text-xs transition-colors border-b-2",
                location.pathname === item.href
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              {item.title}
            </Link>
          ))}
        </div>
        
        {/* Main content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
