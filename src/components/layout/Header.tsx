
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import ThreeJsButton from "@/components/header/ThreeJsButton"; 
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Anasayfa",
    href: "/"
  }, 
  {
    name: "Hakkımızda",
    href: "/about"
  },
  {
    name: "Hizmetler",
    href: "/services"
  }, 
  {
    name: "Projeler",
    href: "/projects"
  }, 
  {
    name: "SSS",
    href: "/faq"
  }, 
  {
    name: "İletişim",
    href: "/contact"
  }
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/905302252534`, '_blank');
  };
  
  return (
    <header className={cn(
      "fixed w-full top-0 left-0 z-40 transition-all duration-300", 
      scrolled ? "bg-background/80 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center text-xl font-bold transition-colors hover:text-primary">
              <span className="text-gradient">3D Dijital Lab</span>
            </Link>
            <ThreeJsButton />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map(item => (
              <Link 
                key={item.name} 
                to={item.href} 
                className={cn(
                  "text-sm font-medium transition-all hover:text-primary relative",
                  location.pathname === item.href ? "text-primary" : "text-foreground/80",
                  "after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            <Button 
              onClick={handleWhatsAppClick}
              variant="outline" 
              size="sm"
              className="ml-2 flex items-center gap-2 text-primary border-primary hover:bg-primary/10"
            >
              <Phone className="h-4 w-4" />
              <span>WhatsApp</span>
            </Button>
            
            <Link to="/admin/dashboard" title="Yönetim Paneli" className="ml-2">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Button>
            </Link>
            
            <ThemeToggle />
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden gap-2">
            <Button 
              onClick={handleWhatsAppClick}
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 text-primary border-primary hover:bg-primary/10"
            >
              <Phone className="h-4 w-4" />
            </Button>
            
            <Link to="/admin/dashboard" title="Yönetim Paneli">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Button>
            </Link>
            
            <ThemeToggle />
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed top-[56px] right-0 bottom-0 w-full bg-background dark:bg-background/95 backdrop-blur-lg transform md:hidden transition-transform duration-300 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col pt-8 pb-6 px-6 space-y-6">
          <ThreeJsButton />
          {navigation.map(item => (
            <Link 
              key={item.name} 
              to={item.href} 
              className={cn(
                "text-lg font-medium transition-colors py-2",
                location.pathname === item.href ? "text-primary" : "text-foreground/80 hover:text-primary"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
