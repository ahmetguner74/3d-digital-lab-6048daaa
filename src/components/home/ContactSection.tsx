
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Mesajı Supabase'e kaydet
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          read: false
        });
      
      if (error) {
        throw new Error(error.message || 'Bir hata oluştu');
      }
      
      toast({
        title: "Mesajınız gönderildi",
        description: "En kısa sürede size dönüş yapacağız.",
      });
      
      // Formu sıfırla
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      console.error('Form gönderim hatası:', error);
      toast({
        title: "Hata",
        description: error.message || "Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-background">
      <div className="section-container">
        <h2 className="section-title reveal">İletişim</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          <div className="space-y-8 reveal">
            <p className="text-lg text-muted-foreground">
              Projeleriniz, iş teklifleriniz veya herhangi bir soru için benimle iletişime geçebilirsiniz. En kısa sürede dönüş yapacağım.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <a
                    href="mailto:ahmetguner74@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    ahmetguner74@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Telefon</h3>
                  <a
                    href="tel:+901234567890"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    +90 123 456 7890
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Konum</h3>
                  <p className="text-muted-foreground">İstanbul, Türkiye</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Sosyal Medya</h3>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-card rounded-full border border-border hover:bg-muted transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-card rounded-full border border-border hover:bg-muted transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-card rounded-full border border-border hover:bg-muted transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-card/50 p-6 sm:p-8 rounded-lg border border-border reveal">
            <h3 className="text-xl font-semibold mb-6">Mesaj Gönder</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  İsim
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Adınız Soyadınız"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Konu
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Mesajınızın konusu"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Mesaj
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Mesajınızı buraya yazın..."
                  className="min-h-[120px]"
                />
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? "Gönderiliyor..." : "Gönder"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
