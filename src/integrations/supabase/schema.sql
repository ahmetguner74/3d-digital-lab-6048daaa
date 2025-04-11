
-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'Taslak',
  featured BOOLEAN DEFAULT false,
  content TEXT,
  cover_image VARCHAR,
  hasPointCloud BOOLEAN DEFAULT false,
  pointCloudPath VARCHAR,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create project_images table for storing multiple images per project
CREATE TABLE public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url VARCHAR NOT NULL,
  alt_text VARCHAR,
  sequence_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create admin settings table
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR NOT NULL UNIQUE,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Anyone can read published projects
CREATE POLICY "Anyone can read published projects" ON public.projects
  FOR SELECT USING (status = 'Yayında');

-- Anyone can read project images
CREATE POLICY "Anyone can read project images" ON public.project_images
  FOR SELECT USING (true);

-- Only authenticated users can manage projects and images
CREATE POLICY "Authenticated users can manage projects" ON public.projects
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage project images" ON public.project_images
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage settings" ON public.admin_settings
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Add trigger for automatic updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_set_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
