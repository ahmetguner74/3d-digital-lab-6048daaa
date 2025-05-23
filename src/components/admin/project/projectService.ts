
import { supabase } from "@/integrations/supabase/client";
import { ProjectFormData } from "@/components/projects/types";

interface SaveProjectParams {
  project: ProjectFormData;
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
  
  // Yeni proje oluşturma kontrolü
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
  } 
  // Mevcut proje güncelleme kontrolü
  else if (projectId) {
    console.log("Mevcut proje güncelleniyor, ID:", projectId);
    const { error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', projectId);
    
    if (error) {
      console.error("Proje güncelleme hatası:", error);
      throw error;
    }
  }
  // Artık bu kontrol işlemi yapmayacağız, çünkü bu durum yeni proje eklerken sorun yaratıyor
  // else if (!isNew) {
  //   throw new Error("Proje ID'si bulunamadı ve yeni proje değil");
  // }

  // Silinmiş görselleri veritabanından kaldır
  if (projectId && deletedImageIds.length > 0) {
    console.log("Silinecek görseller:", deletedImageIds);
    const { error: deleteError } = await supabase
      .from('project_images')
      .delete()
      .in('id', deletedImageIds);
      
    if (deleteError) {
      console.error("Görseller silinirken hata:", deleteError);
      throw deleteError;
    }
  }

  // Proje ID'si alındıktan sonra diğer işlemleri yap
  if (projectId) {
    try {
      // Önce-sonra görselleri için
      await saveBeforeAfterImages(projectId, previewImages);

      // Ek görseller için
      if (project.additionalImages && project.additionalImages.length > 0) {
        await saveAdditionalImages(projectId, project.additionalImages);
      }
    } catch (error) {
      console.error("Görseller kaydedilirken hata:", error);
      // Görseller için hata olsa bile proje kaydedildi, bu nedenle projeyi döndür
    }
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
    
    const { error } = await supabase
      .from('project_images')
      .insert(imagesToInsert);
      
    if (error) {
      console.error("Ek görseller kaydedilirken hata:", error);
      throw error;
    }
  }
}

function getImageUrlFromPreview(type: string, previewImages: {[key: string]: string}): string | null {
  if (previewImages[type]) {
    return previewImages[type];
  }
  return null;
}
