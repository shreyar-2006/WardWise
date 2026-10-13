import type { ReportStatus } from '../types';

export function StatusMark({ status }: { status: ReportStatus }) {
  const className = status.toLowerCase().replace(' ', '-');
  return <span className={`status-mark status-${className}`}><span aria-hidden="true" className="status-dot" />{status}</span>;
}
