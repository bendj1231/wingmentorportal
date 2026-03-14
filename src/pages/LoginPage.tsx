import React, { useState } from 'react';
import { Icons } from '../App';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface LoginPageProps {
    onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLogin();
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="login-container animate-fade-in" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative',
            zIndex: 10
        }}>
            <div className="login-card" style={{
                display: 'flex',
                width: '100%',
                maxWidth: '960px',
                minHeight: '600px',
                background: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden'
            }}>
                {/* Left Side (Dark Info Panel) */}
                <div className="login-info-panel" style={{
                    flex: '0 0 45%',
                    background: 'linear-gradient(135deg, #0f172a 0%, #032130 100%)',
                    padding: '3rem 2.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    textAlign: 'center',
                    paddingBottom: '3rem'
                }}>
                    <div className="login-logo" style={{ marginBottom: '2.5rem' }}>
                        <img src="/logo.png" alt="WingMentor Logo" style={{ width: '240px', height: 'auto', objectFit: 'contain' }} />
                    </div>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                        WingMentor Program<br />Portal
                    </h2>

                    <p style={{
                        color: '#cbd5e1',
                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                        marginBottom: '2.5rem',
                        maxWidth: '420px',
                        padding: '0 1rem'
                    }}>
                        This portal gives you direct access to the program's various pathways and your Pilot Recognition Profile — a comprehensive view of where you stand and what lies ahead. Explore in-depth insight into the aviation industry to understand the expectations, requirements, and benchmarks that define a competitive candidate. It is your launchpad for informed career decisions and strategic preparation.
                    </p>

                    <div className="system-status" style={{
                        marginTop: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.4rem'
                    }}>
                        <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#94a3b8',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase'
                        }}>
                            SYSTEM STATUS
                        </span>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            marginTop: '0.25rem'
                        }}>
                            <div style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: '#10b981',
                                boxShadow: '0 0 10px rgba(16, 185, 129, 0.9)'
                            }}></div>
                            <span style={{
                                color: '#34d399',
                                fontSize: '0.85rem',
                                fontWeight: 600
                            }}>
                                Operational
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side (Login Form) */}
                <div className="login-form-panel" style={{
                    flex: '1',
                    padding: '4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Please enter your credentials to continue.</p>

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
                                    padding: '0.875rem 1rem 0.875rem 2.85rem',
                                    borderRadius: '10px',
                                    border: '1px solid #cbd5e1',
                                    backgroundColor: '#ffffff',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    color: '#0f172a'
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#2563eb';
                                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                    e.currentTarget.style.boxShadow = 'none';
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
                                    padding: '0.875rem 1rem 0.875rem 2.85rem',
                                    borderRadius: '10px',
                                    border: '1px solid #cbd5e1',
                                    backgroundColor: '#ffffff',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    color: '#0f172a'
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#2563eb';
                                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                required
                            />
                        </div>

                        <div style={{ textAlign: 'right', marginBottom: '2.5rem', marginTop: '0.5rem' }}>
                            <a href="#" style={{ color: '#2563eb', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>
                                Forgot Password?
                            </a>
                        </div>

                        <button type="submit" disabled={loading} style={{
                            width: '100%',
                            padding: '1.1rem',
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            opacity: loading ? 0.7 : 1,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                            onMouseOver={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.backgroundColor = '#1e293b';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.backgroundColor = '#0f172a';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                                }
                            }}
                        >
                            {loading ? 'Authenticating...' : 'Access Platform'}
                            {!loading && <Icons.ArrowRight style={{ width: 18, height: 18 }} />}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#64748b' }}>
                            Not a member? <a href="#" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>Create an account</a>
                        </div>
                    </form>
                </div>
            </div>

            <div style={{
                position: 'fixed',
                bottom: '2rem',
                left: '0',
                width: '100%',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '0.75rem',
                zIndex: 10
            }}>
                © 2026 WingMentor Inc. Authorized Personnel Only.
            </div>
        </div>
    );
};
