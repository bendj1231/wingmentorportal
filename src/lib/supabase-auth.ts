import { createClient } from '@supabase/supabase-js';
import type { UserProfile, UserRole } from '../types/user';
import { AVAILABLE_APPS, ROLE_PERMISSIONS } from '../types/user';

const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM';

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface AuthState {
  user: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  currentSystem: 'pms' | 'wms' | 'super_admin';
}

export const SUPER_ADMIN_EMAIL = 'benjamintigerbowler@gmail.com';

export const createUserProfile = async (user: any, role: UserRole['type'] = 'mentee'): Promise<UserProfile> => {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return existingProfile as UserProfile;
    }

    // Create default app access
    const defaultAppAccess = AVAILABLE_APPS.map(app => ({
      appId: app.id,
      appName: app.name,
      granted: app.required,
      restricted: false
    }));

    const userProfile: UserProfile = {
      id: user.id,
      email: user.email || '',
      displayName: user.user_metadata?.display_name || user.email?.split('@')[0] || '',
      firstName: user.user_metadata?.display_name?.split(' ')[0] || user.email?.split('@')[0] || '',
      lastName: user.user_metadata?.display_name?.split(' ').slice(1).join(' ') || '',
      role: user.email === SUPER_ADMIN_EMAIL ? 'super_admin' : role,
      totalHours: 0,
      enrolledPrograms: [],
      appAccess: defaultAppAccess,
      createdAt: new Date(),
      lastLogin: new Date(),
      status: 'active'
    };

    // Insert profile into Supabase
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        display_name: userProfile.displayName,
        role: userProfile.role,
        status: userProfile.status,
        firebase_uid: user.user_metadata?.firebase_uid || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }

    // Create app access records
    const appAccessRecords = defaultAppAccess.map(app => ({
      user_id: user.id,
      app_id: app.appId,
      granted: app.granted,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { error: accessError } = await supabase
      .from('user_app_access')
      .insert(appAccessRecords);

    if (accessError) {
      console.error('Error creating app access:', accessError);
    }

    return userProfile;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    // Get profile from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single();

    if (profileError || !profile) {
      console.log('Profile not found:', profileError);
      return null;
    }

    // Get app access
    const { data: appAccess, error: accessError } = await supabase
      .from('user_app_access')
      .select('*')
      .eq('user_id', uid);

    if (accessError) {
      console.error('Error fetching app access:', accessError);
    }

    // Map app access to proper format
    const appAccessMap = {
      'foundational': 'Foundational Program',
      'pilot-profile': 'Pilot Profile', 
      'mentorship': 'Mentorship',
      'atlas-cv': 'ATLAS CV Generator',
      'w1000': 'W1000 Logbook'
    };

    const userProfile: UserProfile = {
      id: profile.id,
      email: profile.email,
      displayName: profile.display_name || '',
      firstName: profile.display_name?.split(' ')[0] || '',
      lastName: profile.display_name?.split(' ').slice(1).join(' ') || '',
      role: profile.role,
      totalHours: 0, // This would come from a separate table if needed
      enrolledPrograms: [], // This would come from a separate table if needed
      appAccess: appAccess?.map(access => ({
        appId: access.app_id,
        appName: appAccessMap[access.app_id as keyof typeof appAccessMap] || access.app_id,
        granted: access.granted,
        restricted: !access.granted
      })) || [],
      createdAt: new Date(profile.created_at),
      lastLogin: new Date(profile.updated_at),
      status: profile.status
    };

    return userProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const updateUserLastLogin = async (uid: string) => {
  try {
    await supabase
      .from('profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', uid);
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

export const switchSystem = async (uid: string, system: 'pms' | 'wms' | 'super_admin') => {
  console.log(`Switch system to ${system} for user ${uid}`);
  // This could be stored in a user preferences table
};

export const hasPermission = (userProfile: UserProfile | null, permission: string): boolean => {
  if (!userProfile) return false;
  
  // Super admin has all permissions
  if (userProfile.role === 'super_admin') return true;
  
  // Check role-based permissions
  const userPermissions = ROLE_PERMISSIONS[userProfile.role] || [];
  return userPermissions.includes(permission);
};

export const canAccessApp = (userProfile: UserProfile | null, appId: string): boolean => {
  if (!userProfile) return false;
  
  // Super admin can access all apps
  if (userProfile.role === 'super_admin') return true;
  
  const appAccess = userProfile.appAccess.find(app => app.appId === appId);
  return appAccess?.granted || false;
};

export const onAuthStateChange = (callback: (authState: AuthState) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('🔍 Supabase Auth State Change:', { event, session: !!session });
    
    if (session?.user) {
      console.log('👤 User logged in:', session.user.email);
      
      try {
        let userProfile = await getUserProfile(session.user.id);
        
        console.log('📋 User profile loaded:', userProfile ? 'Success' : 'Not found');
        
        if (!userProfile) {
          console.log('🔧 Creating new user profile...');
          userProfile = await createUserProfile(session.user);
        } else {
          await updateUserLastLogin(session.user.id);
        }

        // Ensure super admin role for the specific email
        if (session.user.email === SUPER_ADMIN_EMAIL && userProfile.role !== 'super_admin') {
          console.log('👑 Granting super admin role...');
          userProfile.role = 'super_admin';
          try {
            await supabase
              .from('profiles')
              .update({ role: 'super_admin' })
              .eq('id', session.user.id);
          } catch (updateError) {
            console.warn('Failed to update super admin role:', updateError);
          }
        }

        console.log('✅ Final user profile:', {
          email: userProfile.email,
          role: userProfile.role,
          appAccessCount: userProfile.appAccess?.length || 0,
          canAccessMentorManagement: userProfile.role === 'super_admin' || userProfile.appAccess?.some(a => a.appId === 'mentor-management' && a.granted)
        });

        callback({
          user: session.user,
          userProfile,
          loading: false,
          currentSystem: 'pms'
        });
      } catch (error: any) {
        console.error('Error loading user profile:', error);
        callback({
          user: session.user,
          userProfile: null,
          loading: false,
          currentSystem: 'pms'
        });
      }
    } else {
      console.log('👋 User logged out');
      callback({
        user: null,
        userProfile: null,
        loading: false,
        currentSystem: 'pms'
      });
    }
  });
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signUp = async (email: string, password: string, displayName?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName || email.split('@')[0]
      }
    }
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};
