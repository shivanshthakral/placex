import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import {
  Send,
  Building,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  FileText,
  DollarSign,
  Video,
  Award
} from 'lucide-react';

export default function MyApplications({ onNavigateInterviews }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      setLoading(true);
      const data = await api.getMyApplications();
      setApplications(data || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED':
        return <span className="badge badge-applied"><Clock size={12} /> Under Review</span>;
      case 'SHORTLISTED':
        return <span className="badge badge-shortlisted"><CheckCircle2 size={12} /> Shortlisted</span>;
      case 'INTERVIEW_SCHEDULED':
        return <span className="badge badge-interview"><Video size={12} /> Interview Round</span>;
      case 'SELECTED':
        return <span className="badge badge-selected"><Award size={12} /> Offer Extended 🎉</span>;
      case 'REJECTED':
        return <span className="badge badge-rejected"><AlertCircle size={12} /> Application Closed</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const filtered = applications.filter((app) => {
    if (statusFilter === 'ALL') return true;
    return app.status === statusFilter;
  });

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>My Placement Applications</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Live tracker of your campus placement applications, recruiter reviews, and stage outcomes.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
        }}
      >
        {[
          { key: 'ALL', label: `All Applications (${applications.length})` },
          { key: 'SELECTED', label: `Offers (${applications.filter(a => a.status === 'SELECTED').length})` },
          { key: 'INTERVIEW_SCHEDULED', label: `Interviews (${applications.filter(a => a.status === 'INTERVIEW_SCHEDULED').length})` },
          { key: 'SHORTLISTED', label: `Shortlisted (${applications.filter(a => a.status === 'SHORTLISTED').length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`btn btn-sm ${statusFilter === tab.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}
        >
          No applications found for this filter.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((app) => (
            <div key={app.id} className="glass-card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(99, 102, 241, 0.12)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#818cf8',
                      fontWeight: '800',
                      fontSize: '18px',
                    }}
                  >
                    {app.companyName?.[0] || 'C'}
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--accent-sky)',
                        fontWeight: '700',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {app.companyName}
                    </span>
                    <h3 style={{ fontSize: '17px', marginTop: '2px' }}>{app.jobTitle}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Application ID: #{app.id} • Applied on{' '}
                      {new Date(app.applicationDate).toLocaleDateString([], { dateStyle: 'medium' })}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginBottom: '6px' }}>{getStatusBadge(app.status)}</div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#34d399',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    ₹{app.packageLpa} LPA
                  </div>
                </div>
              </div>

              {/* Progress Flow Pipeline Bar */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Status Note:</span>
                  <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>
                    {app.status === 'SELECTED'
                      ? 'Congratulations! Official campus offer letter extended by the recruiting team.'
                      : app.status === 'INTERVIEW_SCHEDULED'
                      ? 'Technical Round scheduled. Review time and meeting link in the Interviews tab.'
                      : app.status === 'SHORTLISTED'
                      ? 'Resume verified and passed preliminary screening.'
                      : 'Application under review by campus recruitment committee.'}
                  </span>
                </div>

                {app.status === 'INTERVIEW_SCHEDULED' && onNavigateInterviews && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={onNavigateInterviews}
                  >
                    View Interview Link
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
