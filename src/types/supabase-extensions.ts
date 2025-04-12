
import { Json } from "@/integrations/supabase/types";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  title: string;
  description: string;
  keywords: string;
  email: string;
  phone: string;
  address: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  googleAnalyticsId?: string;
  customScript?: string;
}

// Bu fonksiyon JSON'dan SiteSettings'e güvenli bir dönüşüm sağlar
export function toSiteSettings(json: Json | null): SiteSettings {
  // Varsayılan değerler
  const defaultSettings: SiteSettings = {
    title: "3D Dijital Lab",
    description: "3D lazer tarama ve modelleme çözümleri",
    keywords: "3D, lazer tarama, mimari, dijitalleştirme",
    email: "info@example.com",
    phone: "+90123456789",
    address: "İstanbul, Türkiye",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    googleAnalyticsId: "",
    customScript: ""
  };
  
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return defaultSettings;
  }
  
  // JSON nesnesinin türünü kontrol et
  const jsonObj = json as Record<string, unknown>;
  
  // JSON nesnesini doğru şekilde SiteSettings'e dönüştür
  return {
    title: typeof jsonObj.title === 'string' ? jsonObj.title : defaultSettings.title,
    description: typeof jsonObj.description === 'string' ? jsonObj.description : defaultSettings.description,
    keywords: typeof jsonObj.keywords === 'string' ? jsonObj.keywords : defaultSettings.keywords,
    email: typeof jsonObj.email === 'string' ? jsonObj.email : defaultSettings.email,
    phone: typeof jsonObj.phone === 'string' ? jsonObj.phone : defaultSettings.phone,
    address: typeof jsonObj.address === 'string' ? jsonObj.address : defaultSettings.address,
    facebook: typeof jsonObj.facebook === 'string' ? jsonObj.facebook : defaultSettings.facebook,
    twitter: typeof jsonObj.twitter === 'string' ? jsonObj.twitter : defaultSettings.twitter,
    instagram: typeof jsonObj.instagram === 'string' ? jsonObj.instagram : defaultSettings.instagram,
    linkedin: typeof jsonObj.linkedin === 'string' ? jsonObj.linkedin : defaultSettings.linkedin,
    googleAnalyticsId: typeof jsonObj.googleAnalyticsId === 'string' ? jsonObj.googleAnalyticsId : defaultSettings.googleAnalyticsId,
    customScript: typeof jsonObj.customScript === 'string' ? jsonObj.customScript : defaultSettings.customScript
  };
}

// Bu fonksiyon SiteSettings'i JSON'a dönüştürür
export function fromSiteSettings(settings: SiteSettings): Json {
  return settings as unknown as Json;
}
