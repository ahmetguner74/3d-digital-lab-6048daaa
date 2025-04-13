
interface PointCloudInfoProps {
  pointCloudPath: string;
}

export default function PointCloudInfo({ pointCloudPath }: PointCloudInfoProps) {
  const fileName = pointCloudPath.split('/').pop() || '';
  
  return (
    <>
      <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 p-1 rounded">
        Potree v1.8 | Nokta bulutu: {fileName}
      </div>
      
      <div className="absolute top-2 right-2 text-xs text-white bg-black/50 p-1 rounded">
        <a 
          href="https://potree.org/potree/converter.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-300 hover:underline"
        >
          LAS dosyanızı Potree formatına dönüştürmek için tıklayın
        </a>
      </div>
    </>
  );
}
