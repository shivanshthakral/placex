import React, { useState, useEffect } from 'react';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { api } from '../../api/apiClient';
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  Bell,
  LogOut,
  ChevronDown,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  Briefcase
} from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const { currentUser, switchDemo, activeDemoKey, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 20000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  async function loadNotifications() {
    try {
      const data = await api.getNotifications();
      setNotifications(data || []);
      setUnreadCount((data || []).filter((n) => !n.read).length);
    } catch {
      // Backend maybe loading
    }
  }

  async function markAllRead() {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  }

  async function markSingleRead(id) {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // ignore
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'STUDENT':
        return <GraduationCap size={16} />;
      case 'RECRUITER':
        return <Building2 size={16} />;
      case 'PLACEMENT_OFFICER':
        return <ShieldCheck size={16} />;
      default:
        return <Sparkles size={16} />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'STUDENT':
        return 'Student Portal';
      case 'RECRUITER':
        return 'Recruiter Portal';
      case 'PLACEMENT_OFFICER':
        return 'Career Centre (Admin)';
      default:
        return 'Portal';
    }
  };

  return (
    <>
      {/* Universal Demo Switcher Bar */}
      <div className="demo-banner">
        <div className="demo-banner-left">
          <span className="demo-badge">
            <Sparkles size={11} /> SRM University Official Placement Drive
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            Interactive Demo Role Switcher:
          </span>
        </div>

        <div className="demo-role-switcher">
          {DEMO_USERS.map((demo) => (
            <button
              key={demo.key}
              className={`demo-role-btn ${activeDemoKey === demo.key ? 'active' : ''}`}
              onClick={() => switchDemo(demo.key)}
              title={`${demo.name} (${demo.role})`}
            >
              {getRoleIcon(demo.role)}
              <span>{demo.key === 'student' ? 'Student 1' : demo.key === 'student2' ? 'Student 2' : demo.key === 'recruiter' ? 'Google' : demo.key === 'recruiter2' ? 'Microsoft' : 'Admin'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background:
                  currentUser?.role === 'PLACEMENT_OFFICER'
                    ? 'rgba(99, 102, 241, 0.2)'
                    : currentUser?.role === 'RECRUITER'
                    ? 'rgba(6, 182, 212, 0.2)'
                    : 'rgba(16, 185, 129, 0.2)',
                color:
                  currentUser?.role === 'PLACEMENT_OFFICER'
                    ? '#a5b4fc'
                    : currentUser?.role === 'RECRUITER'
                    ? '#67e8f9'
                    : '#6ee7b7',
                border: '1px solid currentColor',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {getRoleIcon(currentUser?.role)}
              {getRoleLabel(currentUser?.role)}
            </span>
          </div>
        </div>

        <div className="header-actions">
          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-secondary"
              style={{
                padding: '9px',
                borderRadius: '50%',
                position: 'relative',
              }}
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowUserMenu(false);
              }}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifMenu && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '46px',
                  width: '360px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200,
                  overflow: 'hidden',
                  animation: 'scaleUp 0.15s ease',
                }}
              >
                <div
                  style={{
                    padding: '14px 18px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontWeight: '700', fontSize: '14px' }}>
                    Placement Alerts
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-sky)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '600',
                      }}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div
                      style={{
                        padding: '30px 20px',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '13px',
                      }}
                    >
                      No new placement notifications
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => markSingleRead(item.id)}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--border-subtle)',
                          background: item.read
                            ? 'transparent'
                            : 'rgba(99, 102, 241, 0.08)',
                          cursor: 'pointer',
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'flex-start',
                          transition: 'background var(--transition-fast)',
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: item.read ? 'transparent' : '#6366f1',
                            marginTop: '6px',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <p
                            style={{
                              fontSize: '13px',
                              fontWeight: item.read ? '500' : '700',
                              color: item.read ? 'var(--text-secondary)' : '#fff',
                              marginBottom: '3px',
                            }}
                          >
                            {item.title}
                          </p>
                          <p
                            style={{
                              fontSize: '12px',
                              color: 'var(--text-muted)',
                              lineHeight: '1.4',
                            }}
                          >
                            {item.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile dropdown */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <div
                className="user-profile-menu"
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifMenu(false);
                }}
              >
                <div className="user-avatar">
                  {currentUser.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase() || 'U'}
                </div>
                <div className="user-info">
                  <div className="user-name">{currentUser.name}</div>
                  <div className="user-role-tag">{currentUser.email}</div>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
              </div>

              {showUserMenu && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '52px',
                    width: '240px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 200,
                    padding: '8px',
                    animation: 'scaleUp 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid var(--border-subtle)',
                      marginBottom: '6px',
                    }}
                  >
                    <p style={{ fontWeight: '700', fontSize: '13px' }}>
                      {currentUser.name}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {currentUser.role}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      color: '#f87171',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'none')
                    }
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={onOpenAuth}>
              Sign In
            </button>
          )}
        </div>
      </header>
    </>
  );
}
