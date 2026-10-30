import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Briefcase,
  CheckCircle2,
  Calendar,
  Award,
  Clock,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  Building2,
  FileText
} from 'lucide-react';

export default function RecruiterDashboard({ onNavigate }) {
  const { currentUser } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  async function loadData() {
    try {
      setLoading(true);
      const [dashData, jobsData, applicantsData, companyData] = await Promise.all([
        api.getRecruiterDashboard().catch(() => null),
        api.getRecruiterJobs().catch(() => []),
        api.getAllApplicants().catch(() => []),
        api.getRecruiterCompany().catch(() => null),
      ]);

      setDashboard(dashData);
      setJobs(jobsData || []);
      setApplicants(applicantsData || []);
      setCompany(companyData);
    } catch (err) {
      console.error('Failed to load recruiter dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  const totalApplicants = applicants.length;
  const shortlisted = applicants.filter((a) => a.status === 'SHORTLISTED').length;
  const inInterview = applicants.filter((a) => a.status === 'INTERVIEW_SCHEDULED').length;
  const offersMade = applicants.filter((a) => a.status === 'SELECTED').length;

  return (
    <div>
      {/* Recruiter Hero Header */}
      <div
        className="glass-card"
        style={{
          background:
            'linear-gradient(135deg, rgba(8, 47, 73, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          marginBottom: '28px',
          padding: '28px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  background: 'rgba(6, 182, 212, 0.2)',
                  color: '#67e8f9',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.04em',
                }}
              >
                {company?.name || 'CAMPUS RECRUITER'} • TALENT ACQUISITION
              </span>
            </div>
            <h2 style={{ fontSize: '26px', marginBottom: '6px' }}>
              Welcome, {currentUser?.name || 'Recruiter'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px' }}>
              Manage SRM University campus drives, screen verified student resumes, and schedule virtual interviews.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => onNavigate('recruiter-applicants')}
            >
              <Users size={16} /> Review Applicants
            </button>
            <button
              className="btn btn-primary"
              onClick={() => onNavigate('recruiter-jobs')}
            >
              <PlusCircle size={16} /> Post Campus Job
            </button>
          </div>
        </div>
      </div>

      {/* Funnel Metrics */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <div className="stat-tile">
          <div>
            <div className="stat-label">Active Job Postings</div>
            <div className="stat-value">{jobs.length}</div>
            <div className="stat-sub">Across SRM Departments</div>
          </div>
          <div className="stat-icon indigo">
            <Briefcase size={24} />
          </div>
        </div>

        <div className="stat-tile">
          <div>
            <div className="stat-label">Candidate Applications</div>
            <div className="stat-value">{totalApplicants}</div>
            <div className="stat-sub">Total applicants received</div>
          </div>
          <div className="stat-icon cyan">
            <Users size={24} />
          </div>
        </div>

        <div className="stat-tile">
          <div>
            <div className="stat-label">Shortlisted & Interviews</div>
            <div className="stat-value">{shortlisted + inInterview}</div>
            <div className="stat-sub">Currently in evaluation</div>
          </div>
          <div className="stat-icon purple">
            <Calendar size={24} />
          </div>
        </div>

        <div className="stat-tile">
          <div>
            <div className="stat-label">Campus Offers Released</div>
            <div className="stat-value" style={{ color: '#10b981' }}>{offersMade}</div>
            <div className="stat-sub">Selected students</div>
          </div>
          <div className="stat-icon emerald">
            <Award size={24} />
          </div>
        </div>
      </div>

      {/* 2 Column: Active Postings & Recent Applicants */}
      <div className="grid-2">
        {/* Active Campus Postings */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Active Campus Postings</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Drives currently open for university students
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('recruiter-jobs')}
            >
              Manage Jobs
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {jobs.map((job) => (
              <div
                key={job.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '15px', marginBottom: '4px' }}>{job.title}</h4>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>₹{job.packageLpa} LPA</span>
                    <span>•</span>
                    <span>Min CGPA: {job.minimumCgpa}</span>
                    <span>•</span>
                    <span>Deadline: {job.deadline}</span>
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onNavigate('recruiter-applicants')}
                >
                  View Applicants
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applicants awaiting review */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Candidate Applications</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Latest verified candidate submissions
              </p>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onNavigate('recruiter-applicants')}
            >
              ATS Board
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {applicants.slice(0, 4).map((app) => (
              <div
                key={app.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '14px', marginBottom: '2px' }}>{app.studentName}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {app.department || 'B.Tech CSE'} • CGPA: <strong>{app.cgpa}</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
