import React, { useState, useEffect, Suspense } from 'react';
import './App.css';

// Mentor Management System Imports
import { onAuthStateChange, type AuthState } from './lib/auth';
import { PilotProfilePage } from './pages/PilotProfilePage';
import { MentorManagementPage } from './pages/MentorManagementPage';
import FoundationalProgramPage from './pages/FoundationalProgramPage';
import { WingMentorHome } from './pages/WingMentorHome';
import { RecognitionAchievementPage } from './pages/RecognitionAchievementPage';
import { auth } from './lib/firebase';

// Declare the remote module for TypeScript
// @ts-ignore
const RemoteSegment = React.lazy(() => import('remote_segment/Segment'));

export const Icons = {
  Logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2L2 22l10-4 10 4L12 2z" />
    </svg>
  ),
  ArrowRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Activity: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Briefcase: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  ArrowLeft: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  BookOpen: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Book: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  Map: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  Monitor: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  Cpu: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  LogOut: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Lock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  User: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  CheckCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  FileText: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Layout: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  Shield: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Database: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  LayoutGrid: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Award: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  Users: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  UserPlus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="16" y1="11" x2="22" y2="11" />
    </svg>
  ),
  Download: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Globe: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Zap: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Clock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
};


type CardItem = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Icons;
  desktopOnly?: boolean;
  linkText: string;
  badge?: string;
  image?: string;
  onClickAction?: () => void;
};

const programs: CardItem[] = [
  {
    id: 'prog-1',
    title: 'Foundational Program',
    description: 'Sign up to begin your 50-hour verified mentorship track. Refine your CRM and procedural skills through high-fidelity simulator scenarios. Status: Registration Open.',
    icon: 'Book',
    linkText: 'Access Program',
    image: 'https://lh3.googleusercontent.com/d/1K2CccSObEUsvy6unD8iqWjSjn-Zcw08g',
    onClickAction: undefined // Will be attached dynamically inside App component
  },
  {
    id: 'prog-transition',
    title: 'Transition Program',
    description: 'Bridge the gap to the flight deck. Complete advanced multi-crew simulator scenarios to finalize your industry-ready portfolio. Status: Pending Foundational Verification.',
    icon: 'Book',
    linkText: 'Access Program',
    image: 'https://lh3.googleusercontent.com/d/1wPEIiMRj4fW34_NIQKRnzCf8KNhdD1TC'
  }
];

const pathways: CardItem[] = [
  {
    id: 'path-1',
    title: 'Emirates ATPL Pathway',
    description: 'A structured roadmap designed to take you from a novice to a certified ATPL pilot.',
    icon: 'Map',
    linkText: 'View Pathway',
    image: 'https://connectedaviationtoday.com/wp-content/uploads/2020/12/shutterstock_1698112222.jpg'
  },
  {
    id: 'path-2',
    title: 'Commercial Pilot License',
    description: 'Accelerated track for aspiring commercial pilots looking to join major airlines.',
    icon: 'Map',
    linkText: 'View Pathway',
    image: 'https://images.unsplash.com/photo-1558509355-6b5d9bcbb4eb?q=80&w=600&auto=format&fit=crop'
  }
];

const applications: CardItem[] = [
  {
    id: 'app-1',
    title: 'Pilot Profile',
    description: 'Access your learning dashboard, track progress, and manage your pilot training journey.',
    icon: 'Monitor',
    linkText: 'Download Module',
    image: 'https://www.flightdeckfriend.com/wp-content/uploads/2019/02/Captain-Paperwork-Medium.jpg',
    badge: 'Dynamic'
  }
];

interface CardProps {
  item: CardItem;
}

const Card: React.FC<CardProps> = ({ item }) => {
  return (
    <div className="horizontal-card" data-desktop-only={item.desktopOnly ? "true" : "false"} style={{ cursor: 'pointer', padding: '1rem 2rem' }} onClick={item.onClickAction || (() => alert(`Opening ${item.title}`))}>
      <div className="horizontal-card-content-wrapper">
        <div style={{ maxWidth: '70%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#000000', fontWeight: 'bold' }}>•</div>
          <div className="horizontal-card-content" style={{ padding: '2rem 0', textAlign: 'left', maxWidth: '100%' }}>
            <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.title}</h3>

            {item.desktopOnly && (
              <div className="desktop-only-warning" style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', padding: '0.25rem 0.5rem' }}>
                App not available on mobile
              </div>
            )}

            <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
              {item.description}
            </p>
          </div>
        </div>

        <div className="hub-card-arrow" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Icons.ArrowRight style={{ width: 24, height: 24 }} />
        </div>
      </div>
      {item.image && (
        <img src={item.image} alt={item.title} className="hub-card-bg-image" />
      )}
      {item.badge && (
        <span className={`badge ${item.badge === 'New' ? 'badge-new' : 'badge-pro'}`} style={{ top: '1.5rem', right: '1.5rem' }}>
          {item.badge}
        </span>
      )}
    </div>
  );
};

import { CloudBackground } from './components/CloudBackground';
import { ATPLPathwayPage } from './pages/ATPLPathwayPage';
import { EmergingAirTaxiPage } from './pages/EmergingAirTaxiPage';
import { PrivateSectorPage } from './pages/PrivateSectorPage';
import { LoginPage } from './pages/LoginPage';
import { EnrollmentOnboardingPage } from './pages/EnrollmentOnboardingPage';
import { PostEnrollmentSlideshow } from './pages/PostEnrollmentSlideshow';
import { AIScreeningPage } from './pages/AIScreeningPage';
import { TermsAndConditionsPage } from './pages/TermsAndConditionsPage';
import { MentorshipSupervisionPage } from './pages/MentorshipSupervisionPage';
import PilotGapModulePage from './pages/PilotGapModulePage';
import MentorshipProtocolsModulePage from './pages/MentorshipProtocolsModulePage';
import PeerAdvocacyModulePage from './pages/PeerAdvocacyModulePage';


function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userProfile: null,
    loading: true,
    currentSystem: 'pms'
  });
  
  const [currentView, setCurrentView] = useState<
    'login' | 'hub' | 'dashboard' | 'programs' | 'pathways' | 'applications' |
    'foundational' | 'atpl' | 'airtaxi' | 'privatesector' | 'foundational-onboarding' | 'post-enrollment-slideshow' | 'ai-screening' | 'remote-segment' | 'terms-conditions' | 'mentorship' | 'mentor-management' |
    'module-01' | 'module-02' | 'module-03' | 'pilot-profile' | 'recognition'
  >('login');
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const handleModuleComplete = (moduleId: string) => {
    setCompletedModules(prev => prev.includes(moduleId) ? prev : [...prev, moduleId]);
  };
  
  const handleSelectDownload = () => {
    setCurrentView('remote-segment');
  };

  const handleSwitchSystem = async (system: 'pms' | 'wms' | 'super_admin') => {
    if (authState.userProfile) {
      setAuthState(prev => ({ ...prev, currentSystem: system }));
      // In production, save this to Firestore
      if (authState.user) {
        // await switchSystem(authState.user.uid, system);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange((nextState) => {
      setAuthState(nextState);
      if (nextState.user) {
        setCurrentView('hub');
      } else {
        setCurrentView('login');
      }
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const handleLogin = () => {
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
      setCurrentView('hub');
    }, 4500);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setCurrentView('login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hydrate onClickActions
  programs[0].onClickAction = () => {
    setCurrentView('foundational');
  };
  applications[0].onClickAction = () => setCurrentView('pilot-profile');

  if (pathways.length >= 3) {
    pathways[0].onClickAction = () => setCurrentView('atpl');
    pathways[1].onClickAction = () => setCurrentView('airtaxi');
    pathways[2].onClickAction = () => setCurrentView('privatesector');
  }

  return (
    <>
      <CloudBackground variant={currentView === 'login' || showLoading ? 'dark' : 'light'} />
      {showLoading ? (
        <div className="loading-screen animate-fade-out-delay">
          <div className="loading-content">
            <div className="loading-logo-container">
              <img src="/logo.png" alt="WingMentor Logo" className="loading-logo" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.classList.remove('hidden'); }} />
              <div className="loading-logo-fallback hidden">
                <Icons.Logo />
                <div className="loading-logo-text">WING MENTOR</div>
              </div>
            </div>
            <div className="loading-text-container">
              <h1 className="loading-text text-welcome">Welcome</h1>
              <h1 className="loading-text text-fellow">Fellow pilot.</h1>
            </div>
            <div className="loading-footer-text">V2.4.1 - FLIGHT TRAINING SYSTEMS</div>
          </div>
        </div>
      ) : currentView === 'login' ? (
        <LoginPage onLogin={handleLogin} />
      ) : currentView === 'hub' ? (
        <WingMentorHome 
          onLogout={handleLogout} 
          userProfile={authState.userProfile}
        />
      ) : currentView === 'foundational' ? (
        <FoundationalProgramPage
          onBack={() => setCurrentView('programs')}
          onLogout={handleLogout}
          onStartEnrollment={() => setCurrentView('foundational-onboarding')}
          onStartSlideshow={() => setCurrentView('post-enrollment-slideshow')}
          onSelectDownload={() => handleSelectDownload()}
          onLaunchMentorship={() => setCurrentView('mentorship')}
          onLaunchModule01={() => setCurrentView('module-01')}
          onLaunchModule02={() => setCurrentView('module-02')}
          onLaunchModule03={() => setCurrentView('module-03')}
          completedModules={completedModules}
        />
      ) : currentView === 'foundational-onboarding' ? (
        <EnrollmentOnboardingPage
          onComplete={() => setCurrentView('post-enrollment-slideshow')}
          onBackToPrograms={() => setCurrentView('foundational')}
          onLogout={handleLogout}
          onShowTerms={() => setCurrentView('terms-conditions')}
        />
      ) : currentView === 'terms-conditions' ? (
        <TermsAndConditionsPage onBack={() => setCurrentView('foundational-onboarding')} />
      ) : currentView === 'post-enrollment-slideshow' ? (
        <PostEnrollmentSlideshow
          onComplete={() => setCurrentView('foundational')}
        />
      ) : currentView === 'ai-screening' ? (
        <AIScreeningPage
          onBack={() => setCurrentView('foundational')}
          onLogout={handleLogout}
        />
      ) : currentView === 'atpl' ? (
        <ATPLPathwayPage onBack={() => setCurrentView('pathways')} onLogout={handleLogout} />
      ) : currentView === 'airtaxi' ? (
        <EmergingAirTaxiPage onBack={() => setCurrentView('pathways')} onLogout={handleLogout} />
      ) : currentView === 'privatesector' ? (
        <PrivateSectorPage onBack={() => setCurrentView('pathways')} onLogout={handleLogout} />
      ) : currentView === 'mentorship' ? (
        <MentorshipSupervisionPage onBack={() => setCurrentView('foundational')} onLogout={handleLogout} />
      ) : currentView === 'module-01' ? (
        <PilotGapModulePage
          onBack={() => setCurrentView('foundational')}
          onComplete={() => handleModuleComplete('stage-1')}
        />
      ) : currentView === 'module-02' ? (
        <MentorshipProtocolsModulePage onBack={() => setCurrentView('foundational')} onLogout={handleLogout} />
      ) : currentView === 'module-03' ? (
        <PeerAdvocacyModulePage onBack={() => setCurrentView('foundational')} onLogout={handleLogout} />
      ) : currentView === 'mentor-management' && authState.userProfile ? (
        <MentorManagementPage
          onBack={() => setCurrentView('hub')}
          onLogout={handleLogout}
          userProfile={authState.userProfile}
          onSwitchSystem={handleSwitchSystem}
          currentSystem={authState.currentSystem}
        />
      ) : currentView === 'pilot-profile' ? (
        <PilotProfilePage
          onBack={() => setCurrentView('applications')}
          userProfile={authState.userProfile || undefined}
        />
      ) : currentView === 'recognition' ? (
        <RecognitionAchievementPage
          onBack={() => setCurrentView('hub')}
        />
      ) : currentView === 'remote-segment' ? (
        <div className="dashboard-container animate-fade-in">
          <main className="dashboard-card" style={{ position: 'relative' }}>
            <button className="platform-logout-btn" onClick={handleLogout}>
              <Icons.LogOut style={{ width: 16, height: 16 }} />
              Logout
            </button>
            <div className="dashboard-header" style={{ position: 'relative', marginBottom: '2rem' }}>
              <div style={{ position: 'absolute', top: '0', left: '0' }}>
                <button
                  className="back-btn"
                  onClick={() => setCurrentView('hub')}
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
                >
                  <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back to Hub
                </button>
              </div>
              <div className="dashboard-logo" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '240px' }} />
              </div>
              <div className="dashboard-subtitle">DYNAMIC ASSET LOADING</div>
              <h1 className="dashboard-title">Remote Applications</h1>
            </div>

            <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Suspense fallback={
                <div style={{ textAlign: 'center' }}>
                  <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
                  <p style={{ color: '#64748b' }}>Fetching remote segment from internal server...</p>
                </div>
              }>
                <RemoteSegment />
              </Suspense>
            </div>
          </main>
        </div>
      ) : (
        <div className="dashboard-container animate-fade-in">
          <main className="dashboard-card" style={{ position: 'relative' }}>
            <button className="platform-logout-btn" onClick={handleLogout}>
              <Icons.LogOut style={{ width: 16, height: 16 }} />
              Logout
            </button>
            <div className="dashboard-header" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '0', left: '0' }}>
                <button
                  className="back-btn"
                  onClick={() => setCurrentView('hub')}
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
                  <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back to Hub
                </button>
              </div>
              <div className="dashboard-logo" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '240px' }} />
              </div>
              <div className="dashboard-subtitle">CONNECTING PILOTS TO THE INDUSTRY</div>
              <h1 className="dashboard-title" style={{ textTransform: 'capitalize' }}>
                {currentView === 'applications' ? 'Pilot Profile' : currentView}
              </h1>
              <p>
                {currentView === 'programs' && "Register for your required mentorship programs, track your enrollment status, and monitor your pending verifications."}
                {currentView === 'pathways' && "View structured career roadmaps including the Emirates ATPL, Commercial, and Air Taxi tracks."}
                {currentView === 'applications' && "Access operational web-apps and high-fidelity flight simulation systems required for training."}
              </p>
            </div>

            {currentView === 'programs' && (
              <section className="dashboard-section">
                <div className="cards-list" style={{ marginTop: '1rem' }}>
                  {programs.map(item => <Card key={item.id} item={item} />)}
                </div>
              </section>
            )}

            {currentView === 'pathways' && (
              <section className="dashboard-section">
                <div className="cards-list" style={{ marginTop: '1rem' }}>
                  {pathways.map(item => <Card key={item.id} item={item} />)}
                </div>
              </section>
            )}

            {currentView === 'applications' && (
              <section className="dashboard-section">
                <div className="cards-list" style={{ marginTop: '1rem' }}>
                  {applications.map(item => <Card key={item.id} item={item} />)}
                </div>
                {isMobile && (
                  <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '8px', textAlign: 'center', fontSize: '0.875rem' }}>
                    Note: Some applications (like w1000) are hidden or disabled on this device because they require a Desktop or iPad sized screen.
                  </div>
                )}
              </section>
            )}
            {currentView === 'programs' && (
              <div style={{
                marginTop: '3.5rem',
                padding: '2rem 2.5rem',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '100%'
              }}>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  marginBottom: '1rem',
                  fontWeight: 400
                }}>
                  Need assistance with your registration or checking your verification status?
                </p>
                <button
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    padding: '0.625rem 1.5rem',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                  }}
                >
                  Contact Support
                </button>
              </div>
            )}
          </main>
        </div>
      )}
    </>
  );
}

export default App;
