
import { Loader2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";

export const ProjectTableLoading = () => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-10">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2">Projeler yükleniyor...</p>
        </div>
      </TableCell>
    </TableRow>
  );
};
