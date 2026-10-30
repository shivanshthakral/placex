import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import {
  Building2,
  Globe,
  MapPin,
  Save,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function CompanySettings() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    description: '',
  });

  useEffect(() => {
    loadCompany();
  }, []);

  async function loadCompany() {
    try {
      setLoading(true);
      const data = await api.getRecruiterCompany();
      setCompany(data);
      if (data) {
        setFormData({
          name: data.name || '',
          industry: data.industry || '',
          location: data.location || '',
          website: data.website || '',
          description: data.description || '',
        });
      }
    } catch (err) {
      console.error('Failed to load company profile:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await api.updateRecruiterCompany(formData);
      setCompany(updated);
      setFeedback({ type: 'success', text: 'Company profile updated successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to update company profile' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>Company Profile</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Details displayed to prospective university candidates during campus placement drives.
        </p>
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

      <div className="glass-card" style={{ maxWidth: '800px' }}>
        {/* Quick Autofill Presets */}
        <div style={{ marginBottom: '22px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Quick Company Profile Templates:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
            {[
              {
                name: 'Google',
                industry: 'Technology, Cloud & AI',
                location: 'Bangalore, Karnataka',
                website: 'https://careers.google.com',
                description: 'Global technology leader specializing in search, cloud infrastructure, AI models, and large-scale software engineering.',
              },
              {
                name: 'Microsoft',
                industry: 'Enterprise Software & Cloud AI',
                location: 'Hyderabad, Telangana',
                website: 'https://careers.microsoft.com',
                description: 'Enabling digital transformation for the era of an intelligent cloud and intelligent edge with Azure and enterprise software.',
              },
              {
                name: 'Atlassian',
                industry: 'Team Collaboration & Cloud SaaS',
                location: 'Bangalore, Karnataka',
                website: 'https://www.atlassian.com/company/careers',
                description: 'Makers of Jira, Confluence, and Trello. Building high-availability distributed software for global engineering teams.',
              },
              {
                name: 'NVIDIA',
                industry: 'Accelerated Computing & Generative AI',
                location: 'Pune & Bangalore',
                website: 'https://www.nvidia.com/careers',
                description: 'Pioneers in high-performance GPU hardware, CUDA compute architecture, and foundational AI model acceleration.',
              },
            ].map((preset) => (
              <button
                key={preset.name}
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() =>
                  setFormData({
                    name: preset.name,
                    industry: preset.industry,
                    location: preset.location,
                    website: preset.website,
                    description: preset.description,
                  })
                }
              >
                + {preset.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Industry Sector</label>
              <input
                type="text"
                className="form-input"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g. Technology & Cloud, Enterprise Software"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Headquarters / Office Location</label>
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
            <label className="form-label">Company Overview</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a brief overview of your business, engineering culture, and campus opportunities..."
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
