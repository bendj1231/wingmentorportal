import React, { useState, useEffect } from 'react';
import { Icons } from '../App';
import type { UserProfile } from '../types/user';
import { RecognitionAchievementPage } from './RecognitionAchievementPage';
import { PilotProfilePage } from './PilotProfilePage';
import FoundationalProgramPage from './FoundationalProgramPage';
import { TransitionProgramPage } from './TransitionProgramPage';
import ContactPage from './ContactPage';
import { ATPLPathwayPage } from './ATPLPathwayPage';
import { PrivateSectorPathwayPage } from './PrivateSectorPathwayPage';
import LogbookPage from './LogbookPage';
import ExaminationResultsPage from './ExaminationResultsPage';
import AtlasResumePage from './AtlasResumePage';
import PrintableResumePage from './PrintableResumePage';
import { DigitalLogbookPage } from './DigitalLogbookPage';
import { PathwayCarousel } from '../components/PathwayCarousel';
import { getUserTrack, getTrackConfig, canAccessPage, getRedirectPage } from '../config/accessControl';

interface WingMentorHomeProps {
  onLogout: () => void;
  userProfile?: UserProfile | null;
}

type MainView = 
  | 'dashboard'
  | 'programs' 
  | 'pathways'
  | 'applications'
  | 'recognition'
  | 'pilot-portfolio'
  | 'foundational'
  | 'transition'
  | 'pilot-profile'
  | 'contact'
  | 'wingmentor-network'
  | 'atpl-pathway'
  | 'private-sector'
  | 'examination-results'
  | 'logbook'
  | 'digital-logbook'
  | 'atlas-resume'
  | 'printable-resume';

const pathwayUpdates = [
  {
    title: 'Emirates ATPL Applications Open',
    summary: 'New cadet program cohort starting Q2 2024 with enhanced training curriculum.'
  },
  {
    title: 'Cargo Pathway Industry Partnerships',
    summary: 'Major cargo carriers offering guaranteed interviews for pathway graduates.'
  },
  {
    title: 'Flight Instructor Scholarships',
    summary: 'New funding opportunities for CFI candidates with structured mentorship.'
  }
];

export const WingMentorHome: React.FC<WingMentorHomeProps> = ({ onLogout, userProfile }) => {
  const [mainView, setMainView] = useState<MainView>('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const SIDEBAR_BASE_WIDTH = 520;
  const SIDEBAR_BASE_HEIGHT = 980;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [sidebarScale, setSidebarScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const widthScale = window.innerWidth / 1400;
      const heightScale = window.innerHeight / SIDEBAR_BASE_HEIGHT;
      const nextScale = Math.min(1, Math.max(0.65, Math.min(widthScale, heightScale)));
      setSidebarScale(nextScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userDisplayName = (userProfile?.displayName && userProfile.displayName.trim())
    || [userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(' ').trim()
    || userProfile?.email
    || 'Pilot';
  const userFirstName = userProfile?.firstName?.trim() || userDisplayName.split(' ')[0] || 'Pilot';
  const handleAccessWebsite = () => {
    window.open('https://wingmentor.app', '_blank', 'noopener,noreferrer');
  };

  // Sidebar component - HubPage cards only with logo
  const Sidebar = () => {
    const scaledSidebarWidth = SIDEBAR_BASE_WIDTH * sidebarScale;
    return (
      <div style={{
        width: `${scaledSidebarWidth}px`,
        height: '100vh',
        overflow: 'hidden',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 10,
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)'
      }}>
        <div
          className="dashboard-container animate-fade-in"
          style={{
            transform: `scale(${sidebarScale})`,
            transformOrigin: 'top left',
            width: `${SIDEBAR_BASE_WIDTH}px`,
            height: `${SIDEBAR_BASE_HEIGHT}px`,
            padding: 0
          }}
        >
        <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', padding: '1rem' }}>
          <button className="platform-logout-btn" onClick={onLogout}>
            <Icons.LogOut style={{ width: 16, height: 16 }} />
            Logout
          </button>
          
          {/* Sidebar Logo */}
          <div className="dashboard-header" style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
            <div className="dashboard-logo" style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
              <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '200px' }} />
            </div>
            <div className="dashboard-subtitle">CONNECTING PILOTS TO THE INDUSTRY</div>
          </div>

          <section className="dashboard-section" style={{ marginTop: '0.5rem' }}>
            <div className="cards-list">
              <div 
                className={`horizontal-card ${mainView === 'applications' ? 'active' : ''}`} 
                style={{ 
                  cursor: 'pointer', 
                  padding: '0.75rem 1.5rem',
                  border: mainView === 'applications' ? '2px solid #0ea5e9' : 'none',
                  minHeight: '80px'
                }} 
                onClick={() => setMainView('applications')}
              >
                <div className="horizontal-card-content-wrapper">
                  <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.25rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                    <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                      <h3 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pilot Portfolio</h3>
                      <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '0.875rem', lineHeight: 1.4 }}>
                        Flight logs, training records, and documents
                      </p>
                    </div>
                  </div>
                  <div className="hub-card-arrow">
                    <Icons.ArrowRight style={{ width: 20, height: 20 }} />
                  </div>
                </div>
                <img src="/Captain-Paperwork-Medium.jpg" alt="Pilot Portfolio" className="hub-card-bg-image" style={{ width: '35%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              </div>

              <div 
                className={`horizontal-card ${mainView === 'programs' ? 'active' : ''}`} 
                style={{ 
                  cursor: 'pointer', 
                  padding: '0.75rem 1.5rem',
                  border: mainView === 'programs' ? '2px solid #0ea5e9' : 'none',
                  minHeight: '80px'
                }} 
                onClick={() => setMainView('programs')}
              >
                <div className="horizontal-card-content-wrapper">
                  <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.25rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                    <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                      <h3 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Programs</h3>
                      <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '0.875rem', lineHeight: 1.4 }}>
                        Foundational and Transition mentorship programs
                      </p>
                    </div>
                  </div>
                  <div className="hub-card-arrow">
                    <Icons.ArrowRight style={{ width: 20, height: 20 }} />
                  </div>
                </div>
                <img src="/Gemini_Generated_Image_7awns87awns87awn.png" alt="Programs" className="hub-card-bg-image" style={{ width: '35%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              </div>

              <div 
                className={`horizontal-card ${mainView === 'pathways' ? 'active' : ''}`} 
                style={{ 
                  cursor: 'pointer', 
                  padding: '0.75rem 1.5rem',
                  border: mainView === 'pathways' ? '2px solid #0ea5e9' : 'none',
                  minHeight: '80px'
                }} 
                onClick={() => setMainView('pathways')}
              >
                <div className="horizontal-card-content-wrapper">
                  <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.25rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                    <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                      <h3 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pathways</h3>
                      <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '0.875rem', lineHeight: 1.4 }}>
                        Structured career roadmaps and training tracks
                      </p>
                    </div>
                  </div>
                  <div className="hub-card-arrow">
                    <Icons.ArrowRight style={{ width: 20, height: 20 }} />
                  </div>
                </div>
                <img src="/shutterstock_1698112222.jpg" alt="Pathways" className="hub-card-bg-image" style={{ width: '35%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              </div>

              <div 
                className={`horizontal-card ${mainView === 'recognition' ? 'active' : ''}`} 
                style={{ 
                  cursor: 'pointer', 
                  padding: '0.75rem 1.5rem',
                  border: mainView === 'recognition' ? '2px solid #0ea5e9' : 'none',
                  minHeight: '80px'
                }} 
                onClick={() => setMainView('recognition')}
              >
                <div className="horizontal-card-content-wrapper">
                  <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.25rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                    <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                      <h3 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recognition & Achievements</h3>
                      <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '0.875rem', lineHeight: 1.4 }}>
                        Awards, flight hours, and certifications
                      </p>
                    </div>
                  </div>
                  <div className="hub-card-arrow">
                    <Icons.ArrowRight style={{ width: 20, height: 20 }} />
                  </div>
                </div>
                <img src="/Gemini_Generated_Image_tka3njtka3njtka3.png" alt="Recognition & Achievements" className="hub-card-bg-image" style={{ width: '35%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              </div>

              {/* WingMentor Network Directory Card */}
              <div 
                className={`horizontal-card ${mainView === 'wingmentor-network' ? 'active' : ''}`} 
                style={{ 
                  cursor: 'pointer', 
                  padding: '0.75rem 1.5rem',
                  border: mainView === 'wingmentor-network' ? '2px solid #0ea5e9' : 'none',
                  minHeight: '80px'
                }} 
                onClick={() => setMainView('wingmentor-network')}
              >
                <div className="horizontal-card-content-wrapper">
                  <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.25rem', color: '#000000', fontWeight: 'bold' }}>•</div>
                    <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                      <h3 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>WingMentor Network</h3>
                      <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '0.875rem', lineHeight: 1.4 }}>
                        Recognition hub, knowledge bank, and aviation community
                      </p>
                    </div>
                  </div>
                  <div className="hub-card-arrow">
                    <Icons.ArrowRight style={{ width: 20, height: 20 }} />
                  </div>
                </div>
                <img src="https://images.unsplash.com/photo-1451187580453-4082a83e6d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="WingMentor Network" className="hub-card-bg-image" style={{ width: '35%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              </div>
            </div>
          </section>
        </div>
        </div>
      </div>
    );
  };

  // Programs View Component
  const ProgramsView = () => {
    const [activeUpdate, setActiveUpdate] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setActiveUpdate((prev) => (prev + 1) % pathwayUpdates.length);
      }, 5000);
      return () => clearInterval(timer);
    }, []);

    return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <div style={{ position: 'relative', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)' }}>
        <button
          onClick={() => setMainView('dashboard')}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            border: 'none',
            background: 'white',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: '#475569',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#0f172a';
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#475569';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <Icons.ArrowLeft style={{ width: 16, height: 16 }} />
          Back to Hub
        </button>

        {/* Programs Header */}
        <div style={{ padding: '2rem 3rem 1.5rem 3rem', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '28px',
            padding: '3rem',
            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.07)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)'
          }}>
            <div className="dashboard-logo" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '200px' }} />
            </div>
            <div className="dashboard-subtitle">CONNECTING PILOTS TO THE INDUSTRY</div>
            <h1 className="dashboard-title" style={{ marginBottom: '1rem' }}>Programs</h1>
            <p style={{ maxWidth: '800px', margin: '0 auto', color: '#475569', lineHeight: 1.6 }}>
              Access Foundational and Transition mentorship programs designed to refine your core mechanics and CRM skills through high-fidelity simulator practice.
            </p>
          </div>
        </div>

        <section className="dashboard-section" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ padding: '0 3rem 2rem 3rem' }}>
            {/* Program Selection Subheader */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                Select Your Program
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                Choose from our available mentorship programs to begin your training journey
              </p>
            </div>

            {/* Foundational Program Directory Card */}
            <div className="horizontal-card" style={{ 
              cursor: 'pointer', 
              padding: '1.5rem 2rem', 
              marginBottom: '1.5rem',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }} 
            onClick={() => setMainView('foundational')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
            }}
            >
              <div className="horizontal-card-content-wrapper">
                <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                  <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                    <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Foundational Program</h3>
                    <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                      Master core aviation fundamentals, instrument procedures, and advanced CRM techniques through structured simulator training modules.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                        12 Modules
                      </span>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                        40 Hours
                      </span>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                        Beginner Friendly
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hub-card-arrow">
                  <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                </div>
              </div>
              <img src="/Gemini_Generated_Image_7awns87awns87awn.png" alt="Foundational Program" className="hub-card-bg-image" style={{ width: '35%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            </div>

            {/* Transition Program Directory Card */}
            <div className="horizontal-card" style={{ 
              cursor: 'pointer', 
              padding: '1.5rem 2rem', 
              marginBottom: '1.5rem',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }} 
            onClick={() => setMainView('transition')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
            }}
            >
              <div className="horizontal-card-content-wrapper">
                <div style={{ maxWidth: '60%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                  <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                    <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transition Program</h3>
                    <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                      Advanced career transition training for experienced pilots seeking airline pathways and specialized aviation roles.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#fef3c7', borderRadius: '12px', color: '#92400e', fontWeight: 500 }}>
                        Coming Soon
                      </span>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                        Advanced
                      </span>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                        Career Focus
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hub-card-arrow">
                  <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                </div>
              </div>
              <img src="/WhatsApp Image 2026-02-07 at 20.06.18.jpeg" alt="Transition Program" className="hub-card-bg-image" style={{ width: '35%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            </div>

            {/* Program Progress Notifications */}
            <div style={{ marginBottom: '2rem', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                inset: '-30px 0 20px',
                borderRadius: '32px',
                background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(56,189,248,0.08))',
                filter: 'blur(40px)',
                opacity: 0.8,
                pointerEvents: 'none'
              }} />
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                padding: '2rem',
                position: 'relative'
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Program Updates & News
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                    Stay informed about the latest program developments and industry news
                  </p>
                </div>
                <div
                className="latest-pathway-card"
                style={{
                  padding: '1.75rem',
                  background: 'rgba(255, 255, 255, 0.75)',
                  borderRadius: '20px',
                  boxShadow: '0 30px 60px rgba(15, 23, 42, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(28px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>Latest Pathway Updates</h3>
                    <p style={{ margin: '0.35rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>Stay informed on the latest community and program developments.</p>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600 }}>Updated moments ago</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
                  {pathwayUpdates.map((update, idx) => (
                    <div
                      key={update.title}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
                        backdropFilter: 'blur(18px)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(236,239,248,0.6))', opacity: 0.5, pointerEvents: 'none' }} />
                      <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>{update.title}</h4>
                        </div>
                        <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: 1.5 }}>{update.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  width: '40%',
                  height: '100%',
                  backgroundImage: 'url(/WingMentor_Network.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.7,
                  mixBlendMode: 'screen',
                  pointerEvents: 'none'
                }} />
              </div>
            </div>
          </div>

            {/* Foundation Program Progress Card - Hard Truth Format */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '2rem', textAlign: 'left' }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '24px',
                padding: '4rem 3rem',
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem' }} />
                <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  PROGRESS TRACKING
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif' }}>
                  Foundation Program Journey
                </h2>
                
                {/* Carousel Container */}
                <div style={{ position: 'relative', height: '200px', width: '100%', maxWidth: '40rem', margin: '0 auto' }}>
                  {/* Progress Update 1 */}
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    height: '100%',
                    opacity: 1,
                    animation: 'slideInOut 8s infinite'
                  }}>
                    <div style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, textAlign: 'left' }}>
                      <strong>Your Foundation Program progress is tracked in real-time.</strong> WingMentor monitors your training advancement and syncs with our comprehensive database.
                      <br /><br />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                          Module Progress
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 600 }}>
                          8 of 12 Complete
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginBottom: '0.5rem'
                      }}>
                        <div style={{
                          width: '67%',
                          height: '100%',
                          background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                        <span>67% Complete</span>
                        <span>Last sync: 2 min ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Update 2 */}
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    height: '100%',
                    opacity: 0,
                    animation: 'slideInOut 8s infinite 4s'
                  }}>
                    <div style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, textAlign: 'left' }}>
                      <strong>Advanced CRM techniques module now available.</strong> The latest module in your Foundation Program includes enhanced simulator scenarios and real-world case studies.
                      <br /><br />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                          Recent Achievement
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 600 }}>
                          Completed
                        </span>
                      </div>
                      <div style={{
                        padding: '0.75rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        <div style={{ fontSize: '0.8rem', color: '#047857', lineHeight: 1.5 }}>
                          ✅ Module 8: Advanced CRM Techniques<br/>
                          ✅ Module 9: Decision Making Under Pressure<br/>
                          ✅ Module 10: Team Communication
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carousel Progress Indicator */}
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  marginTop: '2rem',
                  justifyContent: 'center',
                  zIndex: 20
                }}>
                  <div style={{
                    width: '32px',
                    height: '4px',
                    borderRadius: '2px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    animation: 'progressPulse 8s infinite'
                  }}></div>
                  <div style={{
                    width: '32px',
                    height: '4px',
                    borderRadius: '2px',
                    background: 'rgba(226, 232, 240, 0.6)'
                  }}></div>
                </div>
              </div>


              {/* Enhanced CSS Animations */}
              <style>{`
                @keyframes slideInOut {
                  0%, 100% { 
                    opacity: 0; 
                    transform: translateX(-20px); 
                  }
                  10%, 45% { 
                    opacity: 1; 
                    transform: translateX(0); 
                  }
                  55%, 90% { 
                    opacity: 0; 
                    transform: translateX(20px); 
                  }
                }
                @keyframes pulse {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.6; transform: scale(1.2); }
                }
                @keyframes progressPulse {
                  0%, 100% { opacity: 0.3; }
                  50% { opacity: 1; }
                }
              `}</style>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer style={{ 
          marginTop: '3rem', 
          padding: '2rem',
          borderTop: '1px solid #e2e8f0',
          background: 'white'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>
              <button 
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onClick={() => setMainView('contact')}
              >
                Contact Support
              </button>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              <p style={{ margin: '0 0 0.5rem 0' }}>
                Need help with your training program? Our support team is here to assist you.
              </p>
              <p style={{ margin: 0 }}>
                © 2024 WingMentor Network. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

  // Pathways View Component
  const PathwaysView = () => {
    const [showAllPathways, setShowAllPathways] = useState(false);
    const [teaserHovered, setTeaserHovered] = useState(false);
    const [activeUpdate, setActiveUpdate] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setActiveUpdate((prev) => (prev + 1) % pathwayUpdates.length);
      }, 5000);
      return () => clearInterval(timer);
    }, [pathwayUpdates.length]);

    return (
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <div style={{ position: 'relative', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)' }}>
          <button
            onClick={() => setMainView('dashboard')}
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              border: 'none',
              background: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#475569',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#0f172a';
              e.currentTarget.style.transform = 'translateX(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ fontSize: '16px' }}>←</span> Back to Hub
          </button>

          <div style={{ padding: '2rem 3rem 1.5rem 3rem', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '28px',
              padding: '3rem',
              boxShadow: '0 20px 60px rgba(15, 23, 42, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)'
            }}>
              <div className="dashboard-logo" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '200px' }} />
              </div>
              <div className="dashboard-subtitle">CONNECTING PILOTS TO THE INDUSTRY</div>
              <h1 className="dashboard-title" style={{ marginBottom: '1rem' }}>Pathways</h1>
              <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.5, maxWidth: '42rem', margin: '0 auto 1.5rem' }}>
                Explore structured career roadmaps designed to guide your journey from student pilot to professional aviation careers.
              </p>
              <div style={{ maxWidth: '720px', margin: '0 auto 2rem', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 45px rgba(15,23,42,0.12)', border: '1px solid rgba(226,232,240,0.8)' }}>
                <img
                  src="/wingmentor terminal.png 19-03-19-218.png"
                  alt="WingMentor Terminal"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          </div>

          <section className="dashboard-section" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ padding: '0 3rem 2rem 3rem' }}>
              {/* Pathways Selection Subheader */}
              <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                  Select Your Career Pathway
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                  Choose from specialized training tracks tailored to your aviation career goals
                </p>
              </div>

              {/* Main Pathways - Always Visible */}
              <div style={{ marginBottom: '2rem' }}>
                {/* Emirates ATPL Pathway */}
                <div className="horizontal-card" style={{ 
                  cursor: 'pointer', 
                  padding: '1.5rem 2rem', 
                  marginBottom: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => setMainView('atpl-pathway')}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
                }}
                >
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Emirates ATPL Pathway</h3>
                        <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                          Advanced ATPL theory training through prestigious ATOs with visa support, license conversion, and global recognition.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#fef3c7', borderRadius: '12px', color: '#92400e', fontWeight: 500 }}>
                            ATPL Focus
                          </span>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                            18 Months
                          </span>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                            Airline Ready
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="hub-card-arrow">
                      <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                    </div>
                  </div>
                  <img 
                    src="/fleet-header-the-etihad-fleet-1.jpg.avif.jpg" 
                    alt="Etihad Fleet" 
                    className="hub-card-bg-image" 
                    style={{ 
                      width: '35%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      objectPosition: 'center',
                      opacity: 0.9,
                      transition: 'opacity 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                  />
                </div>

                {/* Commercial Pathway */}
                <div className="horizontal-card" style={{ 
                  cursor: 'pointer', 
                  padding: '1.5rem 2rem', 
                  marginBottom: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => setMainView('private-sector')}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
                }}
                >
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Private Sector Pathway</h3>
                        <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                          Private jet sector excellence with Gulfstream insights, charter company requirements, and direct operator relations.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#e0e7ff', borderRadius: '12px', color: '#3730a3', fontWeight: 500 }}>
                            Private Jet Focus
                          </span>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                            12 Months
                          </span>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                            Multi-Engine
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="hub-card-arrow">
                      <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                    </div>
                  </div>
                  <img 
                    src="/Silhouette-of-pilot-walking-aw-1140x760.jpg" 
                    alt="Private Sector Pilot" 
                    className="hub-card-bg-image" 
                    style={{ 
                      width: '35%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      objectPosition: 'center',
                      opacity: 0.9,
                      transition: 'opacity 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                  />
                </div>

                {/* Air Taxi Pathway */}
                <div className="horizontal-card" style={{ 
                  cursor: 'pointer', 
                  padding: '1.5rem 2rem', 
                  marginBottom: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }} 
                onClick={() => alert('Air Taxi Pathway coming soon!')}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
                }}
                >
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '65%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Air Taxi Pathway</h3>
                        <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                          Specialized training for air taxi and charter operations with emphasis on customer service and flexible scheduling.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#fce7f3', borderRadius: '12px', color: '#9f1239', fontWeight: 500 }}>
                            Charter Focus
                          </span>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                            9 Months
                          </span>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                            Customer Service
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="hub-card-arrow">
                      <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                    </div>
                  </div>
                  <img 
                    src="/Archer-Midnight-eVTOL.png" 
                    alt="Archer Midnight eVTOL" 
                    className="hub-card-bg-image" 
                    style={{ 
                      width: '35%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      objectPosition: 'center',
                      opacity: 0.9,
                      transition: 'opacity 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                  />
                </div>
              </div>

              {/* Expandable Pathways Section */}
              <div style={{ position: 'relative' }}>
                {/* Hidden Pathways Container */}
                <div style={{
                  overflow: 'hidden',
                  transition: 'max-height 0.6s ease-out',
                  maxHeight: showAllPathways ? '2000px' : '0px'
                }}>
                  <div style={{ paddingTop: showAllPathways ? '0' : '2rem' }}>
                    {/* Military Pathway */}
                    <div className="horizontal-card" style={{ 
                      cursor: 'pointer', 
                      padding: '1.5rem 2rem', 
                      marginBottom: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }} 
                    onClick={() => alert('Military Pathway coming soon!')}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
                    }}
                    >
                      <div className="horizontal-card-content-wrapper">
                        <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                          <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                            <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Military Pathway</h3>
                            <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                              Advanced military aviation training with focus on tactical operations and transition to civilian aviation careers.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f3f4f6', borderRadius: '12px', color: '#374151', fontWeight: 500 }}>
                                Tactical Focus
                              </span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                                24 Months
                              </span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                                Advanced Systems
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="hub-card-arrow">
                          <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                        </div>
                      </div>
                    </div>

                    {/* Cargo Pathway */}
                    <div className="horizontal-card" style={{ 
                      cursor: 'pointer', 
                      padding: '1.5rem 2rem', 
                      marginBottom: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }} 
                    onClick={() => alert('Cargo Pathway coming soon!')}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
                    }}
                    >
                      <div className="horizontal-card-content-wrapper">
                        <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                          <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                            <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cargo Pathway</h3>
                            <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                              Specialized cargo operations training including freight logistics, night operations, and international cargo procedures.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#fef2f2', borderRadius: '12px', color: '#991b1b', fontWeight: 500 }}>
                                Cargo Focus
                              </span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                                15 Months
                              </span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                                International
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="hub-card-arrow">
                          <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                        </div>
                      </div>
                    </div>

                    {/* Flight Instructor Pathway */}
                    <div className="horizontal-card" style={{ 
                      cursor: 'pointer', 
                      padding: '1.5rem 2rem', 
                      marginBottom: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }} 
                    onClick={() => alert('Flight Instructor Pathway coming soon!')}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
                    }}
                    >
                      <div className="horizontal-card-content-wrapper">
                        <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                          <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                            <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Flight Instructor Pathway</h3>
                            <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                              Comprehensive flight instructor training with focus on teaching methodologies, curriculum development, and student assessment.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#ecfdf5', borderRadius: '12px', color: '#065f46', fontWeight: 500 }}>
                                Teaching Focus
                              </span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                                6 Months
                              </span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                                CFI Certified
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="hub-card-arrow">
                          <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                        </div>
                      </div>
                    </div>

                    {/* Corporate Aviation Pathway */}
                    <div className="horizontal-card" style={{ 
                      cursor: 'pointer', 
                      padding: '1.5rem 2rem', 
                      marginBottom: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease'
                    }} 
                    onClick={() => alert('Corporate Aviation Pathway coming soon!')}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
                    }}
                    >
                      <div className="horizontal-card-content-wrapper">
                        <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                          <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                            <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Corporate Aviation Pathway</h3>
                            <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: '1rem', color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
                              Elite corporate flight operations with focus on executive transport, international procedures, and VIP service excellence.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f0fdf4', borderRadius: '12px', color: '#14532d', fontWeight: 500 }}>
                                Executive Focus
                              </span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 500 }}>
                                12 Months
                              </span>
                              <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 500 }}>
                                VIP Service
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="hub-card-arrow">
                          <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Section - Always Visible Top Edge */}
                {!showAllPathways && (
                  <div
                    onClick={() => setShowAllPathways(true)}
                    onMouseEnter={() => setTeaserHovered(true)}
                    onMouseLeave={() => setTeaserHovered(false)}
                    style={{
                      margin: '0 auto 2rem',
                      maxWidth: '1100px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      height: '170px',
                      borderRadius: '30px',
                      overflow: 'hidden',
                      background: 'transparent',
                      perspective: '1200px'
                    }}>
                      <div
                        style={{
                          position: 'absolute',
                          inset: '45px 20px 0',
                          borderRadius: '28px',
                          background: 'rgba(255,255,255,0.3)',
                          boxShadow: '0 25px 45px rgba(15,23,42,0.15)',
                          transform: 'rotateX(24deg) translateY(55px)',
                          transformOrigin: 'top center'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: '55px 30px 0',
                          borderRadius: '26px',
                          background: 'rgba(255,255,255,0.4)',
                          boxShadow: '0 18px 35px rgba(15,23,42,0.12)',
                          transform: 'rotateX(18deg) translateY(40px)',
                          transformOrigin: 'top center'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: '0 0 auto',
                          top: '-70px',
                          borderRadius: '28px',
                          background: 'linear-gradient(120deg, rgba(255,255,255,0.95), rgba(244,248,255,0.85))',
                          boxShadow: '0 25px 55px rgba(15, 23, 42, 0.2)',
                          transform: teaserHovered ? 'rotateX(4deg) translateY(10px)' : 'rotateX(14deg) translateY(0)',
                          transformOrigin: 'bottom center',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ padding: '1.5rem 2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.8rem', letterSpacing: '0.35em', color: '#94a3b8', fontWeight: 700, marginBottom: '0.4rem' }}>• EXPANDING HORIZONS</div>
                            <h4 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>Discover More Pathways</h4>
                            <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>
                              Military, Cargo, Instructor, and corporate tracks are queued below—hover to bring them into view.
                            </p>
                          </div>
                          <div style={{ width: '48px', height: '48px' }} />
                        </div>
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '30px',
                          backgroundImage: 'url(/shutterstock_1698112222.jpg)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          filter: 'blur(16px)',
                          opacity: 0.35
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '30px',
                          background: 'linear-gradient(180deg, rgba(248,250,252,0) 0%, rgba(248,250,252,0.9) 60%, rgba(248,250,252,1) 100%)'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '30px',
                          boxShadow: '0 15px 40px rgba(15, 23, 42, 0.12)',
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 5
                        }}
                      >
                        <div style={{
                          padding: '0.7rem 1.6rem',
                          borderRadius: '999px',
                          background: 'rgba(255,255,255,0.95)',
                          color: '#2563eb',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          boxShadow: '0 8px 18px rgba(15,23,42,0.12)',
                          border: '1px solid rgba(37,99,235,0.2)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}>
                          Discover More Pathways — Click Here
                          <span style={{
                            display: 'inline-block',
                            animation: 'bounceArrow 1.6s infinite',
                            fontSize: '1.1rem'
                          }}>↓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showAllPathways && (
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <button
                      onClick={() => setShowAllPathways(false)}
                      style={{
                        padding: '0.9rem 2rem',
                        background: '#f1f5f9',
                        color: '#1e293b',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>↑</span>
                      View Less Pathways
                    </button>
                  </div>
                )}
              </div>

              {/* Pathways News Section */}
              <div style={{ marginTop: '3rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem', textAlign: 'center' }}>
                  Latest Pathway Updates
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <div className="horizontal-card" style={{ 
                    padding: '1rem', 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.8)'
                  }}>
                    <div className="horizontal-card-content-wrapper">
                      <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                        <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                          <h4 className="horizontal-card-title" style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 600 }}>
                            Emirates ATPL Applications Open
                          </h4>
                          <p className="horizontal-card-desc" style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                            New cadet program cohort starting Q2 2024 with enhanced training curriculum.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="horizontal-card" style={{ 
                    padding: '1rem', 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.8)'
                  }}>
                    <div className="horizontal-card-content-wrapper">
                      <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                        <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                          <h4 className="horizontal-card-title" style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 600 }}>
                            Cargo Pathway Industry Partnerships
                          </h4>
                          <p className="horizontal-card-desc" style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                            Major cargo carriers offering guaranteed interviews for pathway graduates.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="horizontal-card" style={{ 
                    padding: '1rem', 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.8)'
                  }}>
                    <div className="horizontal-card-content-wrapper">
                      <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                        <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                          <h4 className="horizontal-card-title" style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 600 }}>
                            Flight Instructor Scholarships
                          </h4>
                          <p className="horizontal-card-desc" style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                            New funding opportunities for CFI candidates with industry mentorship.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personalized Pathway Inquiry Component */}
              <div style={{ marginTop: '3rem', marginBottom: '2rem' }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: '24px',
                  padding: '3rem',
                  boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  textAlign: 'center'
                }}>
                  <img src="/logo.png" alt="WingMentor Logo" style={{ height: '90px', width: 'auto', marginBottom: '1rem' }} />
                  <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Personalized Pathway Inquiry
                  </div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', margin: '0 0 1.5rem', fontFamily: 'Georgia, serif' }}>
                    Tailored Aviation Career Tracks
                  </h2>
                  <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, margin: '0 auto 2rem', maxWidth: '36rem' }}>
                    Is there a particular pathway you're interested in through your pilot journey? WingMentor creates specialized tracks for corporate pilotage, air rescue operations, crop dusting, and other individualized careers that align with your long-term aviation goals.
                  </p>
                  <div style={{ textAlign: 'left', maxWidth: '34rem', margin: '0 auto 2rem' }}>
                    {[{
                      title: 'Corporate Pilotage',
                      description: 'Executive transport and private aviation'
                    }, {
                      title: 'Air Rescue Operations',
                      description: 'Emergency medical and rescue services'
                    }, {
                      title: 'Crop Dusting',
                      description: 'Agricultural aviation operations'
                    }, {
                      title: 'Specialized Operations',
                      description: 'Custom pathways for unique careers'
                    }].map((item) => (
                      <div key={item.title} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', padding: '0.35rem 0' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <div style={{ width: 8, height: 8, borderRadius: 999, marginTop: 6, background: '#0ea5e9' }}></div>
                          <h4 style={{ fontSize: '1.0625rem', margin: 0, fontWeight: 600, color: '#0f172a' }}>{item.title}</h4>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>{item.description}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <button
                      onClick={() => window.location.href = 'mailto:wingmentorprogram@gmail.com?subject=Personalized Pathway & Internship Inquiry&body=I am interested in learning more about personalized aviation pathways for my pilot career and internship opportunities with WingMentor.'}
                      style={{
                        padding: '0.85rem 1.75rem',
                        borderRadius: '12px',
                        border: 'none',
                        background: '#2563eb',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        boxShadow: '0 15px 30px rgba(37, 99, 235, 0.3)'
                      }}
                    >
                      Inquire About Pathways & Internships
                    </button>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
                    Contact us for personalized pathway guidance and internship opportunities with WingMentor
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  };


  // Dashboard View Component
  const DashboardView = () => (
    <div className="dashboard-container animate-fade-in">
      <div style={{ position: 'relative', minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)' }}>
        <div className="dashboard-header" style={{ marginBottom: '3rem', padding: '2rem 2rem 0 2rem' }}>
          <div className="dashboard-logo" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <img src="/logo.png" alt="WingMentor Logo" />
          </div>
          <div className="dashboard-subtitle">CONNECTING PILOTS TO THE INDUSTRY</div>
          <h1 className="dashboard-title">Wingmentor Network</h1>
          <p style={{ fontSize: '1.125rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Welcome to the central portal. Select a category below to explore our mentorship programs, structured pathways, and required applications.
          </p>
        </div>

        <div style={{ padding: '0 2rem 2rem 2rem' }}>
          {/* Welcome Section */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderLeft: '4px solid #0ea5e9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                ✈️
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                  Welcome to Your Flight Training Hub
                </h2>
                <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>
                  Your comprehensive aviation training and career development platform
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
              gap: '1rem',
              marginTop: '1.5rem'
            }}>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: '#f8fafc', 
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0ea5e9', marginBottom: '0.25rem' }}>
                  194
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Flight Hours
                </div>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: '#f8fafc', 
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', marginBottom: '0.25rem' }}>
                  12
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Skills
                </div>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: '#f8fafc', 
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.25rem' }}>
                  3
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Certifications
                </div>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '1rem', 
                background: '#f8fafc', 
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#8b5cf6', marginBottom: '0.25rem' }}>
                  4
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Awards
                </div>
              </div>
            </div>
          </div>

          {/* News & Updates Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            
            {/* WingMentor Updates */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderLeft: '4px solid #0ea5e9'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.25rem'
                }}>
                  🚀
                </div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  margin: 0
                }}>
                  WingMentor Updates
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ 
                  padding: '1rem', 
                  background: '#f8fafc', 
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0ea5e9' }}>
                      New Feature
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      2 days ago
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                    Recognition & Achievements page now available! Track your awards and certifications.
                  </div>
                </div>
                <div style={{ 
                  padding: '1rem', 
                  background: '#f8fafc', 
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0ea5e9' }}>
                      Platform Update
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      1 week ago
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                    Enhanced dashboard with new navigation and improved user experience.
                  </div>
                </div>
              </div>
            </div>

            {/* Program Notifications */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderLeft: '4px solid #10b981'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.25rem'
                }}>
                  📚
                </div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  margin: 0
                }}>
                  Program Notifications
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ 
                  padding: '1rem', 
                  background: '#f8fafc', 
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#10b981' }}>
                      Enrollment Open
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      3 days ago
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                    Advanced ATPL Program enrollment now open for Q2 2024.
                  </div>
                </div>
                <div style={{ 
                  padding: '1rem', 
                  background: '#f8fafc', 
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#10b981' }}>
                      Reminder
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      5 days ago
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                    Complete your Foundational Program modules by end of month.
                  </div>
                </div>
              </div>
            </div>

            {/* Industry News */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderLeft: '4px solid #f59e0b'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.25rem'
                }}>
                  📰
                </div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  margin: 0
                }}>
                  Industry News
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ 
                  padding: '1rem', 
                  background: '#f8fafc', 
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f59e0b' }}>
                      Aviation Industry
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      1 day ago
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                    Major airlines announce pilot recruitment drive for 2024-2025.
                  </div>
                </div>
                <div style={{ 
                  padding: '1rem', 
                  background: '#f8fafc', 
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f59e0b' }}>
                      Technology Update
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      4 days ago
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                    New simulator technology enhances training effectiveness by 40%.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );

  // Main content panel
  const MainPanel = () => {
    const marginLeft = SIDEBAR_BASE_WIDTH * sidebarScale;
    const mainPanelScale = (mainView === 'programs' || mainView === 'pathways') ? 1 : 1.25;
    const inverseScalePercent = `${(100 / mainPanelScale).toFixed(4)}%`;
    return (
      <div style={{
        marginLeft: `${marginLeft}px`,
        width: `calc(100% - ${marginLeft}px)`,
        height: '100vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        <div
          style={{
            transform: `scale(${mainPanelScale})`,
            transformOrigin: 'top left',
            width: inverseScalePercent,
            minWidth: inverseScalePercent,
            height: inverseScalePercent,
            minHeight: inverseScalePercent
          }}
        >
          {/* Global top bar */}
          <div
            style={{
              width: '100%',
              padding: '1.5rem 2.75rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              zIndex: 5,
              background: 'linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(248,250,252,0.75) 100%)',
              backdropFilter: 'blur(6px)',
              borderBottom: '1px solid rgba(226,232,240,0.8)'
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', letterSpacing: '0.08em' }}>WELCOME BACK</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <Icons.User style={{ width: 22, height: 22, color: '#2563eb' }} />
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a', fontWeight: 600 }}>
                  {userFirstName}
                </h2>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setMainView('pilot-profile')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.65rem 1.2rem',
                  borderRadius: '999px',
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  color: '#1e293b',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(15,23,42,0.08)'
                }}
              >
                <Icons.User style={{ width: 16, height: 16 }} /> Profile
              </button>

              <button
                onClick={() => setMainView('applications')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.65rem 1.2rem',
                  borderRadius: '999px',
                  border: '1px solid transparent',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.8)'
                }}
              >
                <Icons.Settings style={{ width: 16, height: 16 }} /> Settings
              </button>

              <button
                onClick={handleAccessWebsite}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(31,41,55,0.18)'
                }}
              >
                <Icons.Globe style={{ width: 18, height: 18 }} /> Access Website
              </button>
            </div>
          </div>

          {renderMainContent()}
        </div>
      </div>
    );
  };

  // WingMentor Network View Component
  const WingMentorNetworkView = ({ onBack }: { onBack: () => void }) => (
    <div
      className="dashboard-container animate-fade-in"
      style={{ alignItems: 'flex-start', justifyContent: 'center', padding: '3rem 1rem 2rem' }}
    >
      <main
        className="dashboard-card network-panel"
        style={{ position: 'relative', padding: 0, background: 'transparent', boxShadow: 'none', border: 'none', width: '100%', maxWidth: '1100px' }}
      >
        <header className="dashboard-header" style={{
          borderBottom: '1px solid rgba(226, 232, 240, 0.7)',
          paddingBottom: '2.5rem',
          backgroundColor: 'transparent'
        }}>
          <div style={{ position: 'absolute', top: '1.5rem', left: '2rem' }}>
            <button
              className="back-btn"
              onClick={onBack}
              style={{
                padding: '0.5rem 0',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#475569',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#0f172a';
                e.currentTarget.style.transform = 'translateX(-4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#475569';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <Icons.ArrowLeft style={{ width: 16, height: 16 }} />
              Back to Hub
            </button>
          </div>

          <div className="dashboard-logo" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '240px' }} />
          </div>

          <div className="dashboard-subtitle" style={{ letterSpacing: '0.3em', color: '#2563eb', fontWeight: 700 }}>
            WINGMENTOR NETWORK
          </div>

          <h1 style={{
            fontSize: '3.3rem',
            marginTop: '0.5rem',
            marginBottom: '0.5rem',
            color: '#0f172a',
            fontFamily: '"Georgia", serif',
            fontWeight: 400
          }}>
            Connecting Pilots to the Industry
          </h1>

          <p style={{
            color: '#64748b',
            fontSize: '0.875rem',
            maxWidth: '42rem',
            margin: '0 auto 1.5rem',
            padding: '0 1rem',
            lineHeight: '1.625',
            textAlign: 'center'
          }}>
            Connect with the aviation community, access shared knowledge, and stay updated with industry insights through our comprehensive network platform.
          </p>
        </header>

        <div className="dashboard-content" style={{ padding: '3rem 1rem 4rem', backgroundColor: 'transparent', display: 'flex', justifyContent: 'center' }}>
          <div className="animate-fade-in" style={{ width: '100%', maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* WingMentor Search Engine */}
            <div className="horizontal-card" style={{ 
              padding: '2rem', 
              marginBottom: '2rem',
              background: 'rgba(15, 23, 42, 0.03)',
              borderRadius: '20px',
              border: '1px solid rgba(226, 232, 240, 0.6)',
              boxShadow: '0 25px 60px rgba(15, 23, 42, 0.07)',
              backdropFilter: 'blur(22px)'
            }}>
              <div className="horizontal-card-content-wrapper">
                <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                  <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                    <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      WingMentor Search Engine
                    </h3>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <input
                        type="text"
                        placeholder="Search requirements, knowledge base, type ratings..."
                        style={{
                          width: '100%',
                          padding: '1rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: '#f8fafc',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#2563eb';
                          e.currentTarget.style.background = 'white';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.background = '#f8fafc';
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <button style={{
                        padding: '0.5rem 1rem',
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}>
                        🔍 Search Database
                      </button>
                      <button style={{
                        padding: '0.5rem 1rem',
                        background: '#f1f5f9',
                        color: '#475569',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}>
                        📚 Knowledge Bank
                      </button>
                      <button style={{
                        padding: '0.5rem 1rem',
                        background: '#f1f5f9',
                        color: '#475569',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}>
                        ✈️ Type Ratings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* News & Updates Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Pilot Gap Forum Feed */}
              <div className="horizontal-card" style={{ 
                padding: '1.5rem', 
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.06)',
                border: '1px solid rgba(226, 232, 240, 0.45)'
              }}>
                <div className="horizontal-card-content-wrapper">
                  <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                    <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                      <h4 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 700 }}>
                        Pilot Gap Forum
                      </h4>
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                          Foundation Program Updates
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                          2 hours ago
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                          New CRM scenarios added to the simulator training module. Mentors sharing best practices for advanced navigation procedures.
                        </p>
                      </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: '#dcfce7', borderRadius: '12px', color: '#166534', fontWeight: 600 }}>
                          Foundation Program
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          15 replies
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* WingMentor Insights */}
              <div className="horizontal-card" style={{ 
                padding: '1.5rem', 
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <div className="horizontal-card-content-wrapper">
                  <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                    <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                      <h4 className="horizontal-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 700 }}>
                        WingMentor Insights
                      </h4>
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                          LinkedIn Group Post
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                          4 hours ago
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                          From Zero to Hero: Cadet program success stories from graduates now flying with major airlines. Career transition insights.
                        </p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: '#dbeafe', borderRadius: '12px', color: '#1e40af', fontWeight: 600 }}>
                          Career Insights
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          42 likes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aviation Industry Situation */}
            <div className="horizontal-card" style={{ 
              padding: '2rem', 
              marginBottom: '2rem',
              background: 'rgba(15, 23, 42, 0.03)',
              borderRadius: '20px',
              border: '1px solid rgba(226, 232, 240, 0.5)',
              boxShadow: '0 20px 60px rgba(15, 23, 42, 0.06)'
            }}>
              <div className="horizontal-card-content-wrapper">
                <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                  <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                    <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Aviation Industry Media Platform
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>
                          Industry News
                        </h4>
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                            Global Pilot Shortage Update
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                            IATA reports increased demand for 617,000 pilots by 2036. Airlines accelerating recruitment programs.
                          </p>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                            Fleet Modernization Trends
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                            Major carriers investing in next-generation aircraft. New type rating requirements announced.
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>
                          Market Analysis
                        </h4>
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                            Regional Growth Patterns
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                            Asia-Pacific leading pilot demand. European carriers facing retirement wave challenges.
                          </p>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                            Training Capacity Expansion
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                            Flight schools increasing enrollment. New simulator facilities opening worldwide.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LinkedIn Group Newsfeed */}
            <div className="horizontal-card" style={{
              padding: '2rem',
              marginBottom: '2rem',
              background: 'rgba(15, 23, 42, 0.04)',
              borderRadius: '20px',
              border: '1px solid rgba(226, 232, 240, 0.6)',
              boxShadow: '0 25px 65px rgba(15, 23, 42, 0.08)'
            }}>
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>WingMentor Newsfeed</h3>
                  <p style={{ margin: '0.35rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>Latest post from the WingMentor LinkedIn Group.</p>
                </div>
                <a
                  href="https://www.linkedin.com/groups/18662026/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.9rem', fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}>
                  Read more news ↗
                </a>
              </div>
              <div style={{ width: '100%', height: '360px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <iframe
                  title="LinkedIn WingMentor Group"
                  src="https://www.linkedin.com/groups/18662026/"
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Knowledge Bank & Resources */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
                Community Knowledge Bank
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '20px',
                  boxShadow: '0 15px 35px rgba(15, 23, 42, 0.05)',
                  border: '1px solid rgba(226, 232, 240, 0.4)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700 }}>
                          POH & Technical Documents
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Pilot Operating Handbooks, aircraft manuals, and technical specifications shared by experienced pilots.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            Cessna 172
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            Piper PA-28
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            +45 docs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '20px',
                  boxShadow: '0 15px 35px rgba(15, 23, 42, 0.05)',
                  border: '1px solid rgba(226, 232, 240, 0.4)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700 }}>
                          Training Materials
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Principles of Flight presentations, navigation tutorials, and exam preparation materials.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            PPL Questions
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            CPL Study Guide
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            IR Procedures
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '20px',
                  boxShadow: '0 15px 35px rgba(15, 23, 42, 0.05)',
                  border: '1px solid rgba(226, 232, 240, 0.4)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700 }}>
                          Type Rating Resources
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Comprehensive guides for aircraft type ratings, systems, and operational procedures.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            A320 Family
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            B737 NG/MAX
                          </span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                            +15 types
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Content Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
                Video Library & Seminars
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '20px',
                  boxShadow: '0 15px 35px rgba(15, 23, 42, 0.05)',
                  border: '1px solid rgba(226, 232, 240, 0.4)'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700 }}>
                          Low Timer Pilot Seminars
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Expert advice on building flight hours, networking strategies, and career progression for low-time pilots.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Duration: 45 min</span>
                          <button style={{
                            padding: '0.5rem 1rem',
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}>
                            ▶️ Watch Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="horizontal-card" style={{ 
                  padding: '1.5rem', 
                  background: 'white',
                  borderRadius: '20px',
                  boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e2e8f0'
                }}>
                  <div className="horizontal-card-content-wrapper">
                    <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                      <div className="horizontal-card-content" style={{ padding: '0.5rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                        <h4 className="horizontal-card-title" style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700 }}>
                          Zero to Hero Podcast
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                          Inspiring journeys from student pilot to airline captain through cadet programs and career transitions.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Episode 12</span>
                          <button style={{
                            padding: '0.5rem 1rem',
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}>
                            🎧 Listen Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Airline Insights Section */}
            <div className="horizontal-card" style={{ 
              padding: '2rem', 
              marginBottom: '2rem',
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div className="horizontal-card-content-wrapper">
                <div style={{ maxWidth: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 'bold' }}>•</div>
                  <div className="horizontal-card-content" style={{ padding: '1rem 0', textAlign: 'left', flex: 1, maxWidth: '100%' }}>
                    <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Airline Partner Insights
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>
                          Major Airlines
                        </h4>
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                            Recruitment Requirements 2024
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                            Updated pilot qualifications, experience requirements, and selection process insights.
                          </p>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                            Fleet Expansion Plans
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                            New aircraft orders, route expansions, and pilot hiring forecasts for next 5 years.
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>
                          Career Development
                        </h4>
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                            Cadet Program Advice
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                            Direct guidance from airline training departments on successful cadet applications.
                          </p>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                            Interview Preparation
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                            Technical interview questions, simulator assessments, and HR interview tips.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WingMentor Data Sync Watermark */}
            <div style={{ 
              textAlign: 'center', 
              padding: '1rem', 
              background: 'rgba(248, 250, 252, 0.8)',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              marginBottom: '2rem'
            }}>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#94a3b8', 
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                🔄 WingMentor Database Sync • Real-time Updates • Community Powered
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="dashboard-footer" style={{
          marginTop: '1rem',
          padding: '2rem 3.5rem',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #f1f5f9',
          textAlign: 'center'
        }}>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Connect with the WingMentor Network for comprehensive aviation resources and community support.
          </p>
          <button
            className="help-btn"
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#1e293b',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
            onClick={() => window.location.href = 'mailto:wingmentorprogram@gmail.com'}
          >
            ✉️ Contact Support
          </button>
        </footer>
      </main>
    </div>
  );

  // Main Content Renderer
  const renderMainContent = () => {
    switch (mainView) {
      case 'dashboard':
        return <DashboardView />;
      case 'programs':
        return <ProgramsView />;
      case 'pathways':
        return (
          <div style={{ transform: 'scale(1.15)', transformOrigin: 'top center' }}>
            <PathwaysView />
          </div>
        );
      case 'applications':
        return (
          <PilotProfilePage 
            onBack={() => setMainView('dashboard')} 
            onViewLogbook={() => setMainView('logbook')}
            onViewDigitalLogbook={() => setMainView('digital-logbook')}
            onViewMentorLogbook={() => setMainView('mentor-logbook')}
            userProfile={userProfile ?? undefined} 
          />
        );
      case 'recognition':
        return (
          <RecognitionAchievementPage
            onBack={() => setMainView('dashboard')}
            userProfile={userProfile}
            onViewExams={() => setMainView('examination-results')}
            onViewAtlas={() => setMainView('atlas-resume')}
          />
        );
      case 'examination-results':
        return <ExaminationResultsPage onBack={() => setMainView('recognition')} userProfile={userProfile} />;
      case 'pilot-portfolio':
        return (
          <PilotProfilePage 
            onBack={() => setMainView('dashboard')} 
            onViewLogbook={() => setMainView('logbook')}
            onViewDigitalLogbook={() => setMainView('digital-logbook')}
            onViewMentorLogbook={() => setMainView('mentor-logbook')}
            userProfile={userProfile ?? undefined} 
          />
        );
      case 'logbook':
        return <LogbookPage onBack={() => setMainView('pilot-portfolio')} userProfile={userProfile} />;
      case 'digital-logbook':
        return <DigitalLogbookPage onBack={() => setMainView('pilot-portfolio')} userProfile={userProfile ?? undefined} />;
      case 'mentor-logbook':
        return <MentorLogbookPage onBack={() => setMainView('pilot-portfolio')} userProfile={userProfile ?? undefined} />;
      case 'atlas-resume':
        return <AtlasResumePage onBack={() => setMainView('recognition')} onPrint={() => setMainView('printable-resume')} userProfile={userProfile} />;
      case 'printable-resume':
        return <PrintableResumePage onBack={() => setMainView('atlas-resume')} userProfile={userProfile} />;
      case 'foundational':
        return <FoundationalProgramPage onBack={() => setMainView('programs')} userProfile={userProfile} />;
      case 'transition':
        return <TransitionProgramPage onBack={() => setMainView('programs')} userProfile={userProfile} />;
      case 'pilot-profile':
        return <PilotProfilePage onBack={() => setMainView('dashboard')} userProfile={userProfile ?? undefined} />;
      case 'contact':
        return <ContactPage onBack={() => setMainView('programs')} onLogout={onLogout} />;
      case 'wingmentor-network':
        return <WingMentorNetworkView onBack={() => setMainView('dashboard')} />;
      case 'atpl-pathway':
        return <ATPLPathwayPage onBack={() => setMainView('pathways')} />;
      case 'private-sector':
        return <PrivateSectorPathwayPage onBack={() => setMainView('pathways')} />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc' }}>
      <Sidebar />
      
      {/* Main Content Area */}
      <MainPanel />
    </div>
  );
};
