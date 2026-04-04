export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  image_url: string;
  images: string[];
  benefits: string[];
  process_steps: string[];
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  description: string;
  location: string;
  highlights: string[];
  images: string[];
  is_featured: boolean;
  is_active: boolean;
  completed_date: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  client_name: string;
  company: string | null;
  rating: number;
  review_text: string;
  location: string | null;
  image_url: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service_id: string | null;
  project_details: string | null;
  budget_range: string | null;
  timeline: string | null;
  is_read: boolean;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface AdminProfile {
  id: string;
  full_name: string;
  role: 'super_admin' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
