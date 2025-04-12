
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  image?: string;
  comment: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Mehmet Yılmaz",
    position: "Restorasyon Bölümü Başkanı",
    company: "Tarihi Eserler Kurumu",
    image: "/testimonials/testimonial-1.jpg",
    comment: "3D Dijital Lab ile çalışmak, projelerimize büyük değer kattı. Tarihi yapıların belgelenmesinde gösterdikleri hassasiyet ve profesyonellik takdire şayan.",
    rating: 5
  },
  {
    id: "2",
    name: "Ayşe Kaya",
    position: "Baş Mimar",
    company: "Modern Mimari Stüdyosu",
    image: "/testimonials/testimonial-2.jpg",
    comment: "Projelerimizin 3D taramasında gösterdikleri titiz çalışma ve hızlı teslimat süresi için teşekkür ederiz. Kesinlikle yeniden çalışmak isteyeceğimiz bir ekip.",
    rating: 5
  },
  {
    id: "3",
    name: "Ali Demir",
    position: "Arkeoloji Departmanı Yöneticisi",
    company: "Ankara Üniversitesi",
    image: "/testimonials/testimonial-3.jpg",
    comment: "Kazı alanlarımızın dijitalleştirilmesi için sunulan çözümler beklentilerimizin ötesindeydi. Akademik çalışmalarımıza büyük katkı sağladı.",
    rating: 4
  },
  {
    id: "4",
    name: "Zeynep Şahin",
    position: "Proje Koordinatörü",
    company: "Kentsel Dönüşüm Ajansı",
    image: "/testimonials/testimonial-4.jpg",
    comment: "Kentsel dönüşüm projemizin tüm aşamalarında yanımızda oldular. Teknik uzmanlıkları ve çözüm odaklı yaklaşımları ile fark yarattılar.",
    rating: 5
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-24 bg-white dark:bg-transparent">
      <div className="section-container">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Müşteri Yorumları</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Müşterilerimizin projelerimiz hakkında ne düşündüğünü öğrenin.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Kontrol butonları */}
          <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-10">
            <button 
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shadow-sm hover:bg-muted transition-colors"
              aria-label="Önceki yorum"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
          
          <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-10">
            <button 
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shadow-sm hover:bg-muted transition-colors"
              aria-label="Sonraki yorum"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          {/* Testimonials slider */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="w-full flex-shrink-0 p-6"
                >
                  <div className="bg-background rounded-xl p-8 shadow-sm border border-border">
                    <div className="flex items-center mb-4">
                      {/* Rating stars */}
                      <div className="flex text-amber-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "h-4 w-4 fill-current", 
                              i < testimonial.rating ? "text-amber-400" : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <blockquote className="text-lg text-muted-foreground italic mb-6">
                      "{testimonial.comment}"
                    </blockquote>
                    
                    <div className="flex items-center">
                      {testimonial.image ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg"; 
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <span className="text-lg font-bold text-primary">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.position}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dot indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                )}
                aria-label={`Yorum ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
