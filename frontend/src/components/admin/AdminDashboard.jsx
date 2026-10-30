import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import {
  Users,
  Building,
  Briefcase,
  Award,
  TrendingUp,
  Percent,
  DollarSign,
  CheckCircle2,
  PieChart,
  BarChart2,
  ShieldCheck,
  Download
} from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const data = await api.getAdminDashboard();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  const deptData = [
    { name: 'Computer Science & Engineering', placed: 88, total: 100, rate: 88 },
    { name: 'Information Technology', placed: 92, total: 100, rate: 92 },
    { name: 'CSE (AI & Machine Learning)', placed: 85, total: 100, rate: 85 },
    { name: 'Electronics & Communication', placed: 74, total: 100, rate: 74 },
  ];

  const ctcTiers = [
    { label: 'Super Dream (> ₹20 LPA)', count: 2, pct: '33%', color: '#a855f7' },
    { label: 'Dream (₹10 - ₹20 LPA)', count: 2, pct: '33%', color: '#3b82f6' },
    { label: 'Regular (≤ ₹10 LPA)', count: 2, pct: '34%', color: '#10b981' },
  ];

  return (
    <div>
      {/* University Command Centre Header */}
      <div
        className="glass-card"
        style={{
          background:
            'linear-gradient(135deg, rgba(49, 46, 129, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          marginBottom: '28px',
          padding: '28px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  background: 'rgba(99, 102, 241, 0.25)',
                  color: '#c7d2fe',
                  border: '1px solid rgba(99, 102, 241, 0.45)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.04em',
                }}
              >
                SRM IST CAREER CENTRE • CENTRAL COMMAND
              </span>
            </div>
            <h2 style={{ fontSize: '26px', marginBottom: '6px' }}>
              Campus Placement Command Centre
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '620px' }}>
              Official university monitoring portal for batch of 2025 campus recruitment drives, company relations, and candidate status verification.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => onNavigate('admin-companies')}
            >
              <Building size={16} /> + Register Company
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => onNavigate('admin-students')}
            >
              <Users size={16} /> Student Registry
            </button>
            <button
              className="btn btn-primary"
              onClick={() => onNavigate('admin-reports')}
            >
              <Download size={16} /> Export Placement Report
            </button>
          </div>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <div className="stat-tile" style={{ cursor: 'pointer' }} onClick={() => onNavigate('admin-students')}>
          <div>
            <div className="stat-label">Registered Final Year Students</div>
            <div className="stat-value">{stats?.totalStudents || 4}</div>
            <div className="stat-sub">100% profile verification rate</div>
          </div>
          <div className="stat-icon indigo">
            <Users size={24} />
          </div>
        </div>

        <div className="stat-tile" style={{ cursor: 'pointer' }} onClick={() => onNavigate('admin-companies')}>
          <div>
            <div className="stat-label">Visiting Corporate Partners</div>
            <div className="stat-value">{stats?.totalCompanies || 4}</div>
            <div className="stat-sub" style={{ color: 'var(--accent-sky)', fontWeight: '600' }}>
              + Add / View Companies →
            </div>
          </div>
          <div className="stat-icon cyan">
            <Building size={24} />
          </div>
        </div>

        <div className="stat-tile">
          <div>
            <div className="stat-label">Highest Campus Offer</div>
            <div className="stat-value" style={{ color: '#34d399' }}>
              ₹{stats?.highestPackageLpa || 28.5} LPA
            </div>
            <div className="stat-sub">
              <span style={{ color: '#c084fc', fontWeight: '700' }}>Google (Super Dream)</span>
            </div>
          </div>
          <div className="stat-icon emerald">
            <Award size={24} />
          </div>
        </div>

        <div className="stat-tile">
          <div>
            <div className="stat-label">Average CTC Package</div>
            <div className="stat-value">
              ₹{stats?.averagePackageLpa ? stats.averagePackageLpa.toFixed(1) : '19.5'} LPA
            </div>
            <div className="stat-sub">
              <span style={{ color: '#34d399', fontWeight: '600' }}>+18.4% vs Previous Batch</span>
            </div>
          </div>
          <div className="stat-icon amber">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* 2 Column: Department-wise Placement Rate & CTC Tier Distribution */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {/* Department Placement Performance */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Department Placement Performance</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Batch of 2025 placement absorption across engineering streams
              </p>
            </div>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              84.5% University Avg
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {deptData.map((dept) => (
              <div key={dept.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#fff', fontWeight: '500' }}>{dept.name}</span>
                  <span style={{ color: '#34d399', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                    {dept.rate}% Placed
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${dept.rate}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #6366f1, #38bdf8)',
                      borderRadius: 'var(--radius-full)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTC Package Tier Breakdown */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>CTC Compensation Tiers</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Salary package bracket breakdown for campus offers
              </p>
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Total: {stats?.totalOffers || 2} Offers
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {ctcTiers.map((tier) => (
              <div
                key={tier.label}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: tier.color,
                      boxShadow: `0 0 10px ${tier.color}`,
                    }}
                  />
                  <div>
                    <h4 style={{ fontSize: '14px', marginBottom: '2px' }}>{tier.label}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Industry benchmark bracket
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '800',
                      color: tier.color,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {tier.pct}
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
