
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
  
  if (!json || typeof json !== 'object') {
    return defaultSettings;
  }
  
  // JSON nesnesini doğru şekilde SiteSettings'e dönüştür
  return {
    title: typeof json.title === 'string' ? json.title : defaultSettings.title,
    description: typeof json.description === 'string' ? json.description : defaultSettings.description,
    keywords: typeof json.keywords === 'string' ? json.keywords : defaultSettings.keywords,
    email: typeof json.email === 'string' ? json.email : defaultSettings.email,
    phone: typeof json.phone === 'string' ? json.phone : defaultSettings.phone,
    address: typeof json.address === 'string' ? json.address : defaultSettings.address,
    facebook: typeof json.facebook === 'string' ? json.facebook : defaultSettings.facebook,
    twitter: typeof json.twitter === 'string' ? json.twitter : defaultSettings.twitter,
    instagram: typeof json.instagram === 'string' ? json.instagram : defaultSettings.instagram,
    linkedin: typeof json.linkedin === 'string' ? json.linkedin : defaultSettings.linkedin,
    googleAnalyticsId: typeof json.googleAnalyticsId === 'string' ? json.googleAnalyticsId : defaultSettings.googleAnalyticsId,
    customScript: typeof json.customScript === 'string' ? json.customScript : defaultSettings.customScript
  };
}

// Bu fonksiyon SiteSettings'i JSON'a dönüştürür
export function fromSiteSettings(settings: SiteSettings): Json {
  return settings as unknown as Json;
}
