import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  BookOpen,
  Sparkles
} from 'lucide-react';

export default function InterviewSchedule() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);

  async function loadInterviews() {
    try {
      setLoading(true);
      const data = await api.getStudentInterviews();
      setInterviews(data || []);
    } catch (err) {
      console.error('Failed to load interviews:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>Placement Interviews</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Schedule of your upcoming technical rounds, coding assessments, and meeting links.
        </p>
      </div>

      {interviews.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: '50px 20px', textAlign: 'center', color: 'var(--text-muted)' }}
        >
          <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
          <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '8px' }}>
            No Interviews Scheduled Right Now
          </h3>
          <p style={{ fontSize: '13px', maxWidth: '420px', margin: '0 auto' }}>
            Once a recruiter shortlists your application and schedules an interview round, it will appear here with the live meeting link.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {interviews.map((item) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                borderLeft: '4px solid #6366f1',
                padding: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '18px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        color: 'var(--accent-sky)',
                      }}
                    >
                      {item.companyName}
                    </span>
                    <span className="badge badge-interview">
                      <Video size={12} /> {item.mode || 'Virtual Round'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>
                    {item.jobTitle}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="#818cf8" />
                      {new Date(item.scheduledAt).toLocaleDateString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="#818cf8" />
                      {new Date(item.scheduledAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {item.locationOrMeetingLink && (
                  <a
                    href={item.locationOrMeetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ padding: '10px 20px' }}
                  >
                    <Video size={16} /> Enter Virtual Meeting
                  </a>
                )}
              </div>

              {/* Notes / Details Box */}
              {item.notes && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 18px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <strong style={{ color: '#fff' }}>Interviewer Instructions: </strong>
                  {item.notes}
                </div>
              )}
            </div>
          ))}

          {/* Placement Interview Checklist & Guidelines */}
          <div
            className="glass-card"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              marginTop: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <BookOpen size={18} color="#818cf8" />
              <h4 style={{ fontSize: '15px' }}>SRM University Campus Placement Guidelines</h4>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '14px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
              }}
            >
              <div>
                <span style={{ color: '#34d399', fontWeight: '700' }}>✓ Formal Attire: </span>
                Ensure college dress code or business formal for all virtual and offline interviews.
              </div>
              <div>
                <span style={{ color: '#34d399', fontWeight: '700' }}>✓ SRM ID Card: </span>
                Keep your college ID and government photo ID handy for identity verification.
              </div>
              <div>
                <span style={{ color: '#34d399', fontWeight: '700' }}>✓ Quiet Environment: </span>
                Join meetings 10 minutes prior with stable internet and functional webcam & microphone.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
