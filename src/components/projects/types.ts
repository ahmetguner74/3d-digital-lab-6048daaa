
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  content?: string;
  cover_image: string;
  featured: boolean;
  haspointcloud?: boolean;
  pointcloudpath?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string | null;
  sequence_order: number | null;
  created_at?: string;
}

export interface ProjectFormData extends Omit<Project, 'id'> {
  id: string | null;
  images: {
    id: number | string;
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
  lastUpdated: string;
  tags: string[];
}
