
interface ThreeViewerInfoProps {
  className?: string;
}

export default function ThreeViewerInfo({ className = "" }: ThreeViewerInfoProps) {
  return (
    <div className={`${className} space-y-6`}>
      <div>
        <h2 className="text-2xl font-bold mb-4">3D Görselleştirme Çözümlerimiz</h2>
        <ul className="space-y-4">
          <li className="flex">
            <span className="text-primary mr-2">✓</span>
            <span>Lazer tarama verileri ve nokta bulutlarının web ortamında görselleştirilmesi</span>
          </li>
          <li className="flex">
            <span className="text-primary mr-2">✓</span>
            <span>Fotogrametrik modellerin interaktif sunumu</span>
          </li>
          <li className="flex">
            <span className="text-primary mr-2">✓</span>
            <span>Tarihi yapı ve alanların dijital ikizlerinin oluşturulması</span>
          </li>
          <li className="flex">
            <span className="text-primary mr-2">✓</span>
            <span>3D modellerin web tarayıcı üzerinden erişilebilir hale getirilmesi</span>
          </li>
          <li className="flex">
            <span className="text-primary mr-2">✓</span>
            <span>Three.js ve Potree tabanlı özelleştirilmiş görselleştirme çözümleri</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
