
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ContentTabProps {
  project: any;
  setProject: (project: any) => void;
}

export default function ContentTab({ project, setProject }: ContentTabProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject((prev: any) => ({ ...prev, [name]: value }));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proje İçeriği</CardTitle>
        <CardDescription>
          Proje hakkında detaylı bilgileri buradan düzenleyebilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="content">Detaylı Açıklama</Label>
          <Textarea
            id="content"
            name="content"
            value={project.content}
            onChange={handleChange}
            placeholder="Proje hakkında detaylı açıklama yazın"
            rows={10}
          />
        </div>
      </CardContent>
    </Card>
  );
}
