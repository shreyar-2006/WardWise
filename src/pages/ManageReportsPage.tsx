import { ArrowUpRight, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { StatusMark } from '../components/StatusMark';
import { useReports } from '../context/ReportsContext';
import { STATUSES, type ReportStatus } from '../types';
import { formatDate } from '../utils/reports';

export function ManageReportsPage() {
  const { reports, updateStatus, restoreSamples, clearReports } = useReports();
  const [feedback, setFeedback] = useState('');
  const [confirmation, setConfirmation] = useState<'restore' | 'clear' | null>(null);

  function changeStatus(id: string, nextStatus: ReportStatus) {
    try {
      updateStatus(id, nextStatus);
      setFeedback('Report status and activity history updated.');
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Status could not be saved.');
    }
  }

  function restore() {
    try { restoreSamples(); setFeedback('Original sample reports restored.'); }
    catch (error) { setFeedback(error instanceof Error ? error.message : 'Sample reports could not be restored.'); }
  }

  function clear() {
    try { clearReports(); setFeedback('All reports were cleared from this browser.'); }
    catch (error) { setFeedback(error instanceof Error ? error.message : 'Reports could not be cleared.'); }
  }

  return (
    <section className="manage-page">
      <div className="page-heading-row"><div><p className="eyebrow">Local prototype controls</p><h1>Manage community reports</h1><p>Review the current directory and update report progress. This page is not access-protected.</p></div><Link className="button button-primary" to="/reports/new">Report an issue <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      <div className="manage-notice"><span className="notice-mark" aria-hidden="true">i</span><p>Changes are saved only in this browser. Status updates here do not notify reporters or public authorities.</p></div>
      <div className="manage-toolbar"><span>{reports.length} {reports.length === 1 ? 'report' : 'reports'} in this browser</span><div><button className="subtle-action" type="button" onClick={() => setConfirmation('restore')}><RotateCcw size={15} aria-hidden="true" />Restore sample reports</button><button className="subtle-action danger-action" type="button" onClick={() => setConfirmation('clear')}><Trash2 size={15} aria-hidden="true" />Clear all reports</button></div></div>
      {feedback && <p className="manage-feedback" role="status">{feedback}</p>}
      {reports.length === 0 ? <div className="empty-state manage-empty"><span className="empty-index">Nothing here</span><h2>No reports in this browser.</h2><p>The directory is empty and will stay empty until a new report is added or the fictional samples are restored.</p><div className="empty-actions"><Link className="button button-primary" to="/reports/new">Create a report</Link><button className="button button-secondary" type="button" onClick={() => setConfirmation('restore')}>Restore sample reports</button></div></div> : (
        <div className="manage-table-wrap"><table className="manage-table"><thead><tr><th scope="col">Report</th><th scope="col">Location</th><th scope="col">Filed</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Details</span></th></tr></thead><tbody>{[...reports].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((report) => <tr key={report.id}><td data-label="Report"><Link className="manage-report-title" to={`/reports/${encodeURIComponent(report.id)}`}>{report.title}<span>{report.id} <span aria-hidden="true">·</span> {report.category}</span></Link></td><td data-label="Location" className="table-location">{report.location}</td><td data-label="Filed" className="table-date">{formatDate(report.createdAt)}</td><td data-label="Status"><label className="status-control"><span className="sr-only">Change status for {report.title}</span><select value={report.status} onChange={(event) => changeStatus(report.id, event.target.value as ReportStatus)}>{STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select><StatusMark status={report.status} /></label></td><td data-label="Details"><Link className="detail-arrow" to={`/reports/${encodeURIComponent(report.id)}`} aria-label={`View details for ${report.title}`}><ArrowUpRight size={17} /></Link></td></tr>)}</tbody></table></div>
      )}
      <p className="manage-footnote">Restoring sample reports replaces the current directory with the original fictional demonstration set.</p>
      <ConfirmDialog open={confirmation === 'restore'} onOpenChange={(open) => !open && setConfirmation(null)} title="Restore sample reports?" description="This replaces every report currently stored in this browser with the original fictional demonstration set." confirmLabel="Restore samples" onConfirm={() => { restore(); setConfirmation(null); }} />
      <ConfirmDialog open={confirmation === 'clear'} onOpenChange={(open) => !open && setConfirmation(null)} title="Clear all reports?" description="Every report in this browser will be removed. The empty directory will remain empty until a new report is submitted or the samples are restored." confirmLabel="Clear all reports" destructive onConfirm={() => { clear(); setConfirmation(null); }} />
    </section>
  );
}
