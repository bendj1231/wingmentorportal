import React, { useEffect, useState } from 'react';
import { Icons } from '../App';
import { signIn } from '../lib/supabase-auth';
import { ForgotPasswordPage } from './ForgotPasswordPage';

const REMEMBER_STORAGE_KEY = 'wm-remember-email';
const REMEMBER_FLAG_KEY = 'wm-remember-active';

interface LoginPageProps {
    onLogin: (email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPortalInfo, setShowPortalInfo] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await signIn(email, password);
            onLogin(email);
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const savedRememberFlag = localStorage.getItem(REMEMBER_FLAG_KEY) === 'true';
        const savedEmail = savedRememberFlag ? localStorage.getItem(REMEMBER_STORAGE_KEY) : null;
        if (savedRememberFlag && savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (rememberMe && email.trim()) {
            localStorage.setItem(REMEMBER_STORAGE_KEY, email);
            localStorage.setItem(REMEMBER_FLAG_KEY, 'true');
        } else {
            localStorage.removeItem(REMEMBER_STORAGE_KEY);
            localStorage.removeItem(REMEMBER_FLAG_KEY);
        }
    }, [rememberMe, email]);
    return (
        <div className="login-container animate-fade-in" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2.5rem',
            position: 'relative',
            zIndex: 10,
            overflow: 'hidden'
        }}>
            {showForgotPassword ? (
                <ForgotPasswordPage onBack={() => setShowForgotPassword(false)} />
            ) : (
                <>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 80% 10%, rgba(14,165,233,0.25), transparent 40%)',
                    mixBlendMode: 'screen',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    width: '480px',
                    height: '480px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 60%)',
                    top: '15%',
                    right: '5%',
                    filter: 'blur(10px)',
                    opacity: 0.8,
                    pointerEvents: 'none'
                }} />
                <div className="login-card" style={{
                display: 'flex',
                width: '100%',
                maxWidth: '1180px',
                minHeight: '660px',
                background: 'rgba(255,255,255,0.92)',
                borderRadius: '24px',
                boxShadow: '0 40px 120px rgba(15,23,42,0.25)',
                border: '1px solid rgba(255,255,255,0.65)',
                overflow: 'hidden',
                backdropFilter: 'blur(18px)',
                transform: 'scale(1.05)',
                transformOrigin: 'center'
            }}>
                {/* Left Side (Dark Info Panel) */}
                <div className="login-info-panel" style={{
                    flex: '0 0 44%',
                    background: 'radial-gradient(circle at top, rgba(59,130,246,0.35), transparent 60%) , linear-gradient(145deg, #020817 0%, #04182b 60%, #032130 100%)',
                    padding: '3.5rem 2.8rem 3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    textAlign: 'center',
                    paddingBottom: '3rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: '20% 10% auto',
                        height: '220px',
                        background: 'radial-gradient(circle, rgba(9,132,227,0.25), transparent 70%)',
                        filter: 'blur(60px)',
                        opacity: 0.8,
                        pointerEvents: 'none'
                    }} />
                    <div style={{
                        position: 'absolute',
                        inset: 'auto 15% 5%',
                        height: '120px',
                        background: 'radial-gradient(circle, rgba(14,165,233,0.15), transparent 70%)',
                        filter: 'blur(80px)',
                        pointerEvents: 'none'
                    }} />
                    <div className="login-logo" style={{ marginBottom: '2rem' }}>
                        <img src="/logo.png" alt="WingMentor Logo" style={{ width: '240px', height: 'auto', objectFit: 'contain' }} />
                    </div>

                    <div style={{
                        fontSize: '0.8rem',
                        letterSpacing: '0.25em',
                        color: '#cbd5f5',
                        marginBottom: '0.75rem'
                    }}>MENTOR NETWORK</div>

                    <h2 style={{ fontSize: '1.7rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                        Pilot Portal
                    </h2>

                    <p style={{
                        color: '#cbd5e1',
                        fontSize: '0.92rem',
                        lineHeight: 1.65,
                        marginBottom: '1.25rem',
                        maxWidth: '440px',
                        padding: '0 1rem'
                    }}>
                        Access personalized program enrollment, pathway briefs, and WingMentor Pilot Portfolio data—covering flight experience, assessments, and ATS-ready records shared with approved aviation bodies. Explore the pilot network search for type-rating intel, airline requirements, and aircraft references, track recognition and examination outcomes, and retrieve your ATLAS CV dossier from one secure hub.
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowPortalInfo(true)}
                        style={{
                            border: '1px solid rgba(255,255,255,0.25)',
                            background: 'rgba(255,255,255,0.05)',
                            color: '#e2e8f0',
                            padding: '0.5rem 1.25rem',
                            borderRadius: '999px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            marginBottom: '2rem'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                        }}
                    >
                        Learn more
                    </button>

                </div>

                {/* Right Side (Login Form) */}
                <div className="login-form-panel" style={{
                    flex: '1',
                    padding: '4rem 4.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.95rem', fontWeight: 400, fontFamily: 'Georgia, serif', color: '#0f172a', marginBottom: '0.35rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Connecting pilots to the aviation industry</h2>
                        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Sign in with your WingMentor credentials.</p>
                    </div>

                    {error && (
                        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                            WINGMENTOR ACCOUNT
                        </div>

                        <div className="input-group" style={{ marginBottom: '1.25rem', position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#94a3b8',
                                display: 'flex',
                                zIndex: 1
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.95rem 1rem 0.95rem 2.85rem',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(148,163,184,0.5)',
                                    backgroundColor: 'rgba(248,250,252,0.7)',
                                    fontSize: '0.97rem',
                                    outline: 'none',
                                    transition: 'all 0.25s ease',
                                    color: '#0f172a',
                                    boxShadow: '0 15px 35px rgba(15,23,42,0.06)'
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#2563eb';
                                    e.currentTarget.style.boxShadow = '0 20px 45px rgba(37, 99, 235, 0.18)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(148,163,184,0.5)';
                                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(15,23,42,0.06)';
                                }}
                                required
                            />
                        </div>

                        <div className="input-group" style={{ marginBottom: '1rem', position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#94a3b8',
                                display: 'flex',
                                zIndex: 1
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.95rem 1rem 0.95rem 2.85rem',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(148,163,184,0.5)',
                                    backgroundColor: 'rgba(248,250,252,0.7)',
                                    fontSize: '0.97rem',
                                    outline: 'none',
                                    transition: 'all 0.25s ease',
                                    color: '#0f172a',
                                    boxShadow: '0 15px 35px rgba(15,23,42,0.06)'
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#2563eb';
                                    e.currentTarget.style.boxShadow = '0 20px 45px rgba(37, 99, 235, 0.18)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(148,163,184,0.5)';
                                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(15,23,42,0.06)';
                                }}
                                required
                            />
                        </div>

                        <div style={{ textAlign: 'right', marginBottom: '2.5rem', marginTop: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                style={{ color: '#2563eb', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <button type="submit" disabled={loading} style={{
                                padding: '1.1rem 2.75rem',
                                background: 'linear-gradient(120deg, #0f172a 0%, #111827 60%, #0b1120 100%)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.25s ease',
                                opacity: loading ? 0.75 : 1,
                                boxShadow: '0 25px 45px rgba(15,23,42,0.3)'
                            }}
                                onMouseOver={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                                        e.currentTarget.style.boxShadow = '0 30px 60px rgba(15,23,42,0.35)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 25px 45px rgba(15,23,42,0.3)';
                                    }
                                }}
                            >
                                {loading ? 'Authenticating...' : 'Login'}
                                {!loading && <Icons.ArrowRight style={{ width: 18, height: 18 }} />}
                            </button>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#475569', marginBottom: '1.5rem' }}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                style={{ width: '16px', height: '16px' }}
                            />
                            Remember me
                        </label>

                        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#64748b' }}>
                            Not a member? <a href="https://wmpilotnetwork.vercel.app" target="_blank" rel="noopener" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>Create an account</a>
                            <span style={{ margin: '0 0.35rem' }} aria-hidden="true">•</span>
                            <button
                                type="button"
                                onClick={() => window.open('https://wmpilotnetwork.vercel.app', '_blank', 'noopener')}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#2563eb',
                                    fontWeight: 600,
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}
                            >
                                Visit Pilot Network
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showPortalInfo && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(2,8,23,0.8)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        zIndex: 50
                    }}
                    onClick={() => setShowPortalInfo(false)}
                >
                    <div
                        style={{
                            maxWidth: '720px',
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            borderRadius: '24px',
                            padding: '3.5rem 3rem',
                            color: '#0f172a',
                            boxShadow: '0 40px 120px rgba(15,23,42,0.25)',
                            border: '1px solid rgba(255, 255, 255, 0.85)',
                            position: 'relative',
                            overflowY: 'auto',
                            maxHeight: '90vh',
                            textAlign: 'left'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            aria-label="Close"
                            onClick={() => setShowPortalInfo(false)}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                border: 'none',
                                background: 'rgba(15,23,42,0.05)',
                                borderRadius: '999px',
                                width: '36px',
                                height: '36px',
                                cursor: 'pointer',
                                fontSize: '1.25rem',
                                color: '#0f172a'
                            }}
                        >
                            ×
                        </button>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <img src="/logo.png" alt="WingMentor Logo" style={{ height: '110px', width: 'auto', objectFit: 'contain' }} />
                        </div>
                        <div style={{ color: '#0ea5e9', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
                            PROGRAM PORTAL
                        </div>
                        <h2 style={{ fontSize: '1.95rem', fontWeight: 400, color: '#0f172a', marginBottom: '2rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
                            About WingMentor Program Portal
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, textAlign: 'left' }}>
                                The portal is the enrollment gateway for WingMentor pilots. It surfaces every available pathway within the WM ecosystem and tailors recommendations using your Recognition data and Pilot Portfolio profile.
                            </p>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, textAlign: 'left' }}>
                                Your Pilot Portfolio consolidates flight experience, cognitive evaluations, and exam performance into ATS-formatted records that are securely shared with approved aviation industry bodies.
                            </p>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, textAlign: 'left' }}>
                                Through the pilot network search, you can review type-rating insights, airline requirements, POH references, and broader operational expectations sourced from partners worldwide.
                            </p>
                            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, margin: 0, textAlign: 'left' }}>
                                Recognition & Achievements keeps all official examination outcomes, interview boards, and feedback from accountable managers or heads of training in one authenticated archive, alongside access to your ATLAS CV and ATS data exports.
                            </p>
                        </div>
                    </div>
                </div>
            )}
                </>
            )}
        </div>
    );
};
