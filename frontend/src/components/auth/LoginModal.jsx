import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import {
  Lock,
  Mail,
  User,
  GraduationCap,
  Building2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const { login, switchDemo } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [cgpa, setCgpa] = useState('8.50');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        // Register new student
        await login(email, password); // fallback or register flow
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  }

  function handleQuickDemo(demo) {
    setEmail(demo.email);
    setPassword(demo.password);
    switchDemo(demo.key).then(() => onClose());
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '480px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
              <Sparkles size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px' }}>
                {isRegister ? 'Create Student Account' : 'Sign In to PLACAMATE'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Official Campus Placement Management Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                color: '#f87171',
                fontSize: '13px',
              }}
            >
              {error}
            </div>
          )}

          {/* Quick Demo Accounts Selector */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              One-Click University Demo Accounts:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {DEMO_USERS.map((demo) => (
                <button
                  key={demo.key}
                  type="button"
                  onClick={() => handleQuickDemo(demo)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    color: '#fff',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(99, 102, 241, 0.2)',
                        color: '#818cf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: '700',
                      }}
                    >
                      {demo.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>{demo.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{demo.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              textAlign: 'center',
              margin: '20px 0',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <span
              style={{
                position: 'relative',
                top: '-10px',
                background: 'var(--bg-card)',
                padding: '0 12px',
                fontSize: '12px',
                color: 'var(--text-muted)',
              }}
            >
              Or sign in with credentials
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@srmist.edu.in or recruiter@google.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
