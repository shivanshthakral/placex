import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Student Portal Views
import StudentDashboard from './components/student/StudentDashboard';
import JobDiscovery from './components/student/JobDiscovery';
import MyApplications from './components/student/MyApplications';
import InterviewSchedule from './components/student/InterviewSchedule';
import StudentProfile from './components/student/StudentProfile';

// Recruiter Portal Views
import RecruiterDashboard from './components/recruiter/RecruiterDashboard';
import JobManagement from './components/recruiter/JobManagement';
import ApplicantReview from './components/recruiter/ApplicantReview';
import CompanySettings from './components/recruiter/CompanySettings';

// Placement Officer (Admin) Portal Views
import AdminDashboard from './components/admin/AdminDashboard';
import StudentRegistry from './components/admin/StudentRegistry';
import CompanyDrives from './components/admin/CompanyDrives';
import MasterApplications from './components/admin/MasterApplications';
import PlacementReports from './components/admin/PlacementReports';

// Auth
import LoginModal from './components/auth/LoginModal';

function MainApp() {
  const { currentUser, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('student-dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Auto-switch default tab when user/role changes
  useEffect(() => {
    if (currentUser?.role === 'STUDENT') {
      setActiveTab('student-dashboard');
    } else if (currentUser?.role === 'RECRUITER') {
      setActiveTab('recruiter-dashboard');
    } else if (currentUser?.role === 'PLACEMENT_OFFICER') {
      setActiveTab('admin-dashboard');
    }
  }, [currentUser?.role]);

  const renderActiveView = () => {
    const role = currentUser?.role;

    if (role === 'STUDENT') {
      switch (activeTab) {
        case 'student-dashboard':
          return <StudentDashboard onNavigate={setActiveTab} />;
        case 'student-jobs':
          return <JobDiscovery onApplied={() => {}} />;
        case 'student-applications':
          return <MyApplications onNavigateInterviews={() => setActiveTab('student-interviews')} />;
        case 'student-interviews':
          return <InterviewSchedule />;
        case 'student-profile':
          return <StudentProfile />;
        default:
          return <StudentDashboard onNavigate={setActiveTab} />;
      }
    }

    if (role === 'RECRUITER') {
      switch (activeTab) {
        case 'recruiter-dashboard':
          return <RecruiterDashboard onNavigate={setActiveTab} />;
        case 'recruiter-jobs':
          return <JobManagement onNavigateApplicants={() => setActiveTab('recruiter-applicants')} />;
        case 'recruiter-applicants':
          return <ApplicantReview />;
        case 'recruiter-company':
          return <CompanySettings />;
        default:
          return <RecruiterDashboard onNavigate={setActiveTab} />;
      }
    }

    if (role === 'PLACEMENT_OFFICER') {
      switch (activeTab) {
        case 'admin-dashboard':
          return <AdminDashboard onNavigate={setActiveTab} />;
        case 'admin-students':
          return <StudentRegistry />;
        case 'admin-companies':
          return <CompanyDrives />;
        case 'admin-applications':
          return <MasterApplications />;
        case 'admin-reports':
          return <PlacementReports />;
        default:
          return <AdminDashboard onNavigate={setActiveTab} />;
      }
    }

    // Default fallback
    return <StudentDashboard onNavigate={setActiveTab} />;
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        <Navbar onOpenAuth={() => setIsAuthOpen(true)} />
        <main className="page-body">{renderActiveView()}</main>
      </div>

      <LoginModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
