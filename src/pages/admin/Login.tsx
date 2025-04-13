
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Supabase ile giriş yap
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        toast({
          title: "Giriş Hatası",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (data.user) {
        // Süper admin kontrolü
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'superadmin')
          .single();

        if (roleError || !roleData) {
          setError("Bu kullanıcı için yönetici izni bulunmuyor.");
          toast({
            title: "Yetkisiz Giriş",
            description: "Bu kullanıcı için yönetici izni bulunmuyor.",
            variant: "destructive"
          });
          
          // Yetkisiz kullanıcıyı oturumdan çıkar
          await supabase.auth.signOut();
          return;
        }

        // Başarılı giriş
        toast({
          title: "Giriş Başarılı",
          description: "Yönetim paneline yönlendiriliyorsunuz.",
        });

        navigate("/admin/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Giriş sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 dark:bg-muted/20">
      <Helmet>
        <title>Yönetici Girişi | 3D Mimari Dijitalleştirme Atölyesi</title>
      </Helmet>
      
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Yönetici Girişi</h1>
          <p className="text-muted-foreground mt-2">
            Yönetim paneline erişmek için giriş yapın
          </p>
        </div>
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ahmetguner74@gmail.com"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="········"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
