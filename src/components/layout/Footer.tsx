import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-muted/50 dark:bg-muted/20">
      <div className="section-container py-[199px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gradient">Portfolyo</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Modern ve minimalist kişisel portfolyo sitesi. Profesyonel deneyimler, projeler ve iletişim bilgileri.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Anasayfa
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Hakkımızda</Link>
              </li>
              <li>
                <Link to="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Projeler
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold">İletişim</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href="mailto:email@example.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  email@example.com
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 mt-4">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Portfolyo. Tüm hakları saklıdır.
          </p>
          <div className="mt-4 sm:mt-0">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors mr-4">
              Gizlilik Politikası
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>;
}