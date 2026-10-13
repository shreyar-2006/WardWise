export const CATEGORIES = [
  'Waste Management',
  'Water Supply & Leakage',
  'Roads & Footpaths',
  'Streetlights',
  'Drainage & Sanitation',
  'Other',
] as const;

export const STATUSES = ['Pending', 'In Progress', 'Resolved'] as const;

export type Category = (typeof CATEGORIES)[number];
export type ReportStatus = (typeof STATUSES)[number];

export interface ReportActivity {
  id: string;
  type: 'submitted' | 'status';
  timestamp: string;
  status: ReportStatus;
  previousStatus?: ReportStatus;
}

export interface Report {
  id: string;
  title: string;
  category: Category;
  location: string;
  description: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  history: ReportActivity[];
}
