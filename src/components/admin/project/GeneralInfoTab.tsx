
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GeneralInfoTabProps {
  project: any;
  setProject: (project: any) => void;
}

export default function GeneralInfoTab({ project, setProject }: GeneralInfoTabProps) {
  const [tagInput, setTagInput] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject((prev: any) => ({ ...prev, [name]: value }));
    
    if (name === "title" && (!project.slug || project.slug === "")) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-ğüşıöçĞÜŞİÖÇ]/g, "")
        .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
        .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
        .replace(/Ğ/g, "G").replace(/Ü/g, "U").replace(/Ş/g, "S")
        .replace(/İ/g, "I").replace(/Ö/g, "O").replace(/Ç/g, "C")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-");
      setProject((prev: any) => ({ ...prev, slug }));
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !project.tags.includes(tagInput.trim())) {
      setProject((prev: any) => ({ 
        ...prev, 
        tags: [...prev.tags, tagInput.trim()] 
      }));
      setTagInput("");
    }
  };
  
  const handleTagRemove = (tagToRemove: string) => {
    setProject((prev: any) => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove)
    }));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Genel Bilgiler</CardTitle>
        <CardDescription>
          Projenin temel bilgilerini buradan düzenleyebilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Proje Başlığı <span className="text-destructive">*</span></Label>
          <Input
            id="title"
            name="title"
            value={project.title}
            onChange={handleChange}
            placeholder="Proje başlığını girin"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">SEO URL</Label>
          <Input
            id="slug"
            name="slug"
            value={project.slug}
            onChange={handleChange}
            placeholder="proje-url-adresi"
          />
          <p className="text-xs text-muted-foreground">
            Boş bırakırsanız, başlıktan otomatik oluşturulacaktır.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Kısa Açıklama <span className="text-destructive">*</span></Label>
          <Textarea
            id="description"
            name="description"
            value={project.description}
            onChange={handleChange}
            placeholder="Proje hakkında kısa bir açıklama yazın"
            rows={3}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Kategori <span className="text-destructive">*</span></Label>
            <Select
              value={project.category}
              onValueChange={(value) => setProject((prev: any) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mimari">Mimari</SelectItem>
                <SelectItem value="Arkeoloji">Arkeoloji</SelectItem>
                <SelectItem value="Restorasyon">Restorasyon</SelectItem>
                <SelectItem value="Müze">Müze</SelectItem>
                <SelectItem value="Koruma">Koruma</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Durum</Label>
            <Select
              value={project.status}
              onValueChange={(value) => setProject((prev: any) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Taslak">Taslak</SelectItem>
                <SelectItem value="Yayında">Yayında</SelectItem>
                <SelectItem value="Arşiv">Arşiv</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Etiketler</Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Etiket ekleyin"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleTagAdd();
                }
              }}
            />
            <Button type="button" onClick={handleTagAdd}>Ekle</Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {project.tags.map((tag: string, index: number) => (
              <div
                key={index}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1"
              >
                <span>{tag}</span>
                <button
                  onClick={() => handleTagRemove(tag)}
                  className="hover:bg-primary/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
