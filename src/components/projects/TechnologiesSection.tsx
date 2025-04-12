import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
interface TechnologiesSectionProps {
  className?: string;
}
export default function TechnologiesSection({
  className = ""
}: TechnologiesSectionProps) {
  // Three.js teknolojileriyle ilgili bölüm verileri
  const technologies = [{
    name: "Three.js",
    icon: "/tech/threejs.svg",
    description: "3D modelleri web ortamında görüntülemek için kullanılan JavaScript kütüphanesi"
  }, {
    name: "Potree",
    icon: "/tech/potree.png",
    description: "Büyük nokta bulutu verilerini web tarayıcıda görselleştirmek için kullanılan WebGL tabanlı görüntüleyici"
  }, {
    name: "React",
    icon: "/tech/react.svg",
    description: "Kullanıcı arayüzü oluşturmak için kullanılan JavaScript kütüphanesi"
  }];
  return;
}