import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  GraduationCap,
  Award,
  Upload,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  Plus,
  X,
  Globe,
  Link,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';

export default function StudentProfile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Form editable fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    skills: '',
    linkedInUrl: '',
    githubUrl: '',
    cgpa: 0,
    backlogs: 0,
  });

  useEffect(() => {
    loadProfile();
  }, [currentUser]);

  async function loadProfile() {
    try {
      setLoading(true);
      const data = await api.getStudentProfile();
      setProfile(data);
      if (data) {
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          skills: data.skills || '',
          linkedInUrl: data.linkedInUrl || '',
          githubUrl: data.githubUrl || '',
          cgpa: data.cgpa || 0,
          backlogs: data.backlogs || 0,
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await api.updateStudentProfile(formData);
      setProfile(updated);
      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setFeedback({ type: 'error', message: 'Please upload a PDF file only' });
      return;
    }

    try {
      setUploading(true);
      const res = await api.uploadResume(file);
      setFeedback({ type: 'success', message: 'Resume uploaded and verified successfully!' });
      loadProfile();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to upload resume' });
    } finally {
      setUploading(false);
    }
  }

  const skillsList = formData.skills
    ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>Student Profile & Resume</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Your verified credentials visible to campus recruiting teams and the placement cell.
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
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid-2">
        {/* Left Column: Academic & Personal Form */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <User size={20} color="#818cf8" />
            <h3 style={{ fontSize: '18px' }}>Personal & Academic Records</h3>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
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
                <label className="form-label">Registration Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile?.registrationNumber || 'RA2111003010142'}
                  disabled
                  style={{ background: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-muted)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">College Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={currentUser?.email || ''}
                  disabled
                  style={{ background: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-muted)' }}
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Department / Branch</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile?.department || 'Computer Science & Engineering'}
                  disabled
                  style={{ background: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-muted)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Graduation Year</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile?.graduationYear || 2025}
                  disabled
                  style={{ background: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-muted)' }}
                />
              </div>
            </div>

            {/* Academic Scores Row */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <ShieldCheck size={16} color="#34d399" />
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                  University Controller of Examinations Verified Scores
                </span>
              </div>

              <div className="grid-3" style={{ gap: '12px', textAlign: 'center' }}>
                <div style={{ padding: '10px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CURRENT CGPA</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#34d399' }}>
                    {profile?.cgpa ? profile.cgpa.toFixed(2) : '9.35'}
                  </div>
                </div>

                <div style={{ padding: '10px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>10TH / 12TH %</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>
                    {profile?.tenthPercentage || 95}% / {profile?.twelfthPercentage || 94}%
                  </div>
                </div>

                <div style={{ padding: '10px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ACTIVE BACKLOGS</div>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '800',
                      color: profile?.backlogs === 0 ? '#34d399' : '#f87171',
                    }}
                  >
                    {profile?.backlogs ?? 0}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">LinkedIn Profile URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.linkedInUrl}
                  onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="form-group">
                <label className="form-label">GitHub Profile URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Right Column: Verified Resume PDF & Skills Manager */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Resume Upload / Download Card */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <FileText size={20} color="#818cf8" />
              <h3 style={{ fontSize: '18px' }}>Placement Resume PDF</h3>
            </div>

            {profile?.resumeFileName ? (
              <div
                style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#f87171',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                    }}
                  >
                    PDF
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', marginBottom: '2px' }}>
                      {profile.resumeFileName}
                    </h4>
                    <span style={{ fontSize: '12px', color: '#34d399', fontWeight: '600' }}>
                      ✓ Verified & Ready for Recruiters
                    </span>
                  </div>
                </div>

                <a
                  href={api.getResumeUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  <Download size={14} /> Download PDF
                </a>
              </div>
            ) : (
              <div
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-medium)',
                  marginBottom: '16px',
                }}
              >
                <AlertCircle size={32} color="#fbbf24" style={{ margin: '0 auto 10px' }} />
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  No resume attached yet. Upload your official placement resume (PDF, max 5MB).
                </p>
              </div>
            )}

            <div style={{ marginTop: '10px' }}>
              <label
                className="btn btn-secondary"
                style={{ width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Upload size={16} />
                {uploading ? 'Uploading PDF...' : 'Upload Updated Resume (PDF)'}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Skills Management */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={20} color="#818cf8" />
                <h3 style={{ fontSize: '18px' }}>Technical Skills</h3>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Add or Edit Skills (comma-separated)</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="Java, Spring Boot, React, Docker, Python, PostgreSQL, AWS..."
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {skillsList.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: '#c7d2fe',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12.5px',
                    fontWeight: '600',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
