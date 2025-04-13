
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface ProjectStatusBadgeProps {
  status: string;
}

export const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
  switch (status) {
    case "Yayında":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-700">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    case "Taslak":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700">
          <Clock className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    case "Arşiv":
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700">
          <XCircle className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    default:
      return <span>{status}</span>;
  }
};
