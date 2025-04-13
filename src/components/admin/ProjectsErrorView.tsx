
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";

interface ProjectsErrorViewProps {
  error: string | null;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function ProjectsErrorView({ error, refreshing, onRefresh }: ProjectsErrorViewProps) {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        className="ml-auto"
        disabled={refreshing}
      >
        {refreshing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Yenileniyor...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Yeniden Dene
          </>
        )}
      </Button>
    </Alert>
  );
}
