import { ChangeEvent, DragEvent, FormEvent, useMemo, useState } from 'react';
import './CrCreatePage.css';

interface CreateCrForm {
  projectSpace: string;
  issueType: string;
  parentTask: string;
  status: string;
  summary: string;
  description: string;
  priority: string;
  startDate: string;
  dueDate: string;
  attachments: File[];
}

interface FormErrors {
  projectSpace?: string;
  issueType?: string;
  summary?: string;
  priority?: string;
}

const INITIAL_FORM: CreateCrForm = {
  projectSpace: 'Project Alpha - CMS',
  issueType: 'Change Request',
  parentTask: 'None',
  status: 'Draft',
  summary: '',
  description: '',
  priority: 'Medium',
  startDate: '',
  dueDate: '',
  attachments: [],
};

export default function CrCreatePage() {
  const [form, setForm] = useState<CreateCrForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDragging, setIsDragging] = useState(false);
  const [draftStatus, setDraftStatus] = useState('Draft will be saved automatically');

  const summaryCount = useMemo(() => form.summary.length, [form.summary]);

  const simulateAutosave = () => {
    setDraftStatus('Saving...');
    window.setTimeout(() => {
      setDraftStatus('Draft will be saved automatically');
    }, 800);
  };

  const setField = (field: keyof CreateCrForm, value: string | File[]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    simulateAutosave();
  };

  const handleInputChange =
      (field: keyof CreateCrForm) =>
          (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            setField(field, e.target.value);
          };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setField('attachments', files);
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    setField('attachments', files);
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!form.projectSpace.trim()) {
      nextErrors.projectSpace = 'Project / Space is required';
    }

    if (!form.issueType.trim()) {
      nextErrors.issueType = 'Issue Type is required';
    }

    if (!form.summary.trim()) {
      nextErrors.summary = 'Summary is required';
    } else if (form.summary.length > 255) {
      nextErrors.summary = 'Summary must not exceed 255 characters';
    }

    if (!form.priority.trim()) {
      nextErrors.priority = 'Priority is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const attachmentNames =
        form.attachments.length > 0
            ? form.attachments.map((file) => file.name).join(', ')
            : 'No attachments';

    alert(
        [
          'Create Requirement submitted successfully.',
          `Project / Space: ${form.projectSpace}`,
          `Issue Type: ${form.issueType}`,
          `Parent Task: ${form.parentTask}`,
          `Status: ${form.status}`,
          `Summary: ${form.summary}`,
          `Description: ${form.description || 'Empty'}`,
          `Priority: ${form.priority}`,
          `Start Date: ${form.startDate || 'Not set'}`,
          `Due Date: ${form.dueDate || 'Not set'}`,
          `Attachments: ${attachmentNames}`,
        ].join('\n')
    );
  };

  const handleCancel = () => {
    setForm(INITIAL_FORM);
    setErrors({});
  };

  return (
      <div className="cr-create-page">
        <div className="cr-create-modal">
          <div className="cr-create-header">
            <div className="create-title-wrap">
              <div className="create-icon-box">✎</div>
              <div>
                <h1>Create Requirement</h1>
                <p>SOLASHI Connect • Project Alpha</p>
              </div>
            </div>

            <button className="close-btn" type="button" aria-label="Close">
              ✕
            </button>
          </div>

          <form className="cr-create-form" onSubmit={handleSubmit}>
            <div className="form-grid form-grid-four">
              <div className="form-group">
                <label>
                  Project / Space <span>*</span>
                </label>
                <select value={form.projectSpace} onChange={handleInputChange('projectSpace')}>
                  <option>Project Alpha - CMS</option>
                  <option>Project Beta - Mobile</option>
                  <option>Project Gamma - Portal</option>
                </select>
                {errors.projectSpace && <small className="error-text">{errors.projectSpace}</small>}
              </div>

              <div className="form-group">
                <label>
                  Issue Type <span>*</span>
                </label>
                <select value={form.issueType} onChange={handleInputChange('issueType')}>
                  <option>Change Request</option>
                  <option>Improvement</option>
                  <option>Task</option>
                </select>
                {errors.issueType && <small className="error-text">{errors.issueType}</small>}
              </div>

              <div className="form-group">
                <label>Parent Task</label>
                <input
                    type="text"
                    value={form.parentTask}
                    onChange={handleInputChange('parentTask')}
                    placeholder="None"
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <input type="text" value={form.status} readOnly />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <div className="label-row">
                  <label>
                    Summary <span>*</span>
                  </label>
                  <span className="char-count">{summaryCount} / 255</span>
                </div>

                <input
                    type="text"
                    value={form.summary}
                    onChange={handleInputChange('summary')}
                    placeholder="e.g., Update login flow for enterprise users"
                    maxLength={255}
                />
                {errors.summary && <small className="error-text">{errors.summary}</small>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Description</label>

                <div className="editor-box">
                  <div className="editor-toolbar">
                    <button type="button">B</button>
                    <button type="button">I</button>
                    <button type="button">• List</button>
                    <button type="button">Link</button>
                    <button type="button">Image</button>
                    <button type="button">{'</>'}</button>
                  </div>

                  <textarea
                      value={form.description}
                      onChange={handleInputChange('description')}
                      placeholder="Describe the requirement in detail..."
                      rows={8}
                  />
                </div>
              </div>
            </div>

            <div className="form-grid form-grid-three">
              <div className="form-group">
                <label>
                  Priority <span>*</span>
                </label>
                <select value={form.priority} onChange={handleInputChange('priority')}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
                {errors.priority && <small className="error-text">{errors.priority}</small>}
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={form.startDate} onChange={handleInputChange('startDate')} />
                <small className="hint-text">Defaults to creation date</small>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={form.dueDate} onChange={handleInputChange('dueDate')} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Attachments</label>

                <label
                    className={`upload-box ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                  <input type="file" multiple onChange={handleFileChange} />
                  <div className="upload-icon">☁</div>
                  <div className="upload-title">
                    Drop files here or <span>browse</span>
                  </div>
                  <div className="upload-subtitle">PDF, PNG, JPG, DOCX up to 10MB each</div>
                </label>

                {form.attachments.length > 0 && (
                    <div className="file-list">
                      {form.attachments.map((file) => (
                          <div key={file.name} className="file-chip">
                            {file.name}
                          </div>
                      ))}
                    </div>
                )}
              </div>
            </div>

            <div className="cr-create-footer">
              <div className="draft-status">
                <span className="draft-dot" />
                <span>{draftStatus}</span>
              </div>

              <div className="footer-actions">
                <button className="cancel-btn" type="button" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="submit-btn" type="submit">
                  Create Requirement →
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
  );
}