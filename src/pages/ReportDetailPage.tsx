import { ArrowLeft, Clock3, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { StatusMark } from '../components/StatusMark';
import { useReports } from '../context/ReportsContext';
import { formatDate } from '../utils/reports';

export function ReportDetailPage() {
  const { id } = useParams();
  const { reports } = useReports();
  const report = reports.find((item) => item.id === id);

  if (!report) {
    return <section className="not-found-page"><Link className="back-link" to="/"><ArrowLeft size={16} aria-hidden="true" />Back to report directory</Link><p className="eyebrow">Report not found</p><h1>This report isn’t in the directory.</h1><p>It may have been cleared or the reference may be incorrect.</p><Link className="button button-primary" to="/">Browse reports</Link></section>;
  }

  return (
    <article className="detail-page">
      <Link className="back-link" to="/"><ArrowLeft size={16} aria-hidden="true" />Back to report directory</Link>
      <div className="detail-overline"><span>{report.category}</span><span aria-hidden="true">/</span><span>{report.id}</span></div>
      <h1>{report.title}</h1>
      <div className="detail-status-row"><StatusMark status={report.status} /><span className="detail-location"><MapPin size={15} aria-hidden="true" />{report.location}</span></div>
      <div className="detail-body-grid">
        <section className="detail-description"><p className="eyebrow">What was reported</p><p>{report.description}</p><div className="detail-dates"><div><span>Submitted</span><strong>{formatDate(report.createdAt, { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div><div><span>Last updated</span><strong>{formatDate(report.updatedAt, { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div></div></section>
        <section className="history-section" aria-labelledby="history-title"><div className="history-heading"><div><p className="eyebrow">A record of progress</p><h2 id="history-title">Activity</h2></div><Clock3 size={18} aria-hidden="true" /></div><ol className="activity-list">{report.history.map((activity) => <li className="activity-item" key={activity.id}><span className={`activity-marker ${activity.type === 'submitted' ? 'marker-submitted' : ''}`} aria-hidden="true" /><div><strong>{activity.type === 'submitted' ? 'Report submitted' : `Status changed to ${activity.status}`}</strong>{activity.previousStatus && <p>{activity.previousStatus} <span aria-hidden="true">→</span> {activity.status}</p>}<time dateTime={activity.timestamp}>{formatDate(activity.timestamp, { day: 'numeric', month: 'short', year: 'numeric' })} · {formatDate(activity.timestamp, { hour: 'numeric', minute: '2-digit' })}</time></div></li>)}</ol></section>
      </div>
      <p className="detail-prototype-note">Status updates are part of this local demonstration and do not represent an official municipal response.</p>
    </article>
  );
}
