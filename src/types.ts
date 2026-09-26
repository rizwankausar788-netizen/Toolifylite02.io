export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Free Trial';

export type CategoryType =
  | 'All'
  | 'Text & Writing'
  | 'Code & Developer'
  | 'Image & Art'
  | 'Video Creation'
  | 'Audio & Voice'
  | 'Productivity'
  | 'Marketing & SEO'
  | '3D & Gaming'
  | 'Research & Data';

export interface AITool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: CategoryType;
  secondaryCategories?: string[];
  pricing: PricingType;
  pricingDetails: string;
  monthlyVisits: string; // e.g. "28.4M"
  monthlyVisitsNum: number; // for sorting
  rating: number; // e.g. 4.9
  reviewCount: number;
  url: string;
  logoBg: string;
  logoLetter: string;
  logoIconName?: string;
  featured?: boolean;
  sponsored?: boolean;
  verified?: boolean;
  dailyRank: number;
  features: string[];
  launchYear: number;
}

export interface FilterState {
  searchQuery: string;
  category: CategoryType;
  pricing: PricingType | 'All';
  sortBy: 'traffic' | 'rating' | 'newest' | 'name';
  verifiedOnly: boolean;
  viewMode: 'grid' | 'list';
}
