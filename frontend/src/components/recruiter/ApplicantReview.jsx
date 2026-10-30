import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Video,
  Award,
  XCircle,
  FileText,
  Download,
  Calendar,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export default function ApplicantReview() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterJob, setFilterJob] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewData, setInterviewData] = useState({
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    mode: 'ONLINE',
    locationOrMeetingLink: 'https://meet.google.com/xyz-demo-interview',
    notes: 'Round 1: Data Structures & Problem Solving. Please ensure functional webcam.',
  });
  const [actionFeedback, setActionFeedback] = useState(null);

  useEffect(() => {
    loadApplicants();
  }, []);

  async function loadApplicants() {
    try {
      setLoading(true);
      const data = await api.getAllApplicants();
      setApplicants(data || []);
    } catch (err) {
      console.error('Failed to load applicants:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(applicationId, newStatus) {
    if (newStatus === 'INTERVIEW_SCHEDULED') {
      const app = applicants.find((a) => a.id === applicationId);
      setSelectedApp(app);
      setShowInterviewModal(true);
      return;
    }

    try {
      await api.updateApplicationStatus(applicationId, newStatus, 'Status updated by recruiter');
      setActionFeedback({ type: 'success', text: `Candidate status updated to ${newStatus}` });
      loadApplicants();
    } catch (err) {
      setActionFeedback({ type: 'error', text: err.message || 'Failed to update candidate status' });
    }
  }

  async function handleScheduleInterview(e) {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      // Schedule interview
      await api.scheduleInterview({
        applicationId: selectedApp.id,
        scheduledAt: interviewData.scheduledAt,
        mode: interviewData.mode,
        locationOrMeetingLink: interviewData.locationOrMeetingLink,
        notes: interviewData.notes,
      });

      // Update status to INTERVIEW_SCHEDULED
      await api.updateApplicationStatus(selectedApp.id, 'INTERVIEW_SCHEDULED', interviewData.notes);

      setActionFeedback({
        type: 'success',
        text: `Interview scheduled for ${selectedApp.studentName}! Candidate notified.`,
      });

      setShowInterviewModal(false);
      setSelectedApp(null);
      loadApplicants();
    } catch (err) {
      setActionFeedback({ type: 'error', text: err.message || 'Failed to schedule interview' });
    }
  }

  const filtered = applicants.filter((app) => {
    const matchSearch =
      (app.studentName || '').toLowerCase().includes(search.toLowerCase()) ||
      (app.department || '').toLowerCase().includes(search.toLowerCase()) ||
      (app.jobTitle || '').toLowerCase().includes(search.toLowerCase());

    const matchStatus = filterStatus === 'ALL' || app.status === filterStatus;
    const matchJob = filterJob === 'ALL' || app.jobTitle === filterJob;

    return matchSearch && matchStatus && matchJob;
  });

  const uniqueJobs = Array.from(new Set(applicants.map((a) => a.jobTitle).filter(Boolean)));

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>Candidate Review & ATS Board</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Screen verified university candidates, inspect resumes, and advance candidates through recruitment stages.
        </p>
      </div>

      {actionFeedback && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background:
              actionFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${actionFeedback.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: actionFeedback.type === 'success' ? '#34d399' : '#f87171',
          }}
        >
          <span>{actionFeedback.text}</span>
          <button
            onClick={() => setActionFeedback(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter bar */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search candidates by name, branch, or job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: '170px' }}
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
          >
            <option value="ALL">All Campus Drives</option>
            {uniqueJobs.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>

          <select
            className="form-select"
            style={{ width: '160px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Stages</option>
            <option value="APPLIED">Applied (Under Review)</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="SELECTED">Selected (Offer)</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Branch & Batch</th>
                <th>Academic Scores</th>
                <th>Applied Job</th>
                <th>Resume</th>
                <th>Current Stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No candidates found matching the filters.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: '#fff' }}>{app.studentName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.studentEmail}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px' }}>{app.department || 'B.Tech CSE'}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Class of {app.graduationYear || 2025}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: '700', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                          {app.cgpa ? app.cgpa.toFixed(2) : '8.80'} CGPA
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          ({app.backlogs ?? 0} BL)
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600', fontSize: '13px' }}>{app.jobTitle}</span>
                    </td>
                    <td>
                      <a
                        href={api.getResumeUrl(app.studentId)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FileText size={14} color="#818cf8" /> View PDF
                      </a>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{
                          width: '170px',
                          fontSize: '12px',
                          padding: '6px 10px',
                          background:
                            app.status === 'SELECTED'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : app.status === 'INTERVIEW_SCHEDULED'
                              ? 'rgba(139, 92, 246, 0.15)'
                              : app.status === 'SHORTLISTED'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'var(--bg-input)',
                          borderColor:
                            app.status === 'SELECTED'
                              ? '#10b981'
                              : app.status === 'INTERVIEW_SCHEDULED'
                              ? '#8b5cf6'
                              : 'var(--border-subtle)',
                        }}
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="SHORTLISTED">Shortlist</option>
                        <option value="INTERVIEW_SCHEDULED">Schedule Interview</option>
                        <option value="SELECTED">Extend Offer 🎉</option>
                        <option value="REJECTED">Reject</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setSelectedApp(app);
                          setShowInterviewModal(true);
                        }}
                      >
                        <Calendar size={13} /> Schedule
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showInterviewModal && selectedApp && (
        <div className="modal-overlay" onClick={() => setShowInterviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: '11px', color: 'var(--accent-sky)', fontWeight: '700' }}>
                  CAMPUS INTERVIEW SCHEDULER
                </span>
                <h3 style={{ fontSize: '18px' }}>
                  Schedule Interview for {selectedApp.studentName}
                </h3>
              </div>
              <button
                onClick={() => setShowInterviewModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleInterview}>
              <div className="modal-body">
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    marginBottom: '18px',
                    fontSize: '13px',
                  }}
                >
                  <div>Target Role: <strong>{selectedApp.jobTitle}</strong></div>
                  <div>Candidate CGPA: <strong>{selectedApp.cgpa}</strong> • {selectedApp.department}</div>
                </div>

                <div className="grid-2" style={{ gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Interview Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={interviewData.scheduledAt}
                      onChange={(e) =>
                        setInterviewData({ ...interviewData, scheduledAt: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Interview Mode</label>
                    <select
                      className="form-select"
                      value={interviewData.mode}
                      onChange={(e) =>
                        setInterviewData({ ...interviewData, mode: e.target.value })
                      }
                    >
                      <option value="ONLINE">Virtual (Google Meet / Teams)</option>
                      <option value="OFFLINE">On-Campus (Career Centre GD Hall)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Meeting URL or On-Campus Room</label>
                  <input
                    type="text"
                    className="form-input"
                    value={interviewData.locationOrMeetingLink}
                    onChange={(e) =>
                      setInterviewData({ ...interviewData, locationOrMeetingLink: e.target.value })
                    }
                    placeholder="https://meet.google.com/xyz or Main Campus Hall 3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Interviewer Instructions & Prep Notes</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={interviewData.notes}
                    onChange={(e) =>
                      setInterviewData({ ...interviewData, notes: e.target.value })
                    }
                    placeholder="Provide candidate instructions, topics covered, or interviewer contact..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowInterviewModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm & Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
