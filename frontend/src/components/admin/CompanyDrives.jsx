import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import {
  Building2,
  Briefcase,
  ExternalLink,
  MapPin,
  Calendar,
  Users,
  Award,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Globe,
  TrendingUp,
  Building
} from 'lucide-react';

const COMPANY_PRESETS = [
  {
    name: 'Atlassian',
    industry: 'Enterprise Cloud & Team Collaboration',
    location: 'Bangalore, Karnataka',
    website: 'https://www.atlassian.com/company/careers',
    description: 'Makers of Jira, Confluence, and Bitbucket. Building software to unleash the potential in every team with modern distributed systems.',
  },
  {
    name: 'Goldman Sachs',
    industry: 'Global Investment Banking & Financial Technology',
    location: 'Bangalore, Karnataka',
    website: 'https://www.goldmansachs.com/careers',
    description: 'Global financial institution deploying high-frequency trading platforms, risk analytics, and quant computing infrastructure.',
  },
  {
    name: 'NVIDIA',
    industry: 'Accelerated Computing & Generative AI',
    location: 'Pune & Bangalore',
    website: 'https://www.nvidia.com/en-us/about-nvidia/careers',
    description: 'Pioneers in GPU computing and deep learning platforms powering generative AI, autonomous robotics, and graphics virtualization.',
  },
  {
    name: 'Adobe Systems',
    industry: 'Digital Media & Generative Creative Cloud',
    location: 'Noida & Bangalore',
    website: 'https://www.adobe.com/careers.html',
    description: 'Global leader in digital experiences, Photoshop, Firefly generative AI, and enterprise experience cloud platforms.',
  },
  {
    name: 'Cisco Systems',
    industry: 'Enterprise Networking & Cyber Security',
    location: 'Bangalore, Karnataka',
    website: 'https://jobs.cisco.com',
    description: 'Worldwide leader in secure networking, zero-trust cloud security, and high-throughput optical telecommunications routing.',
  },
];

export default function CompanyDrives() {
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('ALL');
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    description: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [compData, jobsData] = await Promise.all([
        api.getAdminCompanies(),
        api.getAdminJobs(),
      ]);
      setCompanies(compData || []);
      setJobs(jobsData || []);
    } catch (err) {
      console.error('Failed to load companies & drives:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectPreset(preset) {
    setFormData({
      name: preset.name,
      industry: preset.industry,
      location: preset.location,
      website: preset.website,
      description: preset.description,
    });
  }

  async function handleAddCompany(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      const newComp = await api.createCompany(formData);
      setFeedback({
        type: 'success',
        text: `Successfully registered "${formData.name}" as an official visiting corporate partner!`,
      });
      setShowAddModal(false);
      setFormData({
        name: '',
        industry: '',
        location: '',
        website: '',
        description: '',
      });
      loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to add company' });
    } finally {
      setSubmitting(false);
    }
  }

  const filtered = companies.filter((comp) => {
    const matchSearch =
      (comp.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (comp.industry || '').toLowerCase().includes(search.toLowerCase()) ||
      (comp.location || '').toLowerCase().includes(search.toLowerCase());

    const matchIndustry = industryFilter === 'ALL' || comp.industry === industryFilter;
    return matchSearch && matchIndustry;
  });

  const uniqueIndustries = Array.from(new Set(companies.map((c) => c.industry).filter(Boolean)));
  const totalJobsCount = jobs.length;
  const totalApplicantsCount = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0);

  return (
    <div>
      {/* Page Header with Action Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--accent-sky)',
                background: 'rgba(6, 182, 212, 0.15)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Corporate Relations & Campus Drives
            </span>
          </div>
          <h2 style={{ fontSize: '26px' }}>Visiting Corporate Partners</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Official list of registered tech firms and recruiters participating in SRM University placements.
          </p>
        </div>

        <button
          className="btn btn-primary"
          style={{ padding: '12px 22px', fontSize: '14.5px' }}
          onClick={() => setShowAddModal(true)}
        >
          <PlusCircle size={18} /> Register / Add Visiting Company
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '16px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Metric Tiles Summary */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <div className="stat-tile">
          <div>
            <div className="stat-label">Registered Corporate Partners</div>
            <div className="stat-value">{companies.length}</div>
            <div className="stat-sub">Active corporate accounts</div>
          </div>
          <div className="stat-icon cyan">
            <Building2 size={24} />
          </div>
        </div>

        <div className="stat-tile">
          <div>
            <div className="stat-label">Published Campus Drives</div>
            <div className="stat-value">{totalJobsCount}</div>
            <div className="stat-sub">Across Super Dream & Dream</div>
          </div>
          <div className="stat-icon indigo">
            <Briefcase size={24} />
          </div>
        </div>

        <div className="stat-tile">
          <div>
            <div className="stat-label">Total Student Applications</div>
            <div className="stat-value" style={{ color: '#34d399' }}>{totalApplicantsCount}</div>
            <div className="stat-sub">Submitted to corporate drives</div>
          </div>
          <div className="stat-icon emerald">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
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
            placeholder="Search by company name, location, or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            className="form-select"
            style={{ width: '220px' }}
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
          >
            <option value="ALL">All Industry Sectors</option>
            {uniqueIndustries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>

          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {filtered.length} Partners
          </span>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid-2">
        {filtered.map((comp) => {
          const compJobs = jobs.filter((j) => j.companyId === comp.id || j.companyName === comp.name);

          // Generate gradient based on company name hash
          const gradients = [
            'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
            'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
          ];
          const grad = gradients[Math.abs(comp.name?.charCodeAt(0) || 0) % gradients.length];

          return (
            <div key={comp.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: 'var(--radius-md)',
                        background: grad,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: '800',
                        fontSize: '20px',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                      }}
                    >
                      {comp.name?.[0] || 'C'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px' }}>{comp.name}</h3>
                      <p style={{ fontSize: '12px', color: 'var(--accent-sky)', fontWeight: '600' }}>
                        {comp.industry || 'Technology & Cloud'}
                      </p>
                    </div>
                  </div>

                  {comp.website && (
                    <a
                      href={comp.website}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      title="Visit official careers website"
                    >
                      <ExternalLink size={14} /> Website
                    </a>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  <MapPin size={14} color="#94a3b8" />
                  <span>{comp.location || 'Pan India / Global'}</span>
                </div>

                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                    marginBottom: '18px',
                  }}
                >
                  {comp.description}
                </p>
              </div>

              {/* Active Campus Drives sub-section */}
              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '16px',
                  marginTop: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: '700',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Campus Drives ({compJobs.length})
                  </span>
                  {compJobs.length > 0 && (
                    <span style={{ fontSize: '11px', color: '#34d399', fontWeight: '600' }}>
                      ✓ Open for Batch of 2025
                    </span>
                  )}
                </div>

                {compJobs.length === 0 ? (
                  <div
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    No active job drives posted yet for this partner.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {compJobs.map((job) => (
                      <div
                        key={job.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#fff' }}>
                            {job.title}
                          </span>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Cutoff: {job.minimumCgpa} CGPA • {job.applicantCount || 0} Applied
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: '800',
                            color: '#34d399',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          ₹{job.packageLpa} LPA
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Register New Visiting Company Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#818cf8',
                  }}
                >
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px' }}>Register Visiting Company</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Add a corporate recruiting partner to the university placement registry
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCompany}>
              <div className="modal-body">
                {/* 1-Click Company Template Selector */}
                <div style={{ marginBottom: '18px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '8px',
                    }}
                  >
                    <Sparkles size={13} color="#818cf8" /> One-Click Company Pre-fill Presets:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {COMPANY_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        style={{
                          background: formData.name === preset.name ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
                          color: formData.name === preset.name ? '#fff' : 'var(--text-secondary)',
                          border: '1px solid',
                          borderColor: formData.name === preset.name ? 'var(--accent-primary)' : 'var(--border-subtle)',
                          borderRadius: 'var(--radius-full)',
                          padding: '5px 12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        + {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Company Legal Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Atlassian, Goldman Sachs, NVIDIA"
                    required
                  />
                </div>

                <div className="grid-2" style={{ gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Industry / Sector</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="e.g. Cloud Software, AI Research, FinTech"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Office Location / Headquarters</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Bangalore, Karnataka"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Careers Website URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://careers.company.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company Overview & Culture Description</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the corporate partner for graduating students..."
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Registering...' : 'Register Corporate Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
