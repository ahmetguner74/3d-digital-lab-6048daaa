
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string | null;
  title: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  content: string;
  featured: boolean;
  tags: string[];
  images: {
    id: number;
    url: string;
    alt: string;
    type: string;
  }[];
  additionalImages: {
    id: number | string;
    url: string;
    alt: string;
    type: string;
  }[];
  cover_image: string;
  haspointcloud: boolean;
  pointcloudpath?: string;
  lastUpdated: string;
}

interface SaveProjectParams {
  project: Project;
  isNew: boolean;
  deletedImageIds: string[];
  previewImages: {[key: string]: string};
}

export async function saveProject({
  project,
  isNew,
  deletedImageIds,
  previewImages
}: SaveProjectParams) {
  console.log("Proje kaydetme işlemi başlatıldı:", { project, isNew });
  
  const projectData = {
    title: project.title,
    slug: project.slug,
    description: project.description,
    category: project.category,
    status: project.status,
    content: project.content,
    featured: project.featured,
    cover_image: project.cover_image,
    haspointcloud: project.haspointcloud,
    pointcloudpath: project.pointcloudpath,
    updated_at: new Date().toISOString()
  };
  
  let projectId = project.id;
  
  if (isNew) {
    console.log("Yeni proje oluşturuluyor...");
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select('id')
      .single();
    
    if (error) {
      console.error("Proje oluşturma hatası:", error);
      throw error;
    }
    
    if (data) {
      projectId = data.id;
      console.log("Yeni proje ID'si:", projectId);
    } else {
      throw new Error("Proje kaydedildi ancak ID alınamadı");
    }
  } else if (projectId) {
    console.log("Mevcut proje güncelleniyor, ID:", projectId);
    const { error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', projectId);
    
    if (error) {
      console.error("Proje güncelleme hatası:", error);
      throw error;
    }
  } else {
    // Hem ID null hem de yeni değilse (bu durumda gerçekleşmemeli)
    throw new Error("Proje ID'si bulunamadı ve yeni proje değil");
  }
  
  // Proje ID'si kontrolü
  if (!projectId) {
    throw new Error("Proje ID'si alınamadı");
  }

  // Silinmiş görselleri veritabanından kaldır
  if (deletedImageIds.length > 0) {
    console.log("Silinecek görseller:", deletedImageIds);
    const { error: deleteError } = await supabase
      .from('project_images')
      .delete()
      .in('id', deletedImageIds);
      
    if (deleteError) {
      console.error("Görseller silinirken hata:", deleteError);
    }
  }

  // Önce-sonra görselleri için
  await saveBeforeAfterImages(projectId, previewImages);

  // Ek görseller için
  if (project.additionalImages && project.additionalImages.length > 0) {
    await saveAdditionalImages(projectId, project.additionalImages);
  }
  
  return projectId;
}

async function saveBeforeAfterImages(projectId: string, previewImages: {[key: string]: string}) {
  console.log("Önce-sonra görselleri kaydediliyor:", { projectId, previewImages });
  
  for (const imageType of ['before', 'after']) {
    const imageUrl = getImageUrlFromPreview(imageType, previewImages);
    if (imageUrl) {
      const { data: existingImages } = await supabase
        .from('project_images')
        .select('id')
        .eq('project_id', projectId)
        .eq('alt_text', imageType);
      
      if (existingImages && existingImages.length > 0) {
        await supabase
          .from('project_images')
          .update({ image_url: imageUrl })
          .eq('id', existingImages[0].id);
      } else {
        await supabase
          .from('project_images')
          .insert({
            project_id: projectId,
            image_url: imageUrl,
            alt_text: imageType,
            sequence_order: imageType === 'before' ? 0 : 1
          });
      }
    }
  }
}

async function saveAdditionalImages(projectId: string, additionalImages: any[]) {
  console.log("Ek görseller kaydediliyor:", { projectId, additionalImagesCount: additionalImages.length });
  
  const { data: existingImages } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', projectId)
    .neq('alt_text', 'before')
    .neq('alt_text', 'after');
  
  const existingIds = existingImages ? existingImages.map(img => img.id) : [];
  
  const newImages = additionalImages.filter(img => 
    typeof img.id === 'number' || !existingIds.includes(img.id as string));
  
  if (newImages.length > 0) {
    const imagesToInsert = newImages.map((img, index) => ({
      project_id: projectId,
      image_url: img.url,
      alt_text: img.alt,
      sequence_order: existingImages ? existingImages.length + index + 2 : index + 2
    }));
    
    await supabase
      .from('project_images')
      .insert(imagesToInsert);
  }
}

function getImageUrlFromPreview(type: string, previewImages: {[key: string]: string}) {
  if (previewImages[type]) {
    return previewImages[type];
  }
  return null;
}
