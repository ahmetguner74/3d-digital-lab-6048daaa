
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { 
  LayoutDashboard,
  Image,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const menuItems = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", href: "/admin/dashboard" },
  { icon: <Image className="h-5 w-5" />, label: "Projeler", href: "/admin/projects" },
  { icon: <MessageSquare className="h-5 w-5" />, label: "Mesajlar", href: "/admin/messages" },
  { icon: <Settings className="h-5 w-5" />, label: "Ayarlar", href: "/admin/settings" }
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const isAdmin = localStorage.getItem("adminAuthenticated");
    if (!isAdmin) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Helmet>
        <title>{title} | Yönetim Paneli</title>
      </Helmet>
      
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
          <Link to="/admin/dashboard" className="ml-4 font-bold text-lg">
            Yönetim Paneli
          </Link>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:hidden",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-lg ml-2">3D Dijital Lab</span>
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-border">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış Yap
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 bg-card border-r border-border z-30 transition-all hidden lg:block",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className={cn(
          "flex items-center justify-between p-4 border-b border-border",
          sidebarOpen ? "px-4" : "px-2"
        )}>
          {sidebarOpen ? (
            <Link to="/" className="flex items-center">
              <span className="font-bold text-lg ml-2">3D Dijital Lab</span>
            </Link>
          ) : (
            <div className="w-full flex justify-center">
              <Link to="/">
                <span className="font-bold text-xl">3D</span>
              </Link>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-2"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                !sidebarOpen && "rotate-180"
              )}
            />
          </Button>
        </div>
        
        <div className="p-4">
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-center py-3 rounded-md hover:bg-accent transition-all",
                  sidebarOpen ? "px-3" : "px-2 justify-center"
                )}
              >
                <span>{item.icon}</span>
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-4 border-t border-border",
          sidebarOpen ? "px-4" : "px-2"
        )}>
          <Button
            variant="outline"
            onClick={handleLogout}
            className={cn(
              sidebarOpen ? "w-full flex items-center justify-between" : "w-full p-2 h-auto"
            )}
          >
            {sidebarOpen ? (
              <>
                <div className="flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıkış Yap
                </div>
                <ChevronRight className="h-4 w-4" />
              </>
            ) : (
              <LogOut className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen pt-16 lg:pt-0",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        )}
      >
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
          
          {children}
        </div>
      </main>
    </div>
  );
}
