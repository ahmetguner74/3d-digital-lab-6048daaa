
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  className?: string;
}

export default function FeaturedProjectsLoading({ className = "" }: LoadingStateProps) {
  return (
    <div className={`${className} flex justify-center items-center h-64`}>
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
