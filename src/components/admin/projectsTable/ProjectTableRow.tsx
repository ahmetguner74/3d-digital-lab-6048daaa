
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Project } from "./types";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { ProjectActionsMenu } from "./ProjectActionsMenu";

interface ProjectTableRowProps {
  project: Project;
  onRefresh: () => void;
}

export const ProjectTableRow = ({ project, onRefresh }: ProjectTableRowProps) => {
  const truncatedId = typeof project.id === 'string' && project.id.length > 8 
    ? project.id.substring(0, 8) + '...' 
    : project.id;

  return (
    <TableRow className={project.featured ? "bg-primary/5" : ""}>
      <TableCell className="font-medium">{truncatedId}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {project.title}
          {project.featured && (
            <Badge variant="secondary" className="text-xs">Öne Çıkan</Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">{project.category}</TableCell>
      <TableCell className="hidden md:table-cell">
        <ProjectStatusBadge status={project.status} />
      </TableCell>
      <TableCell className="hidden md:table-cell">{project.lastUpdated}</TableCell>
      <TableCell>
        <ProjectActionsMenu project={project} onRefresh={onRefresh} />
      </TableCell>
    </TableRow>
  );
};
