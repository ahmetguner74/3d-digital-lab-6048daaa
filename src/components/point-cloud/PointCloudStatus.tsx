
import { Loader2 } from "lucide-react";

interface PointCloudStatusProps {
  loading: boolean;
  error: string | null;
}

export default function PointCloudStatus({ loading, error }: PointCloudStatusProps) {
  if (!loading && !error) return null;

  return (
    <>
      {/* Yükleniyor durumu */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">Nokta bulutu yükleniyor...</p>
          </div>
        </div>
      )}
      
      {/* Hata durumu */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-10">
          <div className="text-center max-w-sm p-4">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-xs text-muted-foreground">
              Tarayıcınız WebGL'i desteklemiyor olabilir veya nokta bulutu dosyası erişilemiyor olabilir.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
