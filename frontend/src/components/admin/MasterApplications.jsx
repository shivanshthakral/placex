import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import {
  Send,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Video,
  Award,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function MasterApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      setLoading(true);
      const data = await api.getAdminApplications();
      setApplications(data || []);
    } catch (err) {
      console.error('Failed to load master applications:', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = applications.filter((app) => {
    const matchSearch =
      (app.studentName || '').toLowerCase().includes(search.toLowerCase()) ||
      (app.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
      (app.jobTitle || '').toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>Master Campus Applications</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          University-wide audit of all student applications, interview rounds, and offer letters.
        </p>
      </div>

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
            placeholder="Search by student, company, or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: '180px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Stages</option>
          <option value="APPLIED">Applied</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
          <option value="SELECTED">Selected (Offer)</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Student Candidate</th>
                <th>Company</th>
                <th>Role & CTC</th>
                <th>Applied Date</th>
                <th>Status Stage</th>
                <th>Resume</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-sky)' }}>
                      #{app.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#fff' }}>{app.studentName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      CGPA: {app.cgpa} • {app.department}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '600' }}>{app.companyName}</span>
                  </td>
                  <td>
                    <div>{app.jobTitle}</div>
                    <span style={{ fontSize: '12px', color: '#34d399', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                      ₹{app.packageLpa} LPA
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(app.applicationDate).toLocaleDateString([], { dateStyle: 'medium' })}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        app.status === 'SELECTED'
                          ? 'badge-selected'
                          : app.status === 'INTERVIEW_SCHEDULED'
                          ? 'badge-interview'
                          : app.status === 'SHORTLISTED'
                          ? 'badge-shortlisted'
                          : 'badge-applied'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <a
                      href={api.getResumeUrl(app.studentId)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <FileText size={13} /> PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
