import { ArrowRight, RotateCcw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ReportRow } from '../components/ReportRow';
import { useReports } from '../context/ReportsContext';
import { CATEGORIES, STATUSES, type Category, type ReportStatus } from '../types';
import { getCounts } from '../utils/reports';

export function OverviewPage() {
  const { reports } = useReports();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [status, setStatus] = useState<ReportStatus | ''>('');
  const counts = getCounts(reports);
  const filteredReports = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return [...reports]
      .filter((report) => !needle || report.title.toLocaleLowerCase().includes(needle) || report.location.toLocaleLowerCase().includes(needle))
      .filter((report) => !category || report.category === category)
      .filter((report) => !status || report.status === status)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [reports, query, category, status]);
  const hasFilters = Boolean(query || category || status);

  function resetFilters() {
    setQuery('');
    setCategory('');
    setStatus('');
  }

  return (
    <>
      <section className="overview-intro">
        <div>
          <p className="eyebrow">A clearer picture of our neighbourhood</p>
          <h1>Small issues,<br className="desktop-break" /> seen and tracked.</h1>
          <p className="intro-copy">A shared place to note local concerns and follow their progress. Start by exploring recent reports or add one of your own.</p>
        </div>
        <div className="intro-note"><span className="note-rule" /><p>Every report starts a conversation.<br />This prototype keeps it close to home.</p></div>
      </section>

      <section className="summary-strip" aria-label="Report summary">
        <div className="summary-heading"><span>At a glance</span><span>{reports.length === 1 ? '1 report' : `${reports.length} reports`}</span></div>
        <div className="summary-counts">
          <div className="summary-item"><span className="summary-number">{counts.total}</span><span className="summary-label">Total reports</span></div>
          <div className="summary-item"><span className="summary-number">{counts.pending}</span><span className="summary-label"><span className="mini-status pending" />Pending</span></div>
          <div className="summary-item"><span className="summary-number">{counts.inProgress}</span><span className="summary-label"><span className="mini-status in-progress" />In progress</span></div>
          <div className="summary-item"><span className="summary-number">{counts.resolved}</span><span className="summary-label"><span className="mini-status resolved" />Resolved</span></div>
        </div>
      </section>

      <section className="directory-section" aria-labelledby="directory-title">
        <div className="section-heading-row">
          <div><p className="eyebrow">Community directory</p><h2 id="directory-title">Recent reports</h2></div>
          <Link className="text-link desktop-only" to="/admin">Manage reports <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className="filter-bar" role="search">
          <label className="search-field"><Search size={17} aria-hidden="true" /><span className="sr-only">Search by title or location</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title or location" /></label>
          <label className="select-filter"><span className="sr-only">Filter by category</span><select value={category} onChange={(event) => setCategory(event.target.value as Category | '')}><option value="">All categories</option>{CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="select-filter"><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value as ReportStatus | '')}><option value="">All statuses</option>{STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          {hasFilters && <button className="reset-button" onClick={resetFilters} type="button"><RotateCcw size={14} aria-hidden="true" />Reset</button>}
        </div>
        <div className="list-labels" aria-hidden="true"><span>Report / location</span><span>Filed</span><span>Status</span><span /></div>
        {filteredReports.length > 0 ? (
          <div className="report-list" aria-live="polite">{filteredReports.map((report) => <ReportRow key={report.id} report={report} />)}</div>
        ) : (
          <div className="empty-state"><span className="empty-index">{reports.length === 0 ? 'A new page' : 'No matches'}</span><h3>{reports.length === 0 ? 'No community reports yet.' : 'Nothing found for those filters.'}</h3><p>{reports.length === 0 ? 'When someone reports an issue, it will appear here for the community to follow.' : 'Try a different search or clear the filters to see all reports.'}</p>{hasFilters ? <button className="button button-secondary" onClick={resetFilters} type="button">Clear filters</button> : <Link className="button button-primary" to="/reports/new">Report an issue</Link>}</div>
        )}
        <div className="list-footnote"><span>Showing {filteredReports.length} of {reports.length} reports</span><span>Sample reports are fictional demonstration data.</span></div>
      </section>
    </>
  );
}
