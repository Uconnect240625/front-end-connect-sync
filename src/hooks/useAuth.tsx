
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: { full_name: string; role: string; university_id: string }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log(`Fetching profile for user: ${userId}, attempt: ${retryCount + 1}`);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist and this is the first retry, try to create it
        if (error.code === 'PGRST116' && retryCount === 0) {
          console.log('Profile not found, attempting to create one...');
          await createMissingProfile(userId);
          // Retry fetching after creation attempt
          return fetchProfile(userId, retryCount + 1);
        }
        
        return null;
      }
      
      console.log('Profile fetched successfully:', profile);
      return profile;
    } catch (err) {
      console.error('Profile fetch error:', err);
      return null;
    }
  };

  const createMissingProfile = async (userId: string) => {
    try {
      console.log('Creating missing profile for user:', userId);
      
      // Get default university
      const { data: universities } = await supabase
        .from('universities')
        .select('id')
        .limit(1);
      
      if (!universities || universities.length === 0) {
        console.error('No universities found in database');
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: 'User',
          role: 'student',
          university_id: universities[0].id
        });
      
      if (error) {
        console.error('Error creating profile:', error);
      } else {
        console.log('Profile created successfully for user:', userId);
      }
    } catch (err) {
      console.error('Profile creation error:', err);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const fetchedProfile = await fetchProfile(user.id);
      setProfile(fetchedProfile);
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to defer profile fetching and avoid potential deadlocks
          setTimeout(async () => {
            const fetchedProfile = await fetchProfile(session.user.id);
            setProfile(fetchedProfile);
            setLoading(false);
          }, 100);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setLoading(false);
      }
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
      } else {
        console.log('Sign in successful');
      }
      
      return { error };
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, userData: { full_name: string; role: string; university_id: string }) => {
    try {
      console.log('Attempting sign up for:', email, 'with data:', userData);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { error };
      }

      console.log('Signup successful:', data.user?.id);
      
      // If signup successful but user needs email confirmation
      if (data.user && !data.session) {
        console.log('User created, email confirmation required');
        return { error: null };
      }

      return { error: null };
    } catch (err) {
      console.error('Signup error:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    console.log('Signing out user');
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
