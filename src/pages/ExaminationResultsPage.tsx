import React from 'react';

interface ExaminationResultsPageProps {
  onBack: () => void;
  userProfile?: {
    firstName?: string;
    lastName?: string;
    uid?: string;
  } | null;
}

const sampleExams = [
  {
    id: 'exam-01',
    name: 'Knowledge Recency Exam',
    date: 'Mar 04, 2026',
    overall: 92,
    status: 'Verified',
    sections: [
      { label: 'Systems & Performance', score: 94 },
      { label: 'Meteorology', score: 88 },
      { label: 'Flight Planning', score: 95 }
    ]
  },
  {
    id: 'exam-02',
    name: 'Mentorship Observation Assessment',
    date: 'Feb 21, 2026',
    overall: 87,
    status: 'Verified',
    sections: [
      { label: 'CRM & Leadership', score: 90 },
      { label: 'Scenario Analysis', score: 84 },
      { label: 'Peer Consultation', score: 88 }
    ]
  }
];

const ExaminationResultsPage: React.FC<ExaminationResultsPageProps> = ({ onBack, userProfile }) => {
  const currentExam = sampleExams[0];
  const fullName = `${userProfile?.firstName || 'Benjamin'} ${userProfile?.lastName || 'Bowler'}`.trim();

  return (
    <div className="dashboard-container animate-fade-in">
      <main className="dashboard-card" style={{ position: 'relative' }}>
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: '#475569',
            fontWeight: 500
          }}
        >
          ← Back to Recognition
        </button>

        <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
          <div className="dashboard-logo" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '200px' }} />
          </div>
          <div className="dashboard-subtitle" style={{ letterSpacing: '0.3em' }}>VERIFIED EXAMINATION RESULTS</div>
          <h1 className="dashboard-title" style={{ marginBottom: '0.5rem' }}>Examination Directory</h1>
          <p style={{ maxWidth: '40rem', margin: '0 auto', color: '#475569' }}>
            Centralized record of your proctored examinations, knowledge recency checks, and mentorship assessments. These
            scores are visible to WingMentor recruiters and airline partners.
          </p>
        </div>

        <section className="dashboard-section" style={{ marginBottom: '1.5rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(226,232,240,0.8)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem'
          }}>
            {[{
              label: 'Candidate',
              value: fullName
            }, {
              label: 'Latest Exam Score',
              value: `${currentExam.overall}%`
            }, {
              label: 'Exams Verified',
              value: sampleExams.length.toString()
            }, {
              label: 'Status',
              value: currentExam.status
            }].map(card => (
              <div key={card.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>{card.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{card.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section" style={{ marginBottom: '2rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: '0 15px 40px rgba(15,23,42,0.08)',
            border: '1px solid rgba(226,232,240,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Exam Archive</p>
                <h2 style={{ margin: '0.35rem 0 0', fontSize: '1.25rem', color: '#0f172a' }}>Verified Examinations</h2>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>All times UTC</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', letterSpacing: '0.15em' }}>
                    {['Exam', 'Date', 'Overall Score', 'Status', 'Sections'].map(header => (
                      <th key={header} style={{ padding: '0.75rem 0.5rem' }}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleExams.map(exam => (
                    <tr key={exam.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.9rem 0.5rem', fontWeight: 600, color: '#0f172a' }}>{exam.name}</td>
                      <td style={{ padding: '0.9rem 0.5rem', color: '#475569' }}>{exam.date}</td>
                      <td style={{ padding: '0.9rem 0.5rem', fontWeight: 700, color: exam.overall >= 85 ? '#10b981' : '#f97316' }}>{exam.overall}%</td>
                      <td style={{ padding: '0.9rem 0.5rem', color: '#475569' }}>{exam.status}</td>
                      <td style={{ padding: '0.9rem 0.5rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {exam.sections.map(section => (
                            <span key={section.label} style={{
                              padding: '0.25rem 0.65rem',
                              borderRadius: '999px',
                              background: 'rgba(37,99,235,0.08)',
                              color: '#2563eb',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}>
                              {section.label}: {section.score}%
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: '0 15px 40px rgba(15,23,42,0.08)',
            border: '1px solid rgba(226,232,240,0.8)'
          }}>
            <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Latest Exam Breakdown</p>
            <h2 style={{ margin: '0.35rem 0 1rem', fontSize: '1.3rem', color: '#0f172a' }}>{currentExam.name}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {currentExam.sections.map(section => (
                <div key={section.label} style={{
                  borderRadius: '16px',
                  padding: '1rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>{section.label}</p>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: section.score >= 85 ? '#10b981' : '#f97316' }}>{section.score}%</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ExaminationResultsPage;
