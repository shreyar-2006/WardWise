import { CATEGORIES, STATUSES, type Report } from '../types';

export const STORAGE_KEY = 'wardwise.reports.v1';

export function isReport(value: unknown): value is Report {
  if (!value || typeof value !== 'object') return false;
  const report = value as Partial<Report>;
  return typeof report.id === 'string'
    && typeof report.title === 'string'
    && CATEGORIES.includes(report.category as (typeof CATEGORIES)[number])
    && typeof report.location === 'string'
    && typeof report.description === 'string'
    && STATUSES.includes(report.status as (typeof STATUSES)[number])
    && typeof report.createdAt === 'string'
    && !Number.isNaN(Date.parse(report.createdAt))
    && typeof report.updatedAt === 'string'
    && !Number.isNaN(Date.parse(report.updatedAt))
    && Array.isArray(report.history)
    && report.history.every((activity) => activity && typeof activity.id === 'string'
      && typeof activity.timestamp === 'string'
      && !Number.isNaN(Date.parse(activity.timestamp))
      && (activity.type === 'submitted' || activity.type === 'status')
      && STATUSES.includes(activity.status as (typeof STATUSES)[number])
      && (activity.previousStatus === undefined || STATUSES.includes(activity.previousStatus)));
}

export function isReportList(value: unknown): value is Report[] {
  return Array.isArray(value) && value.every(isReport);
}

export function getCounts(reports: Report[]) {
  return {
    total: reports.length,
    pending: reports.filter((report) => report.status === 'Pending').length,
    inProgress: reports.filter((report) => report.status === 'In Progress').length,
    resolved: reports.filter((report) => report.status === 'Resolved').length,
  };
}

export function makeReportId(existing: Report[]): string {
  const randomId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase()
    : Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
  const id = `WW-${randomId}`;
  return existing.some((report) => report.id === id) ? makeReportId(existing) : id;
}

export function formatDate(value: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return new Intl.DateTimeFormat('en', options ?? { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}
