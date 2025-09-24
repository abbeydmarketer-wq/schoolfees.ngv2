import { getSupabase } from '../supabaseClient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'parent' | 'teacher' | 'staff' | 'schoolAdmin' | 'superAdmin';
  schoolId?: string;
}

let currentUser: User | null = null;
let authChangeListeners: Array<(user: User | null) => void> = [];

// Mock authentication service that works with Supabase or in offline mode
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  authChangeListeners.push(callback);
  
  // Immediately call with current state
  callback(currentUser);
  
  return {
    unsubscribe: () => {
      const index = authChangeListeners.indexOf(callback);
      if (index > -1) {
        authChangeListeners.splice(index, 1);
      }
    }
  };
};

export const signIn = async (email: string, password: string): Promise<User | null> => {
  const supabase = getSupabase();
  
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // You would typically fetch user data from your users table here
      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || 'User',
        role: data.user.user_metadata?.role || 'parent',
        schoolId: data.user.user_metadata?.schoolId
      };
      
      currentUser = user;
      authChangeListeners.forEach(listener => listener(user));
      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  } else {
    // Offline/demo mode
    const demoUser: User = {
      id: 'demo-user',
      email: email,
      name: 'Demo User',
      role: 'schoolAdmin',
      schoolId: 'demo-school-id'
    };
    
    currentUser = demoUser;
    authChangeListeners.forEach(listener => listener(demoUser));
    return demoUser;
  }
};

export const signOut = async (): Promise<void> => {
  const supabase = getSupabase();
  
  if (supabase) {
    await supabase.auth.signOut();
  }
  
  currentUser = null;
  authChangeListeners.forEach(listener => listener(null));
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

// Initialize auth state on load
export const initializeAuth = async () => {
  const supabase = getSupabase();
  
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const user: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name || 'User',
        role: session.user.user_metadata?.role || 'parent',
        schoolId: session.user.user_metadata?.schoolId
      };
      
      currentUser = user;
      authChangeListeners.forEach(listener => listener(user));
    }
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'User',
          role: session.user.user_metadata?.role || 'parent',
          schoolId: session.user.user_metadata?.schoolId
        };
        
        currentUser = user;
        authChangeListeners.forEach(listener => listener(user));
      } else {
        currentUser = null;
        authChangeListeners.forEach(listener => listener(null));
      }
    });
  }
};

// Auto-initialize
initializeAuth();