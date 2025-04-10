
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Demo() {
  return (
    <Layout>
      <Helmet>
        <title>Demo | Dijitalleştirme Atölyesi</title>
        <meta name="description" content="3D tarama ve dijitalleştirme hizmetlerimizin demo görüntüsü." />
      </Helmet>
      
      <section className="bg-[#212121] text-white py-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anasayfaya Dön
              </Link>
            </Button>
          </div>
          
          <h1 className="text-4xl font-bold mb-8">Demo Görüntüsü</h1>
          
          <div className="aspect-video rounded-lg overflow-hidden bg-black/50 flex items-center justify-center">
            <p className="text-lg text-gray-400">Demo içeriği burada görüntülenecek</p>
          </div>
          
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div className="bg-black/30 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Tarama Özellikleri</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Yüksek çözünürlüklü 3D tarama</li>
                <li>Mimari detay yakalama</li>
                <li>Renk ve doku bilgisi</li>
                <li>Milimetrik hassasiyet</li>
              </ul>
            </div>
            
            <div className="bg-black/30 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Kullanım Alanları</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Tarihi eser belgeleme</li>
                <li>Restorasyon projeleri</li>
                <li>Dijital müze sergileri</li>
                <li>Arkeolojik araştırmalar</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
