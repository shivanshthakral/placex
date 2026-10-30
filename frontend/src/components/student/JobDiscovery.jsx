import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import confetti from 'canvas-confetti';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  ArrowRight,
  Sparkles,
  Info,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function JobDiscovery({ onApplied }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [minCgpaFilter, setMinCgpaFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [selectedJob, setSelectedJob] = useState(null);
  const [eligibilityModalJob, setEligibilityModalJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      const [jobsData, myApps] = await Promise.all([
        api.getJobs().catch(() => []),
        api.getMyApplications().catch(() => []),
      ]);

      setJobs(jobsData || []);
      const appliedSet = new Set((myApps || []).map((a) => a.jobId));
      setAppliedJobs(appliedSet);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApply(job) {
    if (appliedJobs.has(job.id)) return;
    try {
      setApplying(true);
      await api.applyForJob(job.id);
      setAppliedJobs((prev) => new Set([...prev, job.id]));

      // Launch celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setActionMessage({
        type: 'success',
        text: `Successfully applied to ${job.companyName} for ${job.title}! The recruiter has received your verified profile.`,
      });

      if (onApplied) onApplied();
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Failed to submit application',
      });
    } finally {
      setApplying(false);
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCgpa = minCgpaFilter ? (job.minimumCgpa || 0) <= parseFloat(minCgpaFilter) : true;

    let matchesTier = true;
    if (tierFilter === 'SUPER_DREAM') matchesTier = (job.packageLpa || 0) >= 20.0;
    else if (tierFilter === 'DREAM') matchesTier = (job.packageLpa || 0) >= 10.0 && (job.packageLpa || 0) < 20.0;
    else if (tierFilter === 'CORE') matchesTier = (job.packageLpa || 0) < 10.0;

    return matchesSearch && matchesCgpa && matchesTier;
  });

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>Campus Job Drives</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Explore official recruiting drives for SRM IST University graduates. Eligibility is computed in real-time.
        </p>
      </div>

      {actionMessage && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background:
              actionMessage.type === 'success'
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${
              actionMessage.type === 'success' ? '#10b981' : '#ef4444'
            }`,
            color: actionMessage.type === 'success' ? '#34d399' : '#f87171',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {actionMessage.type === 'success' ? (
              <CheckCircle2 size={18} />
            ) : (
              <XCircle size={18} />
            )}
            <span style={{ fontSize: '13.5px', fontWeight: '500' }}>
              {actionMessage.text}
            </span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontWeight: '700',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* CTC Tier Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { key: 'ALL', label: `All Campus Drives (${jobs.length})` },
          { key: 'SUPER_DREAM', label: `Super Dream >20 LPA (${jobs.filter((j) => (j.packageLpa || 0) >= 20).length})` },
          { key: 'DREAM', label: `Dream 10-20 LPA (${jobs.filter((j) => (j.packageLpa || 0) >= 10 && (j.packageLpa || 0) < 20).length})` },
          { key: 'CORE', label: `Core / Mass <10 LPA (${jobs.filter((j) => (j.packageLpa || 0) < 10).length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`btn btn-sm ${tierFilter === tab.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTierFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters & Search Toolbar */}
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
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
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
            placeholder="Search by company, title, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Min CTC:</span>
            <select
              className="form-select"
              style={{ width: '130px' }}
              value={minCgpaFilter}
              onChange={(e) => setMinCgpaFilter(e.target.value)}
            >
              <option value="">All Tiers</option>
              <option value="7.0">CGPA ≤ 7.0</option>
              <option value="8.0">CGPA ≤ 8.0</option>
              <option value="8.5">CGPA ≤ 8.5</option>
              <option value="9.0">CGPA ≤ 9.0</option>
            </select>
          </div>

          <span
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Showing {filteredJobs.length} active drives
          </span>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid-2">
        {filteredJobs.map((job) => {
          const hasApplied = appliedJobs.has(job.id);
          const isEligible = job.eligible;

          return (
            <div
              key={job.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Header row: Company & CTC */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(99, 102, 241, 0.12)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#818cf8',
                        fontWeight: '700',
                        fontSize: '16px',
                      }}
                    >
                      {job.companyName?.[0] || 'C'}
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--accent-sky)',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                        }}
                      >
                        {job.companyName}
                      </span>
                      <h3 style={{ fontSize: '17px', marginTop: '2px' }}>{job.title}</h3>
                    </div>
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
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      CTC Package
                    </span>
                  </div>
                </div>

                {/* Job metadata tags */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginBottom: '16px',
                    fontSize: '12.5px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#94a3b8" /> {job.location}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Briefcase size={14} color="#94a3b8" /> {job.jobType || 'Full-time'}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} color="#94a3b8" /> Deadline: {job.deadline}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                    marginBottom: '18px',
                  }}
                >
                  {job.description}
                </p>

                {/* Eligibility Check Banner */}
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isEligible
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'rgba(239, 68, 68, 0.08)',
                    border: `1px solid ${
                      isEligible
                        ? 'rgba(16, 185, 129, 0.25)'
                        : 'rgba(239, 68, 68, 0.25)'
                    }`,
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isEligible ? (
                      <CheckCircle2 size={16} color="#34d399" />
                    ) : (
                      <XCircle size={16} color="#f87171" />
                    )}
                    <span
                      style={{
                        fontSize: '12.5px',
                        fontWeight: '600',
                        color: isEligible ? '#34d399' : '#f87171',
                      }}
                    >
                      {isEligible ? 'You Meet All Eligibility Criteria' : 'Ineligible based on university criteria'}
                    </span>
                  </div>

                  {!isEligible && (
                    <button
                      onClick={() => setEligibilityModalJob(job)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-sky)',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      View Reason
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '16px',
                  marginTop: '10px',
                }}
              >
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedJob(job)}
                >
                  View Details
                </button>

                {hasApplied ? (
                  <span className="badge badge-applied" style={{ padding: '8px 14px' }}>
                    <CheckCircle2 size={14} /> Applied
                  </span>
                ) : (
                  <button
                    className={`btn ${isEligible ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    disabled={!isEligible || applying}
                    onClick={() => handleApply(job)}
                  >
                    {isEligible ? (
                      <>
                        <Sparkles size={14} /> Apply for Drive
                      </>
                    ) : (
                      'Criteria Not Met'
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ineligibility Reason Modal */}
      {eligibilityModalJob && (
        <div className="modal-overlay" onClick={() => setEligibilityModalJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={20} color="#f87171" />
                <h3 style={{ fontSize: '17px' }}>Eligibility Breakdown</h3>
              </div>
              <button
                onClick={() => setEligibilityModalJob(null)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Placement criteria set by <strong>{eligibilityModalJob.companyName}</strong> for{' '}
                <strong>{eligibilityModalJob.title}</strong>:
              </p>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Minimum CGPA Cutoff:</span>
                  <span style={{ fontWeight: '600' }}>{eligibilityModalJob.minimumCgpa || 7.0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Maximum Backlogs Allowed:</span>
                  <span style={{ fontWeight: '600' }}>{eligibilityModalJob.maximumBacklogs ?? 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Allowed Branches:</span>
                  <span style={{ fontWeight: '600', maxWidth: '300px', textAlign: 'right' }}>
                    {eligibilityModalJob.eligibleDepartments || 'All Engineering Branches'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Eligible Graduation Batch:</span>
                  <span style={{ fontWeight: '600' }}>{eligibilityModalJob.graduationYear || 2025}</span>
                </div>
              </div>

              {eligibilityModalJob.eligibilityReasons && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    fontSize: '13px',
                  }}
                >
                  <strong>Why you didn't qualify:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                    {eligibilityModalJob.eligibilityReasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setEligibilityModalJob(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Job Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: '11px', color: 'var(--accent-sky)', fontWeight: '700' }}>
                  {selectedJob.companyName}
                </span>
                <h3 style={{ fontSize: '18px' }}>{selectedJob.title}</h3>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '20px',
                  padding: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ANNUAL CTC</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#34d399' }}>
                    ₹{selectedJob.packageLpa} LPA
                  </div>
                </div>
                <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '16px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>LOCATION</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedJob.location}</div>
                </div>
                <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '16px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DEADLINE</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedJob.deadline}</div>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '6px' }}>Job Overview</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {selectedJob.description}
                </p>
              </div>

              {selectedJob.requiredSkills && (
                <div style={{ marginBottom: '18px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '6px' }}>Required Technical Skills</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {selectedJob.requiredSkills}
                  </p>
                </div>
              )}

              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '6px' }}>Academic Requirements</h4>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  • Minimum CGPA: <strong>{selectedJob.minimumCgpa}</strong><br />
                  • Max Backlogs: <strong>{selectedJob.maximumBacklogs ?? 0}</strong><br />
                  • Eligible Branches: <strong>{selectedJob.eligibleDepartments}</strong>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedJob(null)}
              >
                Close
              </button>
              {appliedJobs.has(selectedJob.id) ? (
                <button className="btn btn-secondary" disabled>
                  ✓ Already Applied
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  disabled={!selectedJob.eligible || applying}
                  onClick={() => {
                    handleApply(selectedJob);
                    setSelectedJob(null);
                  }}
                >
                  <Sparkles size={14} /> Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
