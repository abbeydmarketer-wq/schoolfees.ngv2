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
    // Demo mode with localStorage - completely synchronous
    const mockUsers = [
      { email: 'super@schoolfees.ng', password: 'password123', role: 'superAdmin', id: 'user_super_1', name: 'Super Admin' },
      { email: 'admin@sunnydale.com', password: 'password123', role: 'schoolAdmin', schoolId: 'sch_sunnydale_123', id: 'user_sunnydale_admin', name: 'Mrs. Adebayo' },
      { email: 'parent@sunnydale.com', password: 'password123', role: 'parent', schoolId: 'sch_sunnydale_123', id: 'user_sunnydale_parent', name: 'Mr. Okoro' },
      { email: 'teacher@sunnydale.com', password: 'password123', role: 'teacher', schoolId: 'sch_sunnydale_123', id: 'tm_sunnydale_t1', name: 'Mr. James' },
      { email: 'staff@sunnydale.com', password: 'password123', role: 'staff', schoolId: 'sch_sunnydale_123', id: 'tm_sunnydale_s1', name: 'Funke Akindele' },
    ];

    const mockUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!mockUser) {
      throw new Error('Invalid email or password');
    }
    
    const demoUser: User = {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role as User['role'],
      schoolId: mockUser.schoolId
    };
    
    // Store in localStorage for demo persistence
    localStorage.setItem('demo_user', JSON.stringify(demoUser));
    localStorage.setItem('demo_session', 'active');
    
    currentUser = demoUser;
    
    // Immediate synchronous callback - truly instant
    authChangeListeners.forEach(listener => listener(demoUser));
    
    return demoUser;
  }
};

export const signOut = async (): Promise<void> => {
  const supabase = getSupabase();
  
  if (supabase) {
    await supabase.auth.signOut();
  } else {
    // Clear demo localStorage
    localStorage.removeItem('demo_user');
    localStorage.removeItem('demo_session');
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
  } else {
    // Demo mode - check localStorage for existing session
    const demoSession = localStorage.getItem('demo_session');
    const demoUserData = localStorage.getItem('demo_user');
    
    if (demoSession === 'active' && demoUserData) {
      try {
        const user = JSON.parse(demoUserData) as User;
        currentUser = user;
        authChangeListeners.forEach(listener => listener(user));
      } catch (e) {
        console.log('Invalid demo user data in localStorage');
        localStorage.removeItem('demo_user');
        localStorage.removeItem('demo_session');
      }
    }
  }
};

// Auto-initialize
initializeAuth();