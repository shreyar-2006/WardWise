import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SAMPLE_REPORTS } from '../data/samples';
import type { Category, Report, ReportStatus } from '../types';
import { isReportList, makeReportId, STORAGE_KEY } from '../utils/reports';

interface ReportsContextValue {
  reports: Report[];
  persistenceWarning: string | null;
  addReport: (fields: { title: string; category: Category; location: string; description: string }) => Report;
  updateStatus: (id: string, status: ReportStatus) => void;
  restoreSamples: () => void;
  clearReports: () => void;
}

const ReportsContext = createContext<ReportsContextValue | null>(null);

function loadReports(): { reports: Report[]; warning: string | null } {
  let stored: string | null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    return { reports: SAMPLE_REPORTS, warning: 'Browser storage is unavailable. Changes may not survive a refresh.' };
  }

  if (stored !== null) {
    try {
      const parsed: unknown = JSON.parse(stored);
      if (isReportList(parsed)) return { reports: parsed, warning: null };
    } catch {
      // Show the sample dataset and explain that the saved data needs repair.
    }
    return { reports: SAMPLE_REPORTS, warning: 'Saved report data was invalid. Sample reports are shown; restore them to save a fresh copy.' };
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_REPORTS));
    return { reports: SAMPLE_REPORTS, warning: null };
  } catch {
    return { reports: SAMPLE_REPORTS, warning: 'Browser storage is unavailable. Changes may not survive a refresh.' };
  }
}

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(loadReports);
  const [reports, setReports] = useState(initial.reports);
  const [persistenceWarning, setPersistenceWarning] = useState(initial.warning);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || event.newValue === null) return;
      try {
        const parsed: unknown = JSON.parse(event.newValue);
        if (isReportList(parsed)) setReports(parsed);
      } catch {
        setPersistenceWarning('A change from another browser tab could not be read.');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const save = useCallback((next: Report[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setReports(next);
      setPersistenceWarning(null);
    } catch {
      setPersistenceWarning('Could not save to this browser. Check available storage and try again.');
      throw new Error('The report could not be saved in this browser.');
    }
  }, []);

  const addReport = useCallback((fields: { title: string; category: Category; location: string; description: string }) => {
    const timestamp = new Date().toISOString();
    const report: Report = {
      ...fields,
      id: makeReportId(reports),
      status: 'Pending',
      createdAt: timestamp,
      updatedAt: timestamp,
      history: [{ id: `${timestamp}-submitted`, type: 'submitted', timestamp, status: 'Pending' }],
    };
    save([report, ...reports]);
    return report;
  }, [reports, save]);

  const updateStatus = useCallback((id: string, status: ReportStatus) => {
    const current = reports.find((report) => report.id === id);
    if (!current || current.status === status) return;
    const timestamp = new Date().toISOString();
    save(reports.map((report) => report.id !== id ? report : {
      ...report,
      status,
      updatedAt: timestamp,
      history: [...report.history, {
        id: `${timestamp}-${Math.random().toString(16).slice(2)}`,
        type: 'status',
        timestamp,
        previousStatus: report.status,
        status,
      }],
    }));
  }, [reports, save]);

  const restoreSamples = useCallback(() => save(SAMPLE_REPORTS), [save]);
  const clearReports = useCallback(() => save([]), [save]);
  const value = useMemo(() => ({ reports, persistenceWarning, addReport, updateStatus, restoreSamples, clearReports }), [reports, persistenceWarning, addReport, updateStatus, restoreSamples, clearReports]);

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReports(): ReportsContextValue {
  const context = useContext(ReportsContext);
  if (!context) throw new Error('useReports must be used inside ReportsProvider.');
  return context;
}
