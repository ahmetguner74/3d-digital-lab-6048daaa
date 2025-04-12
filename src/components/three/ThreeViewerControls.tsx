
interface ThreeViewerControlsProps {
  className?: string;
}

export default function ThreeViewerControls({ className = "" }: ThreeViewerControlsProps) {
  return (
    <div className={`${className} text-sm space-y-2 p-3 bg-black/50 text-white rounded-md`}>
      <h3 className="font-semibold">Kontroller:</h3>
      <ul className="space-y-1 list-disc list-inside">
        <li>Fareyi sürükleyerek modelleri döndürün</li>
        <li>Fare tekerleğini kullanarak yakınlaştırın/uzaklaştırın</li>
      </ul>
    </div>
  );
}
