export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string;
  githubUrl: string;
  demoUrl: string;
  imageUrl: string;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  iconClass: string;
  sortOrder: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImageUrl: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl: string;
  visible: boolean;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ServiceMetrics {
  service: string;
  status: string;
  uptime_seconds: number;
  uptime_human: string;
  go_version: string;
  goroutines: number;
  memory: { alloc_mb: number; sys_mb: number; gc_runs: number };
  timestamp: string;
}

export interface GitHubStats {
  profile: {
    name: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    avatar_url: string;
    html_url: string;
  };
  top_repos: {
    name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    html_url: string;
    updated_at: string;
  }[];
  fetched_at: string;
}

export interface RateRequest {
  projectType: string;
  techStack: string;
  timelineWeeks: number;
  includesDevOps: boolean;
  includesDesign: boolean;
}

export interface RateResponse {
  minRate: number;
  maxRate: number;
  currency: string;
  breakdown: string;
  disclaimer: string;
}
