import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Report } from '../types';
import { formatDate } from '../utils/reports';
import { StatusMark } from './StatusMark';

export function ReportRow({ report }: { report: Report }) {
  return (
    <Link className="report-row" to={`/reports/${encodeURIComponent(report.id)}`} aria-label={`View ${report.title}`}>
      <span className="report-main">
        <span className="report-title">{report.title}</span>
        <span className="report-meta"><span>{report.category}</span><span className="meta-divider" aria-hidden="true">·</span><span>{report.location}</span></span>
      </span>
      <span className="report-date">{formatDate(report.createdAt, { day: 'numeric', month: 'short' })}</span>
      <StatusMark status={report.status} />
      <ArrowUpRight className="row-arrow" size={17} aria-hidden="true" />
    </Link>
  );
}
