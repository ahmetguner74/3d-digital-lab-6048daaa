
interface ThreeViewerAdvantagesProps {
  className?: string;
}

export default function ThreeViewerAdvantages({ className = "" }: ThreeViewerAdvantagesProps) {
  return (
    <div className={`${className} space-y-6`}>
      <div>
        <h2 className="text-2xl font-bold mb-4">Teknoloji Avantajlarımız</h2>
        <ul className="space-y-4">
          <li className="flex">
            <span className="text-primary mr-2">✓</span>
            <span>Yüksek çözünürlüklü 3D modellerin optimize edilmesi</span>
          </li>
          <li className="flex">
            <span className="text-primary mr-2">✓</span>
            <span>Büyük nokta bulutu verilerinin hızlı yüklenmesi ve görüntülenmesi</span>
          </li>
          <li className="flex">
            <span className="text-primary mr-2">✓</span>
            <span>Mobil cihazlara uyumlu performans optimizasyonları</span>
          </li>
          <li className="flex">
            <span className="text-primary mr-2">✓</span>
            <span>Açık kaynak kütüphanelerinin profesyonel entegrasyonu</span>
          </li>
          <li className="flex">
            <span className="text-primary mr-2">✓</span>
            <span>Özel ölçüm ve analiz araçları geliştirme imkanı</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
