import React, { useState } from 'react';
import { Icons } from '../App';
import type { UserProfile } from '../types/user';
import { RestrictionPage } from './RestrictionPage';

interface Module {
    id: string;
    number: string;
    title: string;
    bullets: string[];
    description: string;
    status?: string;
    badge?: string;
    badgeColor?: string;
    icon: keyof typeof Icons;
    onLaunch?: () => void;
}

interface FoundationalProgramPageProps {
    onBack?: () => void;
    onLogout?: () => void;
    onStartEnrollment?: () => void;
    onStartSlideshow?: () => void;
    onSelectDownload?: () => void;
    onLaunchW1000?: () => void;
    onLaunchMentorship?: () => void;
    onLaunchModule01?: () => void;
    onLaunchModule02?: () => void;
    onLaunchModule03?: () => void;
    completedModules?: string[];
    userProfile?: UserProfile | null;
}

const FoundationalProgramPage: React.FC<FoundationalProgramPageProps> = ({
    onBack,
    onLogout,
    onStartEnrollment,
    onLaunchW1000,
    onLaunchMentorship,
    onLaunchModule01,
    onLaunchModule02,
    onLaunchModule03,
    completedModules = [],
    userProfile
}) => {
    const [activeView, setActiveView] = useState<'cards' | 'core' | 'profile' | 'overview' | 'module-detail'>('cards');
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [hoveredModule, setHoveredModule] = useState<string | null>(null);

    const displayName =
        (userProfile?.displayName && userProfile.displayName.trim()) ||
        [userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(' ').trim() ||
        userProfile?.email ||
        'Pilot';

    // Check if user has access to foundational program
    const checkProgramAccess = () => {
        if (!userProfile) return true; // Allow access if no profile (guest/preview mode)
        
        const foundationalAccess = userProfile.appAccess?.find(access => access.appId === 'foundational');
        if (!foundationalAccess) {
            // If no specific access, check if it's required (it is)
            return true; // Default to granted for required apps
        }
        
        return foundationalAccess.granted && !foundationalAccess.restricted;
    };

    // If access is restricted, show restriction page
    if (!checkProgramAccess()) {
        return (
            <RestrictionPage
                onBack={() => onBack?.() || (() => {})}
                userProfile={userProfile!}
                programName="Foundational Program"
                restrictionReason="Your access to the Foundational Program has been restricted by an administrator. Please contact your mentor or program administrator for assistance."
            />
        );
    }

    const modules: Module[] = [
        {
            id: 'stage-1',
            number: '01',
            title: 'Initial Program Module',
            bullets: [
                'Current Industry Status',
                'Pilot Gap Market Analysis',
                'Indoctrination Protocols'
            ],
            description: 'A deep dive into the current status of the aviation industry and the pilot market. Understand the systemic gaps in training and employment that WingMentor addresses through its foundational indoctrination.',
            status: 'In Progress',
            badge: 'In Progress',
            badgeColor: '#ecfdf5',
            icon: 'Book',
            onLaunch: onLaunchModule01
        },
        {
            id: 'stage-2',
            number: '02',
            title: 'Initial Examination Module',
            bullets: [
                'Academic Bridge Knowledge',
                'Baseline Retention',
                'Initial Skills Record'
            ],
            description: 'After the initial induction, you must prepare for a knowledge assessment based on the industry information provided. Your baseline retention is evaluated using integrated FAA/CAAP standards to establish your first verified skills record.',
            status: 'Examination',
            icon: 'FileText',
            onLaunch: () => console.log('Launch Initial Examination Module')
        },
        {
            id: 'stage-3',
            number: '03',
            title: 'Global Industry Registry',
            bullets: [
                'Centralized Professional Record',
                'Recruitment Transparency',
                'Pilot Recognition Metrics'
            ],
            description: 'All examination outcomes are safely archived within the Global Industry Registry. This serves as your verifiable professional record, ensuring transparency and credibility for airline recruitment partners.',
            icon: 'Book',
            onLaunch: () => console.log('Launch Stage 3')
        },
        {
            id: 'stage-4',
            number: '04',
            title: 'Mentorship Module',
            bullets: [
                'Mentorship Fundamentals',
                'Psychological Awareness',
                'Peer Observation Psychology'
            ],
            description: 'Learn the core difference between instructing and mentoring. This stage focuses on self-assessment, issue-resolution techniques, and the pre-psychology of peer observation.',
            icon: 'Users',
            onLaunch: onLaunchModule02
        },
        {
            id: 'stage-5',
            number: '05',
            title: 'Pre-Mentorship Examination & Observation',
            bullets: [
                'Mentorship Prep Exam',
                'Practical Interview',
                '10hr Observation Requirement'
            ],
            description: 'Prior to your 20-hour official supervised phase, you must pass a pre-examination on mentorship knowledge and complete 10 hours of active peer mentorship observation.',
            status: 'Examination',
            icon: 'Activity',
            onLaunch: onLaunchModule03
        },
        {
            id: 'stage-6',
            number: '06',
            title: 'Supervised Mentorship',
            bullets: [
                '20-Hour Mentorship Goal',
                'Objective Logging',
                'Consultation Delivery'
            ],
            description: 'Execute 20 hours of supervised, tracked peer mentorship. You must maintain highly detailed, objective logs delivering accurate problem-solving consultations and prescriptions.',
            badge: '20h Milestone',
            badgeColor: '#fff7ed',
            icon: 'Award',
            onLaunch: onLaunchW1000
        },
        {
            id: 'stage-8',
            number: '08',
            title: 'Advanced Mentorship & Leadership Milestone',
            bullets: [
                '50-Hour Milestone',
                'Advanced Instruction Prep',
                'Ecosystem Leadership'
            ],
            description: 'Continue your mentorship to the 50-hour milestone to demonstrate sustained leadership and advanced instructional readiness within the WingMentor ecosystem.',
            badge: '50h Milestone',
            badgeColor: '#f0f9ff',
            icon: 'Award',
            onLaunch: () => console.log('Launch Stage 8')
        },
        {
            id: 'stage-9',
            number: '09',
            title: 'AIRBUS Recognition Interview',
            bullets: [
                'Industry Evaluation',
                'AIRBUS Recognition',
                'Airline Placement Prep'
            ],
            description: 'The final culmination of the program: the AIRBUS Recognition Interview. This rigorous assessment verifies your readiness for direct airline placement and official industry recognition.',
            status: 'Examination',
            badge: 'Final Evaluation',
            badgeColor: '#f0f9ff',
            icon: 'Activity',
            onLaunch: () => console.log('Launch Stage 9')
        },
        {
            id: 'stage-7',
            number: '07',
            title: 'Accreditation & Professional Prescription',
            bullets: [
                'Mentorship Evaluation',
                'Industry Credentials',
                'Advanced Ecosystem Placement'
            ],
            description: 'Upon meeting criteria, your experience is accredited against industry standards recognized by major partners, authorizing you for advanced placement within the ecosystem.',
            badge: 'Accreditation',
            badgeColor: '#ecfdf5',
            icon: 'Briefcase',
            onLaunch: onLaunchMentorship
        },
        {
            id: 'stage-10',
            number: '10',
            title: 'WingMentor Certification & Recognition',
            bullets: [
                'Final Accreditation',
                'Industry Endorsement',
                'Registry Verification'
            ],
            description: 'Official certification of all mentorship hours and industry recognition. Your profile is now verified for our global airline partners and the industry registry.',
            badge: 'Certified',
            badgeColor: '#f0f9ff',
            icon: 'CheckCircle',
            onLaunch: () => console.log('Launch Stage 10')
        }
    ];

    const overviewCards = [
        {
            title: "The Pilot Gap",
            description: "Maps the critical transition between flight school graduation and airline employment. This program provides recent graduates with essential hands-on experience, helping you maintain strict professional proficiency during extended hiring cycles. Bridge the 1,500-hour gap through structured peer mentorship and build the data-driven portfolio that airlines demand.",
            tag: "1. The Context",
            image: "https://lh3.googleusercontent.com/d/1jL8lgdJZgdMrzUJkhvDOrlb1S8s7dEb4",
            bullets: []
        },
        {
            title: "Wingmentorship Approach",
            description: "We create a database of vetting screened pilots based not just on flight hours, but on industry recognition through EBT & CBTA applications provided by Airbus, Foundational Program leadership skills, and our pilot recognition logging system. Our mentorship program builds credible and accredited experience for pilots to gain prior to their interview with an ATO or any aviation body.",
            tag: "2. The Goal",
            image: "https://lh3.googleusercontent.com/d/1hHcJHmG0pTPDuvgiv79l88VpPz_lOXi1",
            bullets: []
        },
        {
            title: "Pilot Recognition & Advocacy",
            description: "Your efforts and input won't go to waste. Your data is recognized by airlines, manufacturers, and industry insiders to give pilots what they really want: the chance to be seen. Gain guidance and a clear pathway while meeting the verified expectations of global aviation governing bodies.",
            tag: "3. Recognition",
            image: "https://lh3.googleusercontent.com/d/1MfE9fiot6b9kCpgwQfc4aUY6e317nrUj",
            bullets: []
        },
        {
            title: "Instructor vs WingMentor",
            description: "Traditional instructors often struggle to support dozens of students simultaneously. WingMentors provide the one-on-one consultation and targeted problem-solving that large classrooms lack. This accredited program builds the leadership skills essential for future flight instructors and airline-bound pilots, ensuring you are truly industry-ready.",
            tag: "4. The Difference",
            image: "https://lh3.googleusercontent.com/d/1GyMG1004Ny93i4_ktGikIXgzy-FHiPBI",
            bullets: []
        }
    ];

    // Helper sub-component for the horizontal cards
    const HorizontalCard = ({
        title,
        description,
        image,
        onClick,
        isLocked = false,
        tag
    }: {
        title: string;
        description: string;
        image: string;
        onClick?: () => void;
        isLocked?: boolean;
        tag?: string;
    }) => (
        <div
            className="horizontal-card"
            style={{
                cursor: isLocked ? 'default' : 'pointer',
                padding: 0,
                position: 'relative',
                minHeight: '180px',
                opacity: isLocked ? 0.75 : 1
            }}
            onClick={isLocked ? undefined : onClick}
        >
            <div className="horizontal-card-content-wrapper" style={{ padding: '2rem', height: '100%', width: '100%', position: 'relative', zIndex: 10 }}>
                <div style={{ width: '45%', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: isLocked ? 'rgba(241, 245, 249, 0.5)' : 'rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: isLocked ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(255, 255, 255, 0.6)',
                        flexShrink: 0,
                        boxShadow: isLocked ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }}>
                        {isLocked ? (
                            <Icons.Lock style={{ width: 20, height: 20, color: '#94a3b8' }} />
                        ) : (
                            <div style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: '#2563eb',
                                boxShadow: '0 0 12px rgba(37, 99, 235, 0.4)'
                            }} />
                        )}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        {tag && <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{tag}</div>}
                        <h3 className="horizontal-card-title" style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 600 }}>{title}</h3>
                        <p className="horizontal-card-desc" style={{ marginBottom: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '100%' }}>{description}</p>
                    </div>
                </div>
                {!isLocked && (
                    <div className="hub-card-arrow" style={{
                        position: 'absolute',
                        right: '2rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 20,
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}>
                        <Icons.ArrowRight style={{ width: 24, height: 24 }} />
                    </div>
                )}
            </div>
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '55%',
                zIndex: 1,
                overflow: 'hidden',
                borderRadius: '0 12px 12px 0'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, white 0%, rgba(255, 255, 255, 0.8) 40%, transparent 100%)',
                    zIndex: 2
                }} />
                <img
                    src={image}
                    alt={title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>
        </div>
    );

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'auto', background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)' }}>
            <main className="dashboard-card" style={{
                position: 'relative',
                overflow: 'visible',
                backgroundColor: 'transparent',
                maxWidth: '960px',
                margin: '0 auto'
            }}>

                <header className="dashboard-header" style={{
                    borderBottom: '1px solid #f1f5f9',
                    paddingBottom: '2.5rem',
                    backgroundColor: 'white',
                    position: 'sticky',
                    top: 0,
                    zIndex: 20,
                    boxShadow: '0 6px 12px rgba(15,23,42,0.05)'
                }}>
                    <div style={{ position: 'absolute', top: '1.5rem', left: '2rem' }}>
                        <button
                            className="back-btn"
                            onClick={() => {
                                if (activeView === 'module-detail') setActiveView('core');
                                else if (activeView === 'core') setActiveView('cards');
                                else if (activeView === 'profile') setActiveView('cards');
                                else if (activeView === 'overview') setActiveView('cards');
                                else if (activeView === 'cards') onBack?.();
                            }}
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
                            <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> {activeView === 'overview' ? 'Back to Dashboard' : 'Back'}
                        </button>
                    </div>

                    <div style={{ position: 'absolute', top: '1.5rem', right: '2rem' }}>
                        <button
                            className="platform-logout-btn"
                            onClick={onLogout}
                            style={{
                                padding: '0.5rem 1rem',
                                border: '1px solid #f1f5f9',
                                background: 'white',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#64748b',
                                borderRadius: '10px',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.color = '#ef4444';
                                e.currentTarget.style.borderColor = '#fee2e2';
                                e.currentTarget.style.backgroundColor = '#fef2f2';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.color = '#64748b';
                                e.currentTarget.style.borderColor = '#f1f5f9';
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                            }}
                        >
                            <Icons.LogOut style={{ width: 16, height: 16 }} />
                            Logout
                        </button>
                    </div>

                    <div className="dashboard-logo" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                        <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '240px' }} />
                    </div>

                    <div className="dashboard-subtitle" style={{ letterSpacing: '0.3em', color: '#2563eb', fontWeight: 700 }}>
                        {activeView === 'overview' ? 'PROGRAM OVERVIEW' : 'CONNECTING PILOTS TO THE INDUSTRY'}
                    </div>

                    <h1 className="dashboard-title" style={{
                        fontSize: '3.3rem',
                        marginTop: '0.5rem',
                        marginBottom: '0.5rem',
                        color: '#0f172a'
                    }}>
                        {activeView === 'overview' ? 'Program Overview' : 'Foundational Mentorship'}
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
                        {activeView === 'overview'
                            ? "Explore the core pillars of the WingMentor Foundational Program. Designed to bridge the pilot gap through EBT and CBTA standards, our data-driven mentorship and accredited methodology provide the verifiable credentials required for the airline flight deck."
                            : "Navigate the 200-to-1,500 hour gap through a structured journey: from 'The Whats'—analyzing low-timer identity and industry risk—to 'The Solutions'—mastering CRM and building a verifiable leadership portfolio through 20+ hours of peer mentorship. Start aligning your profile with airline-level EBT standards today."
                        }
                    </p>

                    {/* Sleek Corporate Toggle */}
                    {activeView === 'overview' ? null : (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{
                                backgroundColor: '#f1f5f9',
                                padding: '4px',
                                borderRadius: '12px',
                                display: 'inline-flex',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                            }}>
                                <button
                                    onClick={() => setIsEnrolled(false)}
                                    style={{
                                        padding: '8px 24px',
                                        borderRadius: '10px',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        transition: 'all 0.2s ease',
                                        backgroundColor: !isEnrolled ? '#ffffff' : 'transparent',
                                        color: !isEnrolled ? '#0f172a' : '#64748b',
                                        boxShadow: !isEnrolled ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Pre-Enrolled
                                </button>
                                <button
                                    onClick={() => setIsEnrolled(true)}
                                    style={{
                                        padding: '8px 24px',
                                        borderRadius: '10px',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        transition: 'all 0.2s ease',
                                        backgroundColor: isEnrolled ? '#ffffff' : 'transparent',
                                        color: isEnrolled ? '#0f172a' : '#64748b',
                                        boxShadow: isEnrolled ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Enrolled
                                </button>
                            </div>
                        </div>
                    )}
                </header>

                <div className="dashboard-content" style={{
                    padding: activeView === 'overview' ? '0' : '3rem',
                    backgroundColor: activeView === 'overview' ? '#f8fafc' : 'white',
                    maxWidth: 'none'
                }}>
                    {activeView === 'cards' ? (
                        <div className="cards-list" style={{ gap: '1.5rem' }}>
                            {!isEnrolled ? (
                                <>
                                    {/* Card 1: Program Overview */}
                                    <HorizontalCard
                                        title="Program Overview"
                                        description="Bridge the critical 1,500-hour gap with a data-driven portfolio. Our program leverages EBT and CBTA standards to build the leadership skills and accredited experience required to be recognized by global aviation bodies."
                                        image="https://lh3.googleusercontent.com/d/1K2CccSObEUsvy6unD8iqWjSjn-Zcw08g"
                                        onClick={() => {
                                            setCurrentCardIndex(0);
                                            setActiveView('overview');
                                        }}
                                    />

                                    {/* Card 2: Program Enrollment (Pre-Enrolled) */}
                                    <HorizontalCard
                                        title="Program Enrollment"
                                        description="Secure your position to connect with peers, log verifiable simulator hours, and build the data profile required by our industry partners. Status: Registration Open."
                                        image="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800&auto=format&fit=crop"
                                        onClick={onStartEnrollment}
                                    />
                                </>
                            ) : (
                                <>
                                    {/* Card 2: Program Core (Unlocked) */}
                                    <HorizontalCard
                                        title="Program Core"
                                        description="Access your active mentorship modules, required readings, and introductory scenarios."
                                        image="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=800&auto=format&fit=crop"
                                        onClick={() => setActiveView('core')}
                                    />

                                    {/* Card 3: Pilot Profile */}
                                    <HorizontalCard
                                        title="Pilot Profile"
                                        description="Manage your personal flight logbooks, view documented mentorship hours, and check certification statuses."
                                        image="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop"
                                        onClick={() => setActiveView('profile')}
                                    />
                                </>
                            )}
                        </div>
                    ) : activeView === 'overview' ? (
                        <div className="animate-fade-in" style={{
                            position: 'relative',
                            minHeight: '600px',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: '#f8fafc',
                            overflow: 'hidden',
                            borderRadius: '0 0 12px 12px'
                        }}>
                            {/* Progress Bar */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '6px',
                                width: `${((currentCardIndex + 1) / overviewCards.length) * 100}%`,
                                backgroundColor: '#2563eb',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                zIndex: 50
                            }} />

                            {/* Flashcard Container */}
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '4rem 2rem'
                            }}>
                                <div className="animate-slide-up" key={currentCardIndex} style={{
                                    width: '100%',
                                    maxWidth: '900px',
                                    position: 'relative',
                                    minHeight: '420px',
                                    borderRadius: '24px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    border: '1px solid #e2e8f0', // border-slate-200
                                    overflow: 'hidden',
                                    backgroundColor: '#fcfaf7'
                                }}>
                                    {/* Layer 2: Background Image (Z-index 0) */}
                                    <img
                                        src={overviewCards[currentCardIndex].image}
                                        alt={overviewCards[currentCardIndex].title}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: '-25%',
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                            zIndex: 0
                                        }}
                                    />

                                    {/* Layer 3: Seamless Frosted Glass Fade (Z-index 10) */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        zIndex: 10,
                                        pointerEvents: 'none'
                                    }}>
                                        {/* Seamless Blur & Gradient Mask */}
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to right, transparent 30%, rgba(255, 255, 255, 0.95) 55%, #ffffff 100%)',
                                            backdropFilter: 'blur(20px)',
                                            WebkitBackdropFilter: 'blur(20px)',
                                            WebkitMaskImage: 'linear-gradient(to right, transparent 30%, black 55%)',
                                            maskImage: 'linear-gradient(to right, transparent 30%, black 55%)'
                                        }} />

                                        {/* Text Layout bounds */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            width: '55%',
                                            height: '100%',
                                            padding: '2rem 3rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            pointerEvents: 'auto'
                                        }}>
                                            <div style={{ marginBottom: '1.25rem' }}>
                                                <div style={{
                                                    color: '#1d4ed8', // text-blue-700
                                                    fontWeight: 700, // font-bold
                                                    fontSize: '0.75rem', // text-xs
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em', // tracking-widest
                                                    marginBottom: '0.75rem' // mb-3
                                                }}>
                                                    {overviewCards[currentCardIndex].tag}
                                                </div>

                                                <h1 style={{
                                                    fontSize: '1.875rem', // text-3xl
                                                    fontFamily: "'Georgia', serif",
                                                    color: '#0f172a', // text-slate-900
                                                    marginBottom: '1.25rem', // mb-5
                                                    fontWeight: 700
                                                }}>
                                                    {overviewCards[currentCardIndex].title}
                                                </h1>
                                            </div>

                                            <p style={{
                                                color: '#0f172a', // text-slate-900
                                                fontSize: '15px', // text-[15px]
                                                lineHeight: 1.625, // leading-relaxed
                                                fontWeight: 500, // font-medium
                                                marginBottom: overviewCards[currentCardIndex].bullets.length > 0 ? '1.5rem' : '0'
                                            }}>
                                                {overviewCards[currentCardIndex].description}
                                            </p>

                                            {overviewCards[currentCardIndex].bullets.length > 0 && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    {overviewCards[currentCardIndex].bullets.map((bullet, idx) => (
                                                        <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                                            <Icons.CheckCircle style={{ width: 14, height: 14, color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
                                                            <span style={{ color: '#1e293b', fontSize: '0.875rem', lineHeight: 1.5 }}>
                                                                {bullet}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Flashcard Navigation Footer */}
                            <div style={{
                                padding: '2rem 4rem',
                                borderTop: '1px solid #f1f5f9',
                                backgroundColor: 'white',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <button
                                    onClick={() => currentCardIndex > 0 && setCurrentCardIndex(currentCardIndex - 1)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: currentCardIndex === 0 ? 'transparent' : '#64748b',
                                        cursor: currentCardIndex === 0 ? 'default' : 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s ease',
                                        pointerEvents: currentCardIndex === 0 ? 'none' : 'auto'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.color = '#0f172a'}
                                    onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                                >
                                    <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Previous
                                </button>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {overviewCards.map((_, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                width: i === currentCardIndex ? '20px' : '8px',
                                                height: '8px',
                                                borderRadius: '4px',
                                                backgroundColor: i === currentCardIndex ? '#2563eb' : '#e2e8f0',
                                                transition: 'all 0.3s ease'
                                            }}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        if (currentCardIndex < overviewCards.length - 1) {
                                            setCurrentCardIndex(currentCardIndex + 1);
                                        } else {
                                            onStartEnrollment?.();
                                        }
                                    }}
                                    style={{
                                        backgroundColor: '#2563eb',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.75rem 2rem',
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.625rem',
                                        boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#1d4ed8';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = '#2563eb';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {currentCardIndex === overviewCards.length - 1 ? 'Get Started' : 'Next'}
                                    <Icons.ArrowRight style={{ width: 16, height: 16 }} />
                                </button>
                            </div>
                        </div>
                    ) : activeView === 'core' ? (
                        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                                <div>
                                    <div style={{ color: '#0284c7', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                                        FOUNDATIONAL PROGRAM
                                    </div>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
                                        Program Core Home
                                    </h2>
                                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                                        Your active pathways and foundational assessments.
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                                {/* Pathway connecting line */}
                                <div style={{
                                    position: 'absolute',
                                    left: '46px', /* 24px padding + 22px half of badge */
                                    top: '30px',
                                    bottom: '30px',
                                    width: '2px',
                                    background: 'linear-gradient(to bottom, #cbd5e1 0%, #e2e8f0 50%, #cbd5e1 100%)',
                                    zIndex: 0
                                }} />

                                {modules.map((module) => {
                                    const isHovered = hoveredModule === module.id;
                                    const isExam = module.status === 'Examination';
                                    const isSuccessStage = ['03', '07'].includes(module.number);
                                    const isResultFactor = module.number === '03';

                                    return (
                                        <div
                                            key={module.id}
                                            style={{
                                                position: 'relative',
                                                backgroundColor: isExam
                                                    ? (isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(239, 246, 255, 0.55)')
                                                    : (isSuccessStage
                                                        ? (isHovered ? 'rgba(220, 252, 231, 0.8)' : 'rgba(220, 252, 231, 0.4)')
                                                        : (isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(241, 245, 249, 0.6)')),
                                                backdropFilter: 'blur(16px)',
                                                WebkitBackdropFilter: 'blur(16px)',
                                                border: isExam
                                                    ? '1px solid rgba(191, 219, 254, 0.6)'
                                                    : (isSuccessStage ? '1px solid rgba(134, 239, 172, 0.5)' : '1px solid rgba(255, 255, 255, 0.8)'),
                                                borderLeft: isExam ? '4px solid #1e3a8a' : (isSuccessStage ? '4px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.8)'),
                                                borderRadius: '24px',
                                                cursor: isResultFactor ? 'default' : 'pointer',
                                                boxShadow: isHovered
                                                    ? '0 12px 24px -4px rgba(0,0,0,0.08), 0 4px 8px -2px rgba(0,0,0,0.04)'
                                                    : (isExam ? '0 8px 32px rgba(15, 23, 42, 0.05)' : '0 8px 32px rgba(15, 23, 42, 0.04)'),
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                transform: (isHovered && !isResultFactor) ? 'translateY(-2px)' : 'translateY(0)',
                                                overflow: 'hidden',
                                                zIndex: 1
                                            }}
                                            onClick={() => {
                                                if (!isResultFactor) {
                                                    setSelectedModule(module);
                                                    setActiveView('module-detail');
                                                }
                                            }}
                                            onMouseEnter={() => setHoveredModule(module.id)}
                                            onMouseLeave={() => setHoveredModule(null)}
                                        >
                                            {/* Compact Row - always visible */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1.5rem',
                                                padding: '1.5rem 1.5rem',
                                            }}>
                                                <div style={{
                                                    width: '44px',
                                                    height: '44px',
                                                    borderRadius: '12px',
                                                    background: isExam
                                                        ? (isHovered ? 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)' : 'linear-gradient(135deg, #facc15 0%, #eab308 100%)')
                                                        : (isSuccessStage ? (isHovered ? '#16a34a' : '#22c55e') : (isHovered ? '#0f172a' : '#ffffff')),
                                                    border: isExam ? '1px solid #fef08a' : (isSuccessStage ? 'none' : '1px solid #e2e8f0'),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    fontSize: '0.85rem',
                                                    fontWeight: 800,
                                                    color: isExam ? '#ffffff' : (isResultFactor ? '#ffffff' : (isHovered ? '#ffffff' : '#1e293b')),
                                                    textShadow: isExam ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: isExam ? '0 4px 12px rgba(234, 179, 8, 0.4)' : '0 2px 6px rgba(0,0,0,0.04)',
                                                    zIndex: 2 // sit above connecting line
                                                }}>
                                                    {module.number === '03' ? <Icons.BookOpen style={{ width: 22, height: 22 }} /> :
                                                        module.number === '07' ? <Icons.Briefcase style={{ width: 22, height: 22 }} /> :
                                                            module.number}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        color: '#64748b',
                                                        letterSpacing: '0.05em',
                                                        marginBottom: '2px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}>
                                                        {module.number === '03' ? (
                                                            'INDUSTRY REPOSITORY'
                                                        ) : module.number === '07' ? (
                                                            'INDUSTRY ACCREDITATION'
                                                        ) : (
                                                            `STAGE ${module.number}`
                                                        )}
                                                    </div>
                                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 400, fontFamily: 'Georgia, serif', color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{module.title}</h3>
                                                </div>
                                                {completedModules.includes(module.id) ? (
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        backgroundColor: '#ecfdf5',
                                                        color: '#059669',
                                                        padding: '0.4rem 1rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 800,
                                                        border: '1px solid #10b981',
                                                        boxShadow: '0 2px 4px rgba(16, 185, 129, 0.1)'
                                                    }}>
                                                        <Icons.CheckCircle style={{ width: 14, height: 14 }} />
                                                        COMPLETED
                                                    </div>
                                                ) : module.badge && (
                                                    <span style={{
                                                        padding: '0.35rem 0.85rem',
                                                        backgroundColor: module.badgeColor === '#fef2f2' ? '#fee2e2' :
                                                            module.badgeColor === '#fff7ed' ? '#ffedd5' : '#dbeafe',
                                                        color: module.badgeColor === '#fef2f2' ? '#991b1b' :
                                                            module.badgeColor === '#fff7ed' ? '#9a3412' : '#1e40af',
                                                        borderRadius: '20px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 800,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.04em',
                                                        whiteSpace: 'nowrap',
                                                        flexShrink: 0
                                                    }}>{module.badge}</span>
                                                )}
                                                {!isResultFactor && (
                                                    <Icons.ChevronRight style={{
                                                        width: 18,
                                                        height: 18,
                                                        color: isHovered ? (isExam ? '#1d4ed8' : '#3b82f6') : '#94a3b8',
                                                        flexShrink: 0,
                                                        transition: 'all 0.3s ease',
                                                        transform: isHovered ? 'translateX(3px)' : 'translateX(0)'
                                                    }} />
                                                )}
                                            </div>

                                            {/* Expanded content - revealed on hover */}
                                            <div style={{
                                                maxHeight: isHovered ? '200px' : '0',
                                                overflow: 'hidden',
                                                transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                            }}>
                                                <div style={{
                                                    padding: '0 1.5rem 1.25rem 1.5rem',
                                                    paddingLeft: 'calc(1.5rem + 44px + 1.5rem)',
                                                }}>
                                                    <p style={{
                                                        fontSize: '0.9rem',
                                                        color: isExam ? '#1e40af' : '#64748b',
                                                        margin: '0 0 1rem 0',
                                                        lineHeight: 1.6,
                                                        fontWeight: isExam ? 500 : 400
                                                    }}>{module.description}</p>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                        {module.bullets.map((bullet, idx) => (
                                                            <span key={idx} style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.4rem',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                                color: isExam ? '#1e3a8a' : '#475569',
                                                                background: isExam ? '#dbeafe' : '#f1f5f9',
                                                                borderRadius: '8px',
                                                                padding: '0.35rem 0.75rem',
                                                            }}>
                                                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: isExam ? '#2563eb' : '#3b82f6' }} />
                                                                {bullet}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : activeView === 'module-detail' && selectedModule ? (
                        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
                            <button
                                onClick={() => setActiveView('core')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: '#64748b',
                                    background: 'none',
                                    border: 'none',
                                    padding: '0.5rem 0',
                                    marginBottom: '2rem',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    fontWeight: 500
                                }}
                            >
                                <Icons.ArrowLeft style={{ width: 18, height: 18 }} />
                                Back to Modules
                            </button>

                            {/* High-Fidelity Detail View for All Modules */}
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
                                <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '1.5rem', display: 'block', margin: '0 auto 1.5rem auto' }} />

                                <div style={{
                                    color: selectedModule.status === 'Examination' ? '#e11d48' : '#0284c7',
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.25em',
                                    textTransform: 'uppercase',
                                    marginBottom: '1rem'
                                }}>
                                    {selectedModule.status === 'Examination' ? 'MANDATORY EXAMINATION' : `MODULE ${selectedModule.number}`}
                                </div>

                                <h2 style={{ fontSize: '2.5rem', fontWeight: 400, color: '#0f172a', marginBottom: '2.5rem', fontFamily: 'Georgia, serif' }}>
                                    {selectedModule.title}
                                </h2>

                                <div style={{ maxWidth: '42rem', margin: '0 auto 3rem auto', textAlign: 'left' }}>
                                    <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.8 }}>
                                        {selectedModule.description}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button
                                        onClick={selectedModule.onLaunch}
                                        style={{
                                            backgroundColor: '#2563eb',
                                            color: 'white',
                                            border: 'none',
                                            padding: '1rem 3rem',
                                            borderRadius: '12px',
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = '#1d4ed8';
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = '#2563eb';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        Launch Module Viewer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 700 }}>Pilot Profile</h2>
                            <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                                        <Icons.User style={{ width: 40, height: 40 }} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: 700, fontSize: '1.4rem' }}>Candidate Alpha</h3>
                                        <p style={{ color: '#64748b' }}>Registered Pilot ID: WM-10029</p>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ background: 'white', padding: '1.25rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Hours</p>
                                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>12.5 / 50</p>
                                    </div>
                                    <div style={{ background: 'white', padding: '1.25rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Modules Finished</p>
                                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>3 / 12</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="dashboard-footer" style={{
                    marginTop: '1rem',
                    padding: '2rem 3.5rem',
                    backgroundColor: '#f8fafc',
                    borderTop: '1px solid #f1f5f9',
                    textAlign: 'center'
                }}>
                    <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                        Need assistance? The WingMentor Support Network is active 24/7.
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
                    >
                        Access Help Directory
                    </button>
                </div>
            </main >
        </div >
    );
};

export default FoundationalProgramPage;
