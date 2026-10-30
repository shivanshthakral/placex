import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  GraduationCap,
  ExternalLink,
  Award
} from 'lucide-react';

export default function StudentRegistry() {
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [placementFilter, setPlacementFilter] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [studentsData, appsData] = await Promise.all([
        api.getAdminStudents(),
        api.getAdminApplications().catch(() => []),
      ]);
      setStudents(studentsData || []);
      setApplications(appsData || []);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  }

  // Determine if a student is placed by checking applications
  const getStudentPlacementStatus = (student) => {
    const studentApps = applications.filter((a) => a.studentId === student.id || a.studentEmail === student.email);
    const hasOffer = studentApps.some((a) => a.status === 'SELECTED');
    if (hasOffer) {
      const offerApp = studentApps.find((a) => a.status === 'SELECTED');
      return { status: 'PLACED', company: offerApp?.companyName, package: offerApp?.packageLpa };
    }
    const hasInterview = studentApps.some((a) => a.status === 'INTERVIEW_SCHEDULED' || a.status === 'SHORTLISTED');
    if (hasInterview) {
      return { status: 'IN_PIPELINE' };
    }
    return { status: 'UNPLACED' };
  };

  const filtered = students.filter((s) => {
    const matchSearch =
      (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.registrationNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.department || '').toLowerCase().includes(search.toLowerCase());

    const matchDept = deptFilter === 'ALL' || s.department === deptFilter;

    const pStatus = getStudentPlacementStatus(s).status;
    const matchPlacement = placementFilter === 'ALL' || pStatus === placementFilter;

    return matchSearch && matchDept && matchPlacement;
  });

  const uniqueDepts = Array.from(new Set(students.map((s) => s.department).filter(Boolean)));

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>SRM University Student Registry</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Master database of verified graduating scholars, academic track records, and campus placement standing.
        </p>
      </div>

      {/* Filter toolbar */}
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
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
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
            placeholder="Search by registration number, student name, or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: '200px' }}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="ALL">All Engineering Branches</option>
            {uniqueDepts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            className="form-select"
            style={{ width: '160px' }}
            value={placementFilter}
            onChange={(e) => setPlacementFilter(e.target.value)}
          >
            <option value="ALL">All Placement Status</option>
            <option value="PLACED">Placed (With Offer)</option>
            <option value="IN_PIPELINE">In Interview Pipeline</option>
            <option value="UNPLACED">Seeking Placement</option>
          </select>
        </div>
      </div>

      {/* Student Registry Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Registration No</th>
                <th>Student Scholar</th>
                <th>Department & Batch</th>
                <th>CGPA & Scores</th>
                <th>Backlogs</th>
                <th>Placement Standing</th>
                <th>Resume</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const placement = getStudentPlacementStatus(s);

                return (
                  <tr key={s.id}>
                    <td>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: '700',
                          color: 'var(--accent-sky)',
                          fontSize: '13px',
                        }}
                      >
                        {s.registrationNumber || 'RA2111003010142'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#fff' }}>{s.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.email}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px' }}>{s.department}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Class of {s.graduationYear || 2025}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                        {s.cgpa ? s.cgpa.toFixed(2) : '9.35'} CGPA
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        10th: {s.tenthPercentage}% • 12th: {s.twelfthPercentage}%
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: '700',
                          color: s.backlogs === 0 ? '#34d399' : '#f87171',
                        }}
                      >
                        {s.backlogs === 0 ? '0 (Clean Record)' : `${s.backlogs} Backlog`}
                      </span>
                    </td>
                    <td>
                      {placement.status === 'PLACED' ? (
                        <div>
                          <span className="badge badge-selected">
                            <Award size={12} /> Placed @ {placement.company}
                          </span>
                          <div style={{ fontSize: '11px', color: '#34d399', marginTop: '2px', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                            ₹{placement.package} LPA
                          </div>
                        </div>
                      ) : placement.status === 'IN_PIPELINE' ? (
                        <span className="badge badge-interview">
                          Interview Pipeline
                        </span>
                      ) : (
                        <span className="badge badge-applied">
                          Seeking Placement
                        </span>
                      )}
                    </td>
                    <td>
                      <a
                        href={api.getResumeUrl(s.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FileText size={14} color="#818cf8" /> Resume PDF
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
