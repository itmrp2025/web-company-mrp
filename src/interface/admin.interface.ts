export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

// --- Team ---
export interface TeamMember {
  id: string;
  slug: string;
  role_type: string;
  order_index: number;
  photo_url: string;
  email: string;
  linkedin_url: string;
  instagram_url: string;
  is_visible: boolean;
  content: {
    name_id: string;
    name_en: string;
    title_id: string;
    title_en: string;
    bio_id: string;
    bio_en: string;
    specializations: string[];
    languages: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface TeamMemberPayload {
  slug: string;
  role_type: string;
  order_index: number;
  photo_url: string;
  linkedin_url: string;
  instagram_url: string;
  is_visible: boolean;
  content: TeamMember["content"];
}

// --- Service ---
export interface Service {
  id: string;
  slug: string;
  icon: string;
  cover_image_url: string;
  order_index: number;
  is_featured: boolean;
  is_active: boolean;
  content: {
    name_id: string;
    name_en: string;
    description_id: string;
    description_en: string;
    short_desc_id: string;
    short_desc_en: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ServicePayload {
  slug: string;
  icon: string;
  cover_image_url: string;
  order_index: number;
  is_featured: boolean;
  is_active: boolean;
  content: Service["content"];
}

// --- Article ---
export interface ArticleCategory {
  id: string;
  slug: string;
  content: {
    id: { name: string; description?: string };
    en: { name: string; description?: string };
  };
}

export interface Article {
  id: string;
  slug: string;
  category_id: string;
  category?: ArticleCategory;
  author_id: string;
  featured_image: string;
  status: "draft" | "published";
  published_at: string | null;
  is_featured: boolean;
  views_count: number;
  content: {
    title_id: string;
    title_en: string;
    excerpt_id: string;
    excerpt_en: string;
    body_id: string;
    body_en: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ArticlePayload {
  slug: string;
  category_id: string;
  featured_image: string;
  status: "draft" | "published";
  is_featured: boolean;
  content: Article["content"];
}

// --- Review ---
export interface Review {
  id: string;
  client_name: string;
  client_company: string;
  client_photo: string;
  rating: number;
  review_text: string;
  review_text_en: string;
  service_type: string;
  status: "pending" | "approved";
  reviewed_at: string | null;
  created_at: string;
}

// --- Analytics ---
export interface AnalyticsOverview {
  total_pageviews: number;
  unique_visitors: number;
  total_form_submissions: number;
  top_pages: { path: string; views: number }[];
}

export interface FormSubmission {
  id: string;
  form_type: string;
  data: Record<string, unknown>;
  source_page: string;
  created_at: string;
}

// --- Career ---
export interface JobListing {
  id: string;
  slug: string;
  department: string;
  location: string;
  employment_type: string;
  deadline: string;
  status: "open" | "closed";
  content: {
    title_id: string;
    title_en: string;
    description_id: string;
    description_en: string;
    requirements_id: string;
    requirements_en: string;
  };
  created_at: string;
  updated_at: string;
}

export interface JobListingPayload {
  slug: string;
  department: string;
  location: string;
  employment_type: string;
  deadline: string;
  status: "open" | "closed";
  content: JobListing["content"];
}

export interface JobApplication {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  cv_url: string;
  portfolio_url: string;
  cover_letter: string;
  status: string;
  notes: string;
  created_at: string;
}

// --- CMS Page Sections ---
export interface PageSection {
  id: string;
  page_id: string;
  section_key: string;
  content: Record<string, unknown>;
  order_index: number;
  is_visible: boolean;
  version: number;
  updated_at: string;
}

// --- Settings ---
export interface SiteSetting {
  key: string;
  value: unknown;
  type: string;
}

export interface NavigationItem {
  key: string;
  href: string;
  label_id: string;
  label_en: string;
  order: number;
  is_visible: boolean;
}
