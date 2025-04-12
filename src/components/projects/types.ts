
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  cover_image: string;
  featured: boolean;
  content?: string;
  haspointcloud?: boolean;
  pointcloudpath?: string;
}
