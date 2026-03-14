import React, { useState, useEffect } from 'react';
import type { UserProfile, AppAccess } from '../types/user';
import { AVAILABLE_APPS } from '../types/user';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { hasPermission } from '../lib/auth';


interface MentorManagementPageProps {
  onBack: () => void;
  onLogout: () => void;
  userProfile: UserProfile;
  onSwitchSystem: (system: 'pms' | 'wms' | 'super_admin') => void;
  currentSystem: 'pms' | 'wms' | 'super_admin';
}

// ── Mock users for dev mode ──
const MOCK_USERS: UserProfile[] = [
  {
    id: 'u1', email: 'benjamin@wingmentor.com', firstName: 'Benjamin', lastName: 'Bowler',
    displayName: 'Benjamin Bowler', role: 'super_admin', totalHours: 320, region: 'UAE',
    flightSchool: 'Emirates Flight Academy', enrolledPrograms: ['Foundational', 'ATPL Pathway'],
    appAccess: AVAILABLE_APPS.map(a => ({ appId: a.id, appName: a.name, granted: true, restricted: false })),
    createdAt: new Date('2024-06-01'), lastLogin: new Date(), status: 'active',
    moduleProgress: { 'mod-1': 100, 'mod-2': 85, 'mod-3': 60 }, performanceScore: 92
  },
  {
    id: 'u2', email: 'sarah.pilot@wingmentor.com', firstName: 'Sarah', lastName: 'Mitchell',
    displayName: 'Sarah Mitchell', role: 'mentor', totalHours: 210, region: 'UAE',
    flightSchool: 'Etihad Flight College', enrolledPrograms: ['Foundational', 'Transition'],
    appAccess: AVAILABLE_APPS.map(a => ({ appId: a.id, appName: a.name, granted: a.required || a.id === 'w1000', restricted: false })),
    createdAt: new Date('2024-08-15'), lastLogin: new Date('2025-03-10'), status: 'active',
    moduleProgress: { 'mod-1': 100, 'mod-2': 70, 'mod-3': 45 }, performanceScore: 78
  },
  {
    id: 'u3', email: 'james.cadet@wingmentor.com', firstName: 'James', lastName: 'Rivera',
    displayName: 'James Rivera', role: 'mentee', totalHours: 45, region: 'KSA',
    flightSchool: 'Oxford Saudi Aviation Academy', enrolledPrograms: ['Foundational'],
    appAccess: AVAILABLE_APPS.map(a => ({ appId: a.id, appName: a.name, granted: a.required, restricted: false })),
    createdAt: new Date('2025-01-20'), lastLogin: new Date('2025-03-12'), status: 'active',
    moduleProgress: { 'mod-1': 55, 'mod-2': 20 }, performanceScore: 64
  },
  {
    id: 'u4', email: 'fatima.mm@wingmentor.com', firstName: 'Fatima', lastName: 'Al-Rashid',
    displayName: 'Fatima Al-Rashid', role: 'mentor_manager', totalHours: 580, region: 'UAE',
    flightSchool: 'Emirates Flight Academy', enrolledPrograms: ['Foundational', 'Transition', 'ATPL Pathway'],
    appAccess: AVAILABLE_APPS.map(a => ({ appId: a.id, appName: a.name, granted: true, restricted: false })),
    createdAt: new Date('2024-03-10'), lastLogin: new Date('2025-03-13'), status: 'active',
    moduleProgress: { 'mod-1': 100, 'mod-2': 100, 'mod-3': 90 }, performanceScore: 95
  },
  {
    id: 'u5', email: 'ahmed.cadet@wingmentor.com', firstName: 'Ahmed', lastName: 'Hassan',
    displayName: 'Ahmed Hassan', role: 'mentee', totalHours: 12, region: 'Egypt',
    flightSchool: 'EgyptAir Training Center', enrolledPrograms: ['Foundational'],
    appAccess: AVAILABLE_APPS.map(a => ({ appId: a.id, appName: a.name, granted: a.required, restricted: false })),
    createdAt: new Date('2025-02-01'), lastLogin: new Date('2025-03-08'), status: 'pending',
    moduleProgress: { 'mod-1': 15 }, performanceScore: 30
  },
  {
    id: 'u6', email: 'oliver.pilot@wingmentor.com', firstName: 'Oliver', lastName: 'Chen',
    displayName: 'Oliver Chen', role: 'mentor', totalHours: 150, region: 'Singapore',
    flightSchool: 'Singapore Flying College', enrolledPrograms: ['Foundational', 'W1000 Simulator'],
    appAccess: AVAILABLE_APPS.map(a => ({ appId: a.id, appName: a.name, granted: a.required || a.id === 'w1000', restricted: a.id === 'mentorship' })),
    createdAt: new Date('2024-11-05'), lastLogin: new Date('2025-03-11'), status: 'active',
    moduleProgress: { 'mod-1': 90, 'mod-2': 60, 'mod-3': 30 }, performanceScore: 72
  },
  {
    id: 'u7', email: 'lisa.suspended@wingmentor.com', firstName: 'Lisa', lastName: 'Park',
    displayName: 'Lisa Park', role: 'mentee', totalHours: 8, region: 'South Korea',
    flightSchool: 'Korean Air Flight Academy', enrolledPrograms: ['Foundational'],
    appAccess: AVAILABLE_APPS.map(a => ({ appId: a.id, appName: a.name, granted: false, restricted: true })),
    createdAt: new Date('2025-01-10'), lastLogin: new Date('2025-02-15'), status: 'suspended',
    moduleProgress: { 'mod-1': 10 }, performanceScore: 18
  },
  {
    id: 'u8', email: 'david.terminated@wingmentor.com', firstName: 'David', lastName: 'Kumar',
    displayName: 'David Kumar', role: 'mentee', totalHours: 0, region: 'India',
    flightSchool: 'Indira Gandhi Rashtriya Uran Akademi', enrolledPrograms: [],
    appAccess: AVAILABLE_APPS.map(a => ({ appId: a.id, appName: a.name, granted: false, restricted: true })),
    createdAt: new Date('2024-12-01'), lastLogin: new Date('2025-01-05'), status: 'terminated',
    moduleProgress: {}, performanceScore: 0
  }
];

export const MentorManagementPage: React.FC<MentorManagementPageProps> = ({
  onBack,
  onLogout,
  userProfile,
  onSwitchSystem,
  currentSystem
}) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'apps' | 'stats' | 'email'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserProfile['role'] | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [detailPanelCollapsed, setDetailPanelCollapsed] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailRecipientFilter, setEmailRecipientFilter] = useState<string>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!selectedUser) {
      setDetailPanelCollapsed(false);
    }
  }, [selectedUser]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Load users from Firebase or mock ──
  const loadUsers = async () => {
    setLoading(true);
    try {
      if (db) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef);
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(d => {
          const data = d.data();
          return {
            ...data,
            id: d.id,
            email: data.email || '',
            firstName: data.firstName || data.displayName?.split(' ')[0] || '',
            lastName: data.lastName || data.displayName?.split(' ').slice(1).join(' ') || '',
            displayName: data.displayName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email || 'Unknown',
            role: data.role || 'mentee',
            status: data.status || 'active',
            enrolledPrograms: data.enrolledPrograms || [],
            appAccess: data.appAccess || AVAILABLE_APPS.map(a => ({ appId: a.id, appName: a.name, granted: a.required, restricted: false })),
            createdAt: data.createdAt?.toDate?.() || new Date(),
            lastLogin: data.lastLogin?.toDate?.() || null,
            moduleProgress: data.moduleProgress || {},
            performanceScore: data.performanceScore ?? 0,
            totalHours: data.totalHours || 0,
          } as UserProfile;
        });
        if (usersData.length > 0) {
          setUsers(usersData);
        } else {
          console.log('No users in Firestore, falling back to mock data');
          setUsers(MOCK_USERS);
        }
      } else {
        console.log('No Firebase DB, using mock users');
        setUsers(MOCK_USERS);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers(MOCK_USERS);
    } finally {
      setLoading(false);
    }
  };

  // ── User actions ──
  const updateUserStatus = async (userId: string, newStatus: UserProfile['status']) => {
    try {
      if (db) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { status: newStatus });
      }
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      if (selectedUser?.id === userId) setSelectedUser(prev => prev ? { ...prev, status: newStatus } : null);
      showToast(`User ${newStatus === 'terminated' ? 'terminated' : newStatus === 'suspended' ? 'suspended' : newStatus === 'restricted' ? 'restricted' : 'activated'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      showToast('Failed to update user status', 'error');
    }
  };

  const updateUserRole = async (userId: string, newRole: UserProfile['role']) => {
    try {
      if (db) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { role: newRole });
      }
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      if (selectedUser?.id === userId) setSelectedUser(prev => prev ? { ...prev, role: newRole } : null);
      showToast(`Role updated to ${newRole.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating role:', error);
      showToast('Failed to update role', 'error');
    }
  };

  const updateAppAccess = async (userId: string, appId: string, granted: boolean, restricted: boolean) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      const newAccess = (user.appAccess || []).map(a =>
        a.appId === appId ? { ...a, granted, restricted } : a
      );
      // If app not found in existing access, add it
      if (!newAccess.find(a => a.appId === appId)) {
        const appInfo = AVAILABLE_APPS.find(a => a.id === appId);
        newAccess.push({ appId, appName: appInfo?.name || appId, granted, restricted });
      }
      if (db) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { appAccess: newAccess });
      }
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, appAccess: newAccess } : u));
      if (selectedUser?.id === userId) setSelectedUser(prev => prev ? { ...prev, appAccess: newAccess } : null);
      showToast(`App access updated for ${appId}`);
    } catch (error) {
      console.error('Error updating app access:', error);
      showToast('Failed to update app access', 'error');
    }
  };

  useEffect(() => {
    if (hasPermission(userProfile, 'view_all_users')) {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [userProfile]);

  // ── Filter users ──
  const filteredUsers = users.filter(user => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      (user.email?.toLowerCase() || '').includes(q) ||
      (user.firstName?.toLowerCase() || '').includes(q) ||
      (user.lastName?.toLowerCase() || '').includes(q) ||
      (user.displayName?.toLowerCase() || '').includes(q) ||
      (user.flightSchool?.toLowerCase() || '').includes(q) ||
      (user.region?.toLowerCase() || '').includes(q);
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || (user.status || 'active') === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // ── Helpers ──
  const getRoleColor = (role: string) => {
    const c: Record<string, { bg: string; text: string; border: string }> = {
      super_admin: { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
      mentor_manager: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
      mentor: { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
      mentee: { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' }
    };
    return c[role] || c.mentee;
  };

  const getStatusColor = (status: string) => {
    const c: Record<string, { bg: string; text: string; border: string }> = {
      active: { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
      suspended: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
      pending: { bg: '#e0e7ff', text: '#4f46e5', border: '#a5b4fc' },
      terminated: { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' },
      restricted: { bg: '#fff7ed', text: '#ea580c', border: '#fdba74' }
    };
    return c[status] || c.active;
  };

  const getAppAccess = (user: UserProfile, appId: string): AppAccess | undefined => {
    return (user.appAccess || []).find(a => a.appId === appId);
  };

  // ── System switcher component ──
  const SystemSwitcher = () => (
    <div className="system-switcher" style={{
      display: 'flex',
      gap: '0.5rem',
      padding: '0.25rem',
      background: 'rgba(0, 0, 0, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(0, 0, 0, 0.1)'
    }}>
      {[
        { id: 'pms', label: 'PMS', color: '#3b82f6', bgColor: '#dbeafe' },
        { id: 'wms', label: 'WMS', color: '#10b981', bgColor: '#d1fae5' },
        { id: 'super_admin', label: 'Super Admin', color: '#ef4444', bgColor: '#fee2e2' }
      ].map(system => (
        <button
          key={system.id}
          onClick={() => onSwitchSystem(system.id as any)}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '8px',
            background: currentSystem === system.id ? system.bgColor : 'transparent',
            color: currentSystem === system.id ? system.color : '#64748b',
            fontSize: '0.875rem',
            fontWeight: currentSystem === system.id ? 600 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: currentSystem === system.id ? `0 2px 4px ${system.color}20` : 'none'
          }}
          onMouseOver={(e) => {
            if (currentSystem !== system.id) {
              e.currentTarget.style.background = system.bgColor + '40';
            }
          }}
          onMouseOut={(e) => {
            if (currentSystem !== system.id) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          {system.label}
        </button>
      ))}
    </div>
  );

  // ── Stats Cards ──
  const StatsCards = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      {[
        { label: 'Total Users', value: users.length, icon: '👥', color: '#3b82f6', bg: '#dbeafe' },
        { label: 'Active', value: users.filter(u => u.status === 'active').length, icon: '✓', color: '#10b981', bg: '#d1fae5' },
        { label: 'Suspended', value: users.filter(u => u.status === 'suspended').length, icon: '⏸', color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Terminated', value: users.filter(u => u.status === 'terminated').length, icon: '✕', color: '#ef4444', bg: '#fee2e2' },
        { label: 'Mentors', value: users.filter(u => u.role === 'mentor').length, icon: '🎓', color: '#8b5cf6', bg: '#ede9fe' },
        { label: 'Avg Performance', value: users.length > 0 ? Math.round(users.reduce((a, u) => a + (u.performanceScore || 0), 0) / users.length) + '%' : '0%', icon: '📊', color: '#ec4899', bg: '#fce7f3' },
      ].map((s, i) => (
        <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', border: '1px solid #e5e7eb', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: s.color }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ width: 36, height: 36, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{s.icon}</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: s.color }}>{s.value}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );

  // ── User Detail Panel ──
  const UserDetailPanel = ({
    user,
    onClose,
    collapsed,
    onNavigateApps
  }: {
    user: UserProfile;
    onClose: () => void;
    collapsed: boolean;
    onNavigateApps: () => void;
  }) => {
    const [appAccessExpanded, setAppAccessExpanded] = useState(false);
    const totalApps = AVAILABLE_APPS.length;
    const grantedCount = AVAILABLE_APPS.filter(app => (getAppAccess(user, app.id)?.granted ?? app.required)).length;
    const restrictedCount = AVAILABLE_APPS.filter(app => getAppAccess(user, app.id)?.restricted).length;

    return (
      <>
        {!collapsed && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }}
            onClick={onClose}
          />
        )}
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100%',
            width: '480px',
            maxWidth: '95vw',
            background: 'white',
            zIndex: 1001,
            boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
            transform: collapsed ? 'translateX(calc(100% - 56px))' : 'translateX(0)',
            transition: 'transform 0.3s ease',
            borderTopLeftRadius: '16px',
            borderBottomLeftRadius: '16px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              overflowY: 'auto',
              padding: '2rem',
              pointerEvents: collapsed ? 'none' : 'auto',
              opacity: collapsed ? 0 : 1,
              transition: 'opacity 0.2s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>User Profile</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>
              {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>{user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown'}</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{user.email || 'No email'}</div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span style={{ padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', fontWeight: 600, background: getRoleColor(user.role).bg, color: getRoleColor(user.role).text }}>{user.role.replace('_', ' ').toUpperCase()}</span>
              <span style={{ padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', fontWeight: 600, background: getStatusColor(user.status || 'active').bg, color: getStatusColor(user.status || 'active').text }}>{(user.status || 'active').toUpperCase()}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem', margin: '1.5rem 0' }}>
            <div style={{ textAlign: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>{user.totalHours || 0}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Flight Hours</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{user.performanceScore || 0}%</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Performance</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>{(user.enrolledPrograms || []).length}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Programs</div>
            </div>
          </div>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>📚 Module Progress</h3>
          <div style={{ marginBottom: '1.5rem' }}>
            {Object.entries(user.moduleProgress || {}).length > 0 ? (
              Object.entries(user.moduleProgress || {}).map(([mod, pct]) => (
                <div key={mod} style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#475569' }}>{mod}</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: Number(pct) >= 80 ? '#10b981' : Number(pct) >= 50 ? '#f59e0b' : '#ef4444', borderRadius: 3, transition: 'width 0.3s' }} />
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No module data available</p>
            )}
          </div>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>🔐 App Access Control</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateApps();
              }}
              style={{ border: '1px solid #cbd5f5', background: '#eef2ff', color: '#4c1d95', borderRadius: 999, padding: '0.2rem 0.7rem', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Open directory
            </button>
          </h3>
          <div style={{ marginBottom: '1.5rem', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1rem', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>Access summary</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{grantedCount} granted · {restrictedCount} restricted · {totalApps - grantedCount} pending</div>
              </div>
              <button
                onClick={() => setAppAccessExpanded(prev => !prev)}
                style={{ border: 'none', background: 'white', borderRadius: 999, padding: '0.4rem 0.9rem', fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', cursor: 'pointer', boxShadow: '0 6px 16px rgba(37,99,235,0.15)' }}
              >
                {appAccessExpanded ? 'Hide list' : 'Show permissions'}
              </button>
            </div>
            {!appAccessExpanded && (
              <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.5 }}>
                Quickly review granted vs restricted apps. Open the full directory for detailed controls or expand the list below.
              </div>
            )}
            {appAccessExpanded && (
              <div style={{ maxHeight: '280px', overflowY: 'auto', marginTop: '0.75rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 10 }}>
                {AVAILABLE_APPS.map(app => {
                  const access = getAppAccess(user, app.id);
                  const isGranted = access?.granted ?? app.required;
                  const isRestricted = access?.restricted ?? false;
                  return (
                    <div key={app.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.9rem', borderBottom: '1px solid #f1f5f9' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1e293b' }}>{app.name}</div>
                        <div style={{ fontSize: '0.7rem', color: isRestricted ? '#ef4444' : isGranted ? '#10b981' : '#94a3b8' }}>
                          {isRestricted ? '🚫 Restricted' : isGranted ? '✅ Granted' : '⬚ Not granted'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button onClick={() => updateAppAccess(user.id, app.id, true, false)} style={{ padding: '0.3rem 0.6rem', borderRadius: 6, border: '1px solid #86efac', background: isGranted && !isRestricted ? '#dcfce7' : 'white', color: '#16a34a', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>Grant</button>
                        <button onClick={() => updateAppAccess(user.id, app.id, false, true)} style={{ padding: '0.3rem 0.6rem', borderRadius: 6, border: '1px solid #fca5a5', background: isRestricted ? '#fee2e2' : 'white', color: '#dc2626', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>Restrict</button>
                        <button onClick={() => updateAppAccess(user.id, app.id, false, false)} style={{ padding: '0.3rem 0.6rem', borderRadius: 6, border: '1px solid #e2e8f0', background: !isGranted && !isRestricted ? '#f1f5f9' : 'white', color: '#64748b', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>Deny</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>👤 Change Role</h3>
          <select value={user.role} onChange={e => updateUserRole(user.id, e.target.value as UserProfile['role'])} style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <option value="mentee">Mentee</option>
            <option value="mentor">Mentor</option>
            <option value="mentor_manager">Mentor Manager</option>
            <option value="super_admin">Super Admin</option>
          </select>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>⚡ Account Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {user.status !== 'active' && (
              <button onClick={() => { updateUserStatus(user.id, 'active'); onClose(); }} style={{ padding: '0.6rem', borderRadius: 8, border: '1px solid #86efac', background: '#dcfce7', color: '#16a34a', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>✓ Activate Account</button>
            )}
            {user.status !== 'suspended' && (
              <button onClick={() => { updateUserStatus(user.id, 'suspended'); onClose(); }} style={{ padding: '0.6rem', borderRadius: 8, border: '1px solid #fcd34d', background: '#fef3c7', color: '#d97706', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>⏸ Suspend Account</button>
            )}
            {user.status !== 'terminated' && (
              <button onClick={() => { updateUserStatus(user.id, 'terminated'); onClose(); }} style={{ padding: '0.6rem', borderRadius: 8, border: '1px solid #fca5a5', background: '#fee2e2', color: '#dc2626', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>✕ Terminate Account</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

  const DetailPanelToggleButton = () => {
    if (!selectedUser) return null;
    const collapsedBg = 'linear-gradient(145deg, rgba(15,23,42,0.85), rgba(30,41,59,0.6))';
    const collapsedHoverBg = 'linear-gradient(145deg, rgba(15,23,42,0.95), rgba(15,23,42,0.7))';
    const expandedBg = 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))';
    const expandedHoverBg = 'linear-gradient(145deg, rgba(255,255,255,1), rgba(255,255,255,0.55))';
    const baseBg = detailPanelCollapsed ? collapsedBg : expandedBg;
    const hoverBg = detailPanelCollapsed ? collapsedHoverBg : expandedHoverBg;

    return (
      <button
        aria-label={detailPanelCollapsed ? 'Expand pilot detail panel' : 'Collapse pilot detail panel'}
        title={detailPanelCollapsed ? 'Expand panel' : 'Hide panel'}
        onClick={() => setDetailPanelCollapsed(prev => !prev)}
        style={{
          position: 'absolute',
          top: '50%',
          right: '16px',
          transform: 'translateY(-50%)',
          width: '74px',
          height: '74px',
          borderRadius: '999px',
          border: '1.5px solid rgba(255,255,255,0.65)',
          background: baseBg,
          color: detailPanelCollapsed ? '#f8fafc' : '#0f172a',
          cursor: 'pointer',
          boxShadow: detailPanelCollapsed ? '-10px 16px 35px rgba(15,23,42,0.45)' : '-12px 18px 30px rgba(15,23,42,0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.2rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          transition: 'all 0.25s ease',
          outline: 'none',
          zIndex: 1502
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = hoverBg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = baseBg;
        }}
      >
        <span
          style={{
            fontSize: '1.45rem',
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: detailPanelCollapsed ? 'translateX(-4px)' : 'translateX(4px)'
          }}
        >
          {detailPanelCollapsed ? '⇤' : '⇥'}
        </span>
        <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.25em', color: detailPanelCollapsed ? '#f8fafc' : '#0f172a' }}>{detailPanelCollapsed ? 'Show' : 'Hide'}</span>
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0))',
            opacity: 0.65,
            pointerEvents: 'none'
          }}
        />
      </button>
    );
  };

  // ── App Access Tab ──
  const AppAccessTab = () => (
    <div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>🔐 App Access Management</h3>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {AVAILABLE_APPS.map(app => (
          <div key={app.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b' }}>{app.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.required ? 'Required for all users' : 'Optional access'}</div>
              </div>
              <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: 6, background: app.required ? '#dcfce7' : '#f1f5f9', color: app.required ? '#16a34a' : '#64748b', fontWeight: 600 }}>{app.required ? 'Required' : 'Optional'}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {users.map(u => {
                const access = getAppAccess(u, app.id);
                const granted = access?.granted ?? app.required;
                const restricted = access?.restricted ?? false;
                return (
                  <span key={u.id} style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: 4, background: restricted ? '#fee2e2' : granted ? '#dcfce7' : '#f1f5f9', color: restricted ? '#dc2626' : granted ? '#16a34a' : '#94a3b8', border: `1px solid ${restricted ? '#fca5a5' : granted ? '#86efac' : '#e2e8f0'}` }}>
                    {u.firstName || u.email?.split('@')[0] || 'User'}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Email Tab ──
  const EmailTab = () => {
    const recipients = emailRecipientFilter === 'all' ? users : users.filter(u => u.role === emailRecipientFilter || u.status === emailRecipientFilter);
    return (
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>✉️ Send Email</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Recipients</label>
            <select value={emailRecipientFilter} onChange={e => setEmailRecipientFilter(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
              <option value="all">All Users ({users.length})</option>
              <option value="mentee">Mentees</option>
              <option value="mentor">Mentors</option>
              <option value="mentor_manager">Mentor Managers</option>
              <option value="active">Active Users</option>
              <option value="suspended">Suspended Users</option>
            </select>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>{recipients.length} recipient(s) selected</div>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Subject</label>
            <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Email subject..." style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>Body</label>
            <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} placeholder="Compose your email..." rows={6} style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }} />
          </div>
          <button onClick={() => { showToast(`Email sent to ${recipients.length} recipient(s)`); setEmailSubject(''); setEmailBody(''); }} style={{ padding: '0.75rem', borderRadius: 8, border: 'none', background: '#3b82f6', color: 'white', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>📤 Send Email</button>
        </div>
      </div>
    );
  };

  // ── Main render ──
  return (
    <div className="dashboard-container animate-fade-in" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 2000, padding: '0.75rem 1.5rem', borderRadius: 10, background: toast.type === 'success' ? '#059669' : '#dc2626', color: 'white', fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 8px 25px rgba(0,0,0,0.2)' }}>
          {toast.message}
        </div>
      )}

      {/* User detail slide-over */}
      {selectedUser && (
        <UserDetailPanel
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          collapsed={detailPanelCollapsed}
          onNavigateApps={() => {
            setActiveTab('apps');
            setDetailPanelCollapsed(true);
          }}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
        <div style={{ transform: 'scale(1.25)', transformOrigin: 'top center', width: '100%', maxWidth: '1200px' }}>
          <main className="dashboard-card" style={{ position: 'relative', background: 'white', borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            {/* Header */}
            <header style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white', padding: '2rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                <button onClick={onBack} style={{ padding: '0.5rem 1rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>← Back to Hub</button>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                <img src="/logo.png" alt="WingMentor" style={{ maxWidth: 180, marginBottom: '0.75rem' }} />
                <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Mentor Management System</h1>
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Manage users, control app access, oversee the WingMentor platform</p>
              </div>
              <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <button onClick={onLogout} style={{ padding: '0.5rem 1rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>→ Logout</button>
              </div>
            </header>

            <div style={{ padding: '2rem' }}>
              {/* System switcher */}
              <div style={{ marginBottom: '1.5rem' }}>
                <SystemSwitcher />
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '0.25rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: 12, marginBottom: '1.5rem' }}>
                {[
                  { id: 'users', label: '👥 Users' },
                  { id: 'apps', label: '🔐 App Access' },
                  { id: 'email', label: '✉️ Email' },
                  { id: 'stats', label: '📊 Stats' },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ flex: 1, padding: '0.65rem 0.75rem', border: 'none', borderRadius: 8, background: activeTab === tab.id ? 'white' : 'transparent', color: activeTab === tab.id ? '#1e293b' : '#64748b', fontSize: '0.85rem', fontWeight: activeTab === tab.id ? 600 : 500, cursor: 'pointer', boxShadow: activeTab === tab.id ? '0 2px 4px rgba(0,0,0,0.1)' : 'none' }}>{tab.label}</button>
                ))}
              </div>

              {/* Tab content */}
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: '#64748b' }}>
                  <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                  <p>Loading users...</p>
                </div>
              ) : (
                <>
                  {/* ── USERS TAB ── */}
                  {activeTab === 'users' && (
                    <div>
                      {/* Search & Filters */}
                      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <input type="text" placeholder="🔍 Search by name, email, school, region..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, minWidth: 250, padding: '0.65rem 1rem', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: '0.85rem', outline: 'none' }} />
                        <select value={selectedRole} onChange={e => setSelectedRole(e.target.value as any)} style={{ padding: '0.65rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: '0.85rem', background: 'white' }}>
                          <option value="all">All Roles</option>
                          <option value="super_admin">Super Admin</option>
                          <option value="mentor_manager">Mentor Manager</option>
                          <option value="mentor">Mentor</option>
                          <option value="mentee">Mentee</option>
                        </select>
                        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} style={{ padding: '0.65rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: '0.85rem', background: 'white' }}>
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                          <option value="pending">Pending</option>
                          <option value="restricted">Restricted</option>
                          <option value="terminated">Terminated</option>
                        </select>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>Showing {filteredUsers.length} of {users.length} users</div>

                      {/* Users table */}
                      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                              {['User', 'Role', 'Status', 'Performance', 'Programs', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '0.75rem', textAlign: h === 'Actions' ? 'center' : 'left', fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUsers.map(user => (
                              <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => setSelectedUser(user)} onMouseOver={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; }} onMouseOut={e => { e.currentTarget.style.backgroundColor = 'white'; }}>
                                <td style={{ padding: '0.75rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '0.8rem', flexShrink: 0 }}>
                                      {(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.85rem' }}>{user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown'}</div>
                                      <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{user.email || ''}</div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                  <span style={{ padding: '0.15rem 0.5rem', borderRadius: 5, fontSize: '0.7rem', fontWeight: 500, background: getRoleColor(user.role).bg, color: getRoleColor(user.role).text, border: `1px solid ${getRoleColor(user.role).border}` }}>{(user.role || 'mentee').replace('_', ' ').toUpperCase()}</span>
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                  <span style={{ padding: '0.15rem 0.5rem', borderRadius: 5, fontSize: '0.7rem', fontWeight: 500, background: getStatusColor(user.status || 'active').bg, color: getStatusColor(user.status || 'active').text, border: `1px solid ${getStatusColor(user.status || 'active').border}` }}>{(user.status || 'active').toUpperCase()}</span>
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: 50, height: 5, background: '#e2e8f0', borderRadius: 3 }}>
                                      <div style={{ height: '100%', width: `${user.performanceScore || 0}%`, background: (user.performanceScore || 0) >= 70 ? '#10b981' : (user.performanceScore || 0) >= 40 ? '#f59e0b' : '#ef4444', borderRadius: 3 }} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>{user.performanceScore || 0}%</span>
                                  </div>
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                  <div style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap' }}>
                                    {(user.enrolledPrograms || []).slice(0, 2).map((p, i) => (
                                      <span key={i} style={{ padding: '0.1rem 0.4rem', borderRadius: 4, fontSize: '0.6rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>{p}</span>
                                    ))}
                                    {(user.enrolledPrograms || []).length > 2 && <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>+{(user.enrolledPrograms || []).length - 2}</span>}
                                    {(user.enrolledPrograms || []).length === 0 && <span style={{ fontSize: '0.6rem', color: '#cbd5e1' }}>None</span>}
                                  </div>
                                </td>
                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                  <button onClick={e => { e.stopPropagation(); setSelectedUser(user); }} style={{ padding: '0.35rem 0.75rem', borderRadius: 6, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600 }}>View</button>
                                </td>
                              </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No users match your search.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ── APPS TAB ── */}
                  {activeTab === 'apps' && <AppAccessTab />}

                  {/* ── EMAIL TAB ── */}
                  {activeTab === 'email' && <EmailTab />}

                  {/* ── STATS TAB ── */}
                  {activeTab === 'stats' && <StatsCards />}
                </>
              )}
            </div>
            {selectedUser && <DetailPanelToggleButton />}
          </main>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
