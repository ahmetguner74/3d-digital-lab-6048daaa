
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "3D dijitalleştirme nedir?",
      answer: "3D dijitalleştirme, fiziksel objelerin ve yapıların üç boyutlu dijital modellerinin oluşturulması sürecidir. Bu işlem lazer tarama, fotogrametri ve diğer gelişmiş teknolojiler kullanılarak gerçekleştirilir."
    },
    {
      question: "Hangi teknolojileri kullanıyorsunuz?",
      answer: "Projelerimizde lazer tarama ve fotogrametri teknolojilerini kullanıyoruz. Lazer tarama, milimetrik hassasiyetle yapıların 3D nokta bulutu verilerini oluşturur. Fotogrametri ise fotoğraflardan 3D modeller oluşturmak için kullanılır."
    },
    {
      question: "3D taramanın avantajları nelerdir?",
      answer: "3D tarama, yapıların ve nesnelerin yüksek doğrulukta belgelenmesini sağlar, restorasyon çalışmalarında rehberlik eder, dijital arşivleme imkanı sunar ve sanal gerçeklik deneyimleri oluşturmak için temel oluşturur."
    },
    {
      question: "Bir projenin tamamlanması ne kadar sürer?",
      answer: "Projelerin tamamlanma süresi, taranacak yapının büyüklüğüne, karmaşıklığına ve istenilen sonuç detayına bağlı olarak değişir. Küçük objeler birkaç gün içinde tamamlanabilirken, büyük mimari yapılar için bu süre birkaç haftaya uzayabilir."
    },
    {
      question: "Tarama sonuçlarını hangi formatlarda alabiliyoruz?",
      answer: "Tarama sonuçlarını istenilen formatta sunabiliyoruz: nokta bulutu verileri (.pts, .xyz, .las), 3D mesh modeller (.obj, .stl, .fbx), CAD dosyaları (.dwg, .dxf) ve BIM modelleri (.rvt)."
    },
    {
      question: "Uzaktan çalışma mümkün mü?",
      answer: "Evet, dünyanın her yerinden projeler için çalışabiliyoruz. Yerel ortaklarımızla iş birliği yaparak uzaktan tarama ve modelleme hizmetleri sunabiliyoruz."
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Sık Sorulan Sorular | 3D Mimari Dijitalleştirme Atölyesi</title>
        <meta
          name="description"
          content="3D mimari dijitalleştirme hizmetlerimiz hakkında sık sorulan sorular ve cevapları."
        />
      </Helmet>

      <section className="section-container py-20">
        <h1 className="text-4xl font-bold mb-6 reveal">Sık Sorulan Sorular</h1>
        
        <div className="max-w-3xl mx-auto mt-12">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 reveal"
              >
                <AccordionTrigger className="text-lg font-medium py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Daha fazla sorunuz mu var? Bize doğrudan ulaşarak daha fazla bilgi alabilirsiniz.
            </p>
            <Button asChild size="lg">
              <Link to="/contact">İletişime Geç</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
