import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  UserCheck,
  Building,
  Users,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Send,
  Sliders,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser } = useAuth();
  const role = currentUser?.role;

  const renderNavItems = () => {
    if (role === 'STUDENT') {
      return (
        <>
          <div className="sidebar-section-title">Student Portal</div>
          <button
            className={`nav-item ${activeTab === 'student-dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('student-dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'student-jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('student-jobs')}
          >
            <Briefcase size={18} />
            <span>Campus Job Drives</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'student-applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('student-applications')}
          >
            <Send size={18} />
            <span>My Applications</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'student-interviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('student-interviews')}
          >
            <Calendar size={18} />
            <span>Interviews</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'student-profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('student-profile')}
          >
            <FileText size={18} />
            <span>Resume & Profile</span>
          </button>
        </>
      );
    }

    if (role === 'RECRUITER') {
      return (
        <>
          <div className="sidebar-section-title">Recruiter Portal</div>
          <button
            className={`nav-item ${activeTab === 'recruiter-dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('recruiter-dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Talent Pipeline</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'recruiter-jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('recruiter-jobs')}
          >
            <Briefcase size={18} />
            <span>Manage Job Postings</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'recruiter-applicants' ? 'active' : ''}`}
            onClick={() => setActiveTab('recruiter-applicants')}
          >
            <Users size={18} />
            <span>Candidate Review & ATS</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'recruiter-company' ? 'active' : ''}`}
            onClick={() => setActiveTab('recruiter-company')}
          >
            <Building size={18} />
            <span>Company Profile</span>
          </button>
        </>
      );
    }

    if (role === 'PLACEMENT_OFFICER') {
      return (
        <>
          <div className="sidebar-section-title">Career Centre (SRM)</div>
          <button
            className={`nav-item ${activeTab === 'admin-dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin-dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Command Centre</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'admin-students' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin-students')}
          >
            <UserCheck size={18} />
            <span>Student Registry</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'admin-companies' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin-companies')}
          >
            <Building size={18} />
            <span>Visiting Companies</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'admin-applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin-applications')}
          >
            <Send size={18} />
            <span>Campus Applications</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'admin-reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin-reports')}
          >
            <BarChart3 size={18} />
            <span>Placement Analytics</span>
          </button>
        </>
      );
    }

    return null;
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Sparkles size={22} />
        </div>
        <div className="brand-text">
          <h1>PLACAMATE</h1>
          <span>Career Platform</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {renderNavItems()}

        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={16} color="#818cf8" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#c7d2fe' }}>
                SRM IST Placements
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Official Academic Portal 2025. Integrated eligibility engine & ATS.
            </p>
          </div>
        </div>
      </nav>
    </aside>
  );
}
