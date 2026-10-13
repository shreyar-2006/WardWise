import { ArrowLeft, Check, CircleAlert, ClipboardCheck } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useReports } from '../context/ReportsContext';
import { CATEGORIES, type Category } from '../types';

interface Fields {
  title: string;
  category: Category | '';
  location: string;
  description: string;
}

type FieldName = keyof Fields;
type FieldErrors = Partial<Record<FieldName, string>>;

const limits: Record<FieldName, { min: number; max: number }> = {
  title: { min: 5, max: 100 },
  category: { min: 1, max: 1 },
  location: { min: 3, max: 120 },
  description: { min: 10, max: 1000 },
};

function validate(fields: Fields): FieldErrors {
  const errors: FieldErrors = {};
  const title = fields.title.trim();
  const location = fields.location.trim();
  const description = fields.description.trim();
  if (title.length < limits.title.min) errors.title = 'Enter a title with at least 5 characters.';
  else if (title.length > limits.title.max) errors.title = 'Keep the title under 100 characters.';
  if (!fields.category) errors.category = 'Choose a category.';
  if (location.length < limits.location.min) errors.location = 'Enter a location with at least 3 characters.';
  else if (location.length > limits.location.max) errors.location = 'Keep the location under 120 characters.';
  if (description.length < limits.description.min) errors.description = 'Add at least 10 characters so others understand the issue.';
  else if (description.length > limits.description.max) errors.description = 'Keep the description under 1,000 characters.';
  return errors;
}

export function NewReportPage() {
  const { addReport } = useReports();
  const [fields, setFields] = useState<Fields>({ title: '', category: '', location: '', description: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  function updateField(name: FieldName, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setFormError('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    setFormError('');
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitting(true);
    try {
      const report = addReport({
        title: fields.title.trim(),
        category: fields.category as Category,
        location: fields.location.trim(),
        description: fields.description.trim(),
      });
      setSubmittedId(report.id);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'The report could not be saved. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedId) {
    return (
      <section className="form-page confirmation-page">
        <Link className="back-link" to="/"><ArrowLeft size={16} aria-hidden="true" />Back to overview</Link>
        <div className="confirmation-mark"><Check size={25} aria-hidden="true" /></div>
        <p className="eyebrow">Report saved in this browser</p>
        <h1>Thank you for<br />making it visible.</h1>
        <p className="confirmation-copy">Your report has been added to the community directory with the status <strong>Pending</strong>.</p>
        <div className="report-id-card"><span>Report reference</span><strong>{submittedId}</strong><ClipboardCheck size={19} aria-hidden="true" /></div>
        <div className="confirmation-actions"><Link className="button button-primary" to={`/reports/${encodeURIComponent(submittedId)}`}>View report</Link><Link className="text-link" to="/">Return to overview <ArrowLeft size={14} aria-hidden="true" /></Link></div>
        <p className="fine-print">This is a local prototype. The report has not been sent to municipal authorities.</p>
      </section>
    );
  }

  return (
    <section className="form-page">
      <Link className="back-link" to="/"><ArrowLeft size={16} aria-hidden="true" />Back to overview</Link>
      <div className="form-heading"><p className="eyebrow">Add to the neighbourhood record</p><h1>Report an issue</h1><p>Share a clear description so others can understand what needs attention. No personal information is needed.</p></div>
      <form className="report-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field"><label htmlFor="title">Issue title <span className="required-mark">Required</span></label><input id="title" name="title" value={fields.title} onChange={(event) => updateField('title', event.target.value)} maxLength={100} placeholder="e.g. Streetlight out near the park" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'title-error title-hint' : 'title-hint'} />{errors.title && <p className="field-error" id="title-error"><CircleAlert size={14} />{errors.title}</p>}<p className="field-hint" id="title-hint">5–100 characters. Keep it specific.</p></div>
        <div className="form-field"><label htmlFor="category">Category <span className="required-mark">Required</span></label><select id="category" name="category" value={fields.category} onChange={(event) => updateField('category', event.target.value)} aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? 'category-error' : undefined}><option value="" disabled>Select the closest match</option>{CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select>{errors.category && <p className="field-error" id="category-error"><CircleAlert size={14} />{errors.category}</p>}</div>
        <div className="form-field"><label htmlFor="location">Location or landmark <span className="required-mark">Required</span></label><input id="location" name="location" value={fields.location} onChange={(event) => updateField('location', event.target.value)} maxLength={120} placeholder="Street, nearby landmark, or neighbourhood" aria-invalid={Boolean(errors.location)} aria-describedby={errors.location ? 'location-error location-hint' : 'location-hint'} />{errors.location && <p className="field-error" id="location-error"><CircleAlert size={14} />{errors.location}</p>}<p className="field-hint" id="location-hint">3–120 characters. A nearby landmark is helpful.</p></div>
        <div className="form-field"><label htmlFor="description">What is happening? <span className="required-mark">Required</span></label><textarea id="description" name="description" value={fields.description} onChange={(event) => updateField('description', event.target.value)} maxLength={1000} rows={5} placeholder="Describe what you noticed and when. Avoid including personal details." aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'description-error description-hint' : 'description-hint'} />{errors.description && <p className="field-error" id="description-error"><CircleAlert size={14} />{errors.description}</p>}<p className="field-hint" id="description-hint">10–1,000 characters. Please do not include names or contact details.</p></div>
        {formError && <p className="form-error-banner" role="alert"><CircleAlert size={17} />{formError}</p>}
        <div className="form-actions"><button className="button button-primary" type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Submit report'}<ArrowLeft className="button-arrow" size={16} aria-hidden="true" /></button><span>Stored locally in this browser.</span></div>
      </form>
    </section>
  );
}
