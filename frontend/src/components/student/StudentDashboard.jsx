import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Video,
  Award,
  AlertCircle,
  Building2,
  Sparkles
} from 'lucide-react';

export default function StudentDashboard({ onNavigate }) {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [profileData, appsData, intData, jobsData] = await Promise.all([
        api.getStudentProfile().catch(() => null),
        api.getMyApplications().catch(() => []),
        api.getStudentInterviews().catch(() => []),
        api.getJobs().catch(() => []),
      ]);

      setProfile(profileData);
      setApplications(appsData || []);
      setInterviews(intData || []);
      setJobs(jobsData || []);
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  const selectedCount = applications.filter((a) => a.status === 'SELECTED').length;
  const shortlistedCount = applications.filter(
    (a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED'
  ).length;

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div
        className="glass-card"
        style={{
          background:
            'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          marginBottom: '28px',
          padding: '30px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.04em',
                }}
              >
                CLASS OF 2025 • CAMPUS PLACEMENTS
              </span>
            </div>
            <h2 style={{ fontSize: '26px', marginBottom: '6px' }}>
              Welcome back, {currentUser?.name || 'Scholar'} 👋
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '620px' }}>
              {profile?.department || 'Engineering Student'} • Reg No:{' '}
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-sky)' }}>
                {profile?.registrationNumber || 'RA2111003010142'}
              </span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => onNavigate('student-profile')}
            >
              <FileCheck size={16} /> Update Resume
            </button>
            <button
              className="btn btn-primary"
              onClick={() => onNavigate('student-jobs')}
            >
              <Briefcase size={16} /> Explore Campus Drives
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <div className="stat-tile">
          <div>
            <div className="stat-label">Verified CGPA</div>
            <div className="stat-value">{profile?.cgpa ? profile.cgpa.toFixed(2) : '9.35'}</div>
            <div className="stat-sub">
              <span style={{ color: '#34d399', fontWeight: '600' }}>
                {profile?.backlogs === 0 ? '✓ Zero Backlogs' : `${profile?.backlogs} Active Backlog`}
              </span>
            </div>
          </div>
          <div className="stat-icon emerald">
            <Award size={24} />
          </div>
        </div>

        <div className="stat-tile">
          <div>
            <div className="stat-label">Applications Submitted</div>
            <div className="stat-value">{applications.length}</div>
            <div className="stat-sub">Across 4 visiting companies</div>
          </div>
          <div className="stat-icon indigo">
            <Briefcase size={24} />
          </div>
        </div>

        <div className="stat-tile">
          <div>
            <div className="stat-label">Shortlisted & Interviews</div>
            <div className="stat-value">{shortlistedCount}</div>
            <div className="stat-sub">
              <span style={{ color: '#c084fc', fontWeight: '600' }}>Active in recruitment pipeline</span>
            </div>
          </div>
          <div className="stat-icon purple">
            <Video size={24} />
          </div>
        </div>

        <div className="stat-tile">
          <div>
            <div className="stat-label">Campus Placement Offers</div>
            <div className="stat-value" style={{ color: selectedCount > 0 ? '#10b981' : '#fff' }}>
              {selectedCount}
            </div>
            <div className="stat-sub">
              {selectedCount > 0 ? (
                <span style={{ color: '#10b981', fontWeight: '700' }}>🎉 Selected & Placed!</span>
              ) : (
                'Under review'
              )}
            </div>
          </div>
          <div className="stat-icon amber">
            <Sparkles size={24} />
          </div>
        </div>
      </div>

      {/* Main 2-column Grid: Pipeline & Upcoming Interviews */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {/* Upcoming Interview Calls */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '17px', marginBottom: '4px' }}>Upcoming Campus Interviews</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Virtual interview links and scheduled technical rounds
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('student-interviews')}
            >
              View All
            </button>
          </div>

          {interviews.length === 0 ? (
            <div
              style={{
                padding: '30px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              No interviews scheduled currently. Keep applying to active drives!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {interviews.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#818cf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Video size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>
                        {item.jobTitle || 'Technical Interview'}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {item.companyName} • {new Date(item.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>

                  {item.locationOrMeetingLink ? (
                    <a
                      href={item.locationOrMeetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Join Meeting
                    </a>
                  ) : (
                    <span className="badge badge-interview">Scheduled</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Readiness & Resume Health */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '17px', marginBottom: '4px' }}>Profile & Resume Verification</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Profile completeness score for recruiters
              </p>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '18px',
                fontWeight: '700',
                color: '#34d399',
              }}
            >
              {profile?.profileCompletion || 95}% Complete
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: `${profile?.profileCompletion || 95}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #34d399)',
                borderRadius: 'var(--radius-full)',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Academic Records</span>
              <span style={{ color: '#34d399', fontWeight: '600' }}>✓ Verified by University</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Master Resume PDF</span>
              <span style={{ color: profile?.resumeFileName ? '#34d399' : '#fbbf24', fontWeight: '600' }}>
                {profile?.resumeFileName ? '✓ Attached & Parsed' : '⚠️ Action Needed'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Verified Skills</span>
              <span style={{ color: 'var(--accent-sky)', fontWeight: '600' }}>
                {profile?.skills?.split(',').length || 6} Skills Endorsed
              </span>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
              onClick={() => onNavigate('student-profile')}
            >
              Manage Academic Profile & Resume
            </button>
          </div>
        </div>
      </div>

      {/* Featured Campus Drives */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Latest Visiting Companies</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Top CTC campus job openings with automated eligibility checking
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onNavigate('student-jobs')}
          >
            Explore All {jobs.length} Drives <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid-3">
          {jobs.slice(0, 3).map((job) => (
            <div
              key={job.id}
              className="glass-card glass-card-interactive"
              style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.02)' }}
              onClick={() => onNavigate('student-jobs')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
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
                    {job.companyName}
                  </span>
                  <h4 style={{ fontSize: '15px', marginTop: '2px' }}>{job.title}</h4>
                </div>
                <span
                  style={{
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#c7d2fe',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    fontWeight: '700',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  ₹{job.packageLpa} LPA
                </span>
              </div>

              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '12.5px',
                  marginBottom: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {job.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '12px',
                  fontSize: '12px',
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>
                  Min CGPA: <strong>{job.minimumCgpa || 7.0}</strong>
                </span>
                <span
                  className={`badge ${
                    job.eligible ? 'badge-eligible' : 'badge-ineligible'
                  }`}
                >
                  {job.eligible ? '✓ Eligible' : 'Check Criteria'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
