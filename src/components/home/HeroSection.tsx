
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#212121] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
              Mimari
            </h1>
            
            <div className="pt-6">
              <h2 className="text-3xl font-bold mb-6">Mimari objeler</h2>
              <p className="text-lg text-gray-300 max-w-lg">
                Mimari ve arkeolojik araştırmaların yürütülmesinde mimari eserlerin taranması zorunlu bir aşamadır.
                Bu alanda sürekli çalışarak, hızlı ve kaliteli sonuçlara ulaşmanızı sağlayacak en iyi çözümleri
                geliştirdik.
              </p>
            </div>
            
            <Button asChild size="lg" className="bg-[#8cd3a4] hover:bg-[#7bc393] text-black font-medium mt-8">
              <Link to="/demo">
                Demoyu görüntüle
              </Link>
            </Button>
          </div>
          
          <div className="relative w-full">
            <div className="aspect-[4/3] w-full">
              <img 
                src="/lovable-uploads/bf99b9c1-46c7-43d4-9b86-6fa9a25a8382.png" 
                alt="3D Tarama Örneği - Tarihi Kilise" 
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            
            <div className="absolute right-0 bottom-0 transform translate-y-1/2 -translate-x-1/4 rotate-90 text-xs text-gray-400">
              <p className="whitespace-nowrap">Bakire Meryem'in Göğe Kabul Kilisesi Subbino</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 max-w-3xl">
          <p className="text-xl text-gray-300">
            Lazer tarama, binaların inşasında ve restorasyonunda, fotogrametri ise müze sergilerinin
            dijitalleştirilmesinde kullanılır; teknolojileri birleştirerek uygulama kapsamını
            genişletiyoruz
          </p>
        </div>
      </div>
    </section>
  );
}
