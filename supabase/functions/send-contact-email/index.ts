
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactFormData = await req.json();
    const { name, email, subject, message } = data;
    
    // Basit doğrulama yapalım
    if (!name || !email || !message) {
      throw new Error("İsim, e-posta ve mesaj alanları gereklidir.");
    }

    // E-posta gönderme (henüz gerçek e-posta gönderilmiyor)
    console.log("E-posta gönderilecek:", { to: "ahmetguner74@gmail.com", name, email, subject, message });

    // Gerçek bir e-posta gönderimi için burada Resend, SendGrid, SMTP gibi servisler kullanılabilir
    // Örneğin:
    /*
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    await resend.emails.send({
      from: "noreply@yoursite.com",
      to: "ahmetguner74@gmail.com",
      subject: `İletişim Formu: ${subject || "Yeni mesaj"}`,
      html: `
        <h1>Yeni İletişim Formu Mesajı</h1>
        <p><strong>İsim:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Konu:</strong> ${subject || "Belirtilmedi"}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message}</p>
      `,
    });
    */

    return new Response(
      JSON.stringify({ success: true, message: "Mesajınız gönderildi" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("İletişim formu hatası:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
