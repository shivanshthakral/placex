import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import {
  Briefcase,
  PlusCircle,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Sliders,
  AlertCircle,
  DollarSign
} from 'lucide-react';

export default function JobManagement({ onNavigateApplicants }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: 'Bangalore, Karnataka',
    packageLpa: 15.0,
    jobType: 'FULL_TIME',
    minimumCgpa: 7.5,
    maximumBacklogs: 0,
    minimumTenthPercentage: 70.0,
    minimumTwelfthPercentage: 70.0,
    graduationYear: 2025,
    eligibleDepartments: 'Computer Science & Engineering, Information Technology, Computer Science & Engineering (AI & ML)',
    requiredSkills: 'Data Structures, Algorithms, Problem Solving, System Design, Java or Python',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      const data = await api.getRecruiterJobs();
      setJobs(data || []);
    } catch (err) {
      console.error('Failed to load recruiter jobs:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.createJob(formData);
      setFeedback({ type: 'success', text: 'Campus job drive published successfully!' });
      setShowCreateModal(false);
      loadJobs();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to create job drive' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCloseJob(id) {
    try {
      await api.closeJob(id);
      setFeedback({ type: 'success', text: 'Job posting closed for new applications.' });
      loadJobs();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to close job' });
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>Manage Campus Job Postings</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Publish new job profiles and configure automated CGPA and branch eligibility rules.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <PlusCircle size={16} /> Post New Campus Job
        </button>
      </div>

      {feedback && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background:
              feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${feedback.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: feedback.type === 'success' ? '#34d399' : '#f87171',
          }}
        >
          <span>{feedback.text}</span>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Jobs Grid */}
      <div className="grid-2">
        {jobs.map((job) => (
          <div key={job.id} className="glass-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '14px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--accent-sky)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {job.companyName}
                </span>
                <h3 style={{ fontSize: '17px', marginTop: '2px' }}>{job.title}</h3>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: '#34d399',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  ₹{job.packageLpa} LPA
                </div>
                <span
                  className={`badge ${
                    job.status === 'OPEN' ? 'badge-eligible' : 'badge-rejected'
                  }`}
                  style={{ marginTop: '4px' }}
                >
                  {job.status === 'OPEN' ? 'Active Drive' : 'Closed'}
                </span>
              </div>
            </div>

            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: '1.5',
                marginBottom: '16px',
              }}
            >
              {job.description}
            </p>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                fontSize: '12.5px',
                color: 'var(--text-muted)',
                marginBottom: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Eligibility Cutoff:</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>
                  Min {job.minimumCgpa} CGPA • Max {job.maximumBacklogs ?? 0} Backlogs
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Application Deadline:</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>{job.deadline}</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '14px',
              }}
            >
              <button
                className="btn btn-secondary btn-sm"
                onClick={onNavigateApplicants}
              >
                Review Applicants
              </button>

              {job.status === 'OPEN' && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleCloseJob(job.id)}
                >
                  Close Posting
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Post Campus Job Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 style={{ fontSize: '18px' }}>Post New Campus Job Drive</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Job Title / Designation</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Associate Software Engineer - Cloud Platform"
                    required
                  />
                </div>

                <div className="grid-2" style={{ gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Package (CTC in LPA)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={formData.packageLpa}
                      onChange={(e) => setFormData({ ...formData, packageLpa: parseFloat(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Job Location</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Bangalore / Chennai / Pune"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Job Description</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe role responsibilities, tech stack, and what the candidate will work on..."
                    required
                  />
                </div>

                {/* Eligibility Engine Parameters */}
                <div
                  style={{
                    background: 'rgba(99, 102, 241, 0.06)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Sliders size={16} color="#818cf8" />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#c7d2fe' }}>
                      Automated Eligibility Cutoff Rules
                    </span>
                  </div>

                  <div className="grid-2" style={{ gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: '8px' }}>
                      <label className="form-label">Minimum CGPA Cutoff</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-input"
                        value={formData.minimumCgpa}
                        onChange={(e) => setFormData({ ...formData, minimumCgpa: parseFloat(e.target.value) })}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '8px' }}>
                      <label className="form-label">Max Allowed Backlogs</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.maximumBacklogs}
                        onChange={(e) => setFormData({ ...formData, maximumBacklogs: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0, marginTop: '8px' }}>
                    <label className="form-label">Eligible Engineering Branches</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.eligibleDepartments}
                      onChange={(e) => setFormData({ ...formData, eligibleDepartments: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Application Deadline</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Publishing...' : 'Publish Campus Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
