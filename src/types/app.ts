export type AppCategory =
  | 'All'
  | 'Games'
  | 'Productivity'
  | 'Tools'
  | 'Social'
  | 'Entertainment'
  | 'Finance'
  | 'Photography'
  | 'Health & Fitness';

export interface AppReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface AppDemandRequest {
  id: string;
  userName: string;
  email: string;
  contactMethod: 'Email' | 'WhatsApp' | 'Telegram';
  contactHandle: string;
  appTitle: string;
  platform: 'Android' | 'iOS' | 'Cross-Platform' | 'Web App';
  category: AppCategory;
  requirements: string;
  budget?: string;
  timeline?: string;
  status: 'Pending' | 'In Review' | 'Approved' | 'In Development' | 'Rejected';
  submittedAt: string;
  adminNotes?: string;
}

export interface AppModel {
  id: string;
  app_name: string;
  package_name: string; // SlugField, unique
  developer_name: string;
  category: AppCategory;
  app_icon: string;
  banner_image?: string;
  description: string;
  version: string;
  apk_file: string;
  file_size: string;
  downloads_count: number;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
  whats_new?: string;
  screenshots: string[];
  featured?: boolean;
  min_android_version?: string;
  content_rating?: string;
}

export interface DjangoFile {
  name: string;
  path: string;
  language: 'python' | 'html' | 'txt' | 'markdown';
  description: string;
  content: string;
}
