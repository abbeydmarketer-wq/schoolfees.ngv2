import React, { useState } from 'react';
import { PlatformConfig, NewSchoolRegistrationData } from '../types.ts';
import { signIn } from '../services/authService.ts';
import { registerSchool } from '../services/dataService.ts';
import SignUpPage from './SignUpPage.tsx';

interface AuthPageProps {
  platformConfig: PlatformConfig;
  initialMode?: 'login' | 'register';
}

const AuthPage: React.FC<AuthPageProps> = ({ platformConfig, initialMode = 'login' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(initialMode === 'register');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn(email, password);
      if (result) {
        // Login successful - modal will close automatically via auth listener
        setIsLoading(false);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: NewSchoolRegistrationData & {password: string}) => {
    try {
      await registerSchool(data);
      // After successful registration, automatically sign in
      await signIn(data.adminEmail, data.password);
    } catch (error) {
      throw error; // Let SignUpPage handle the error
    }
  };

  const { websiteContent } = platformConfig;

  // Show registration form if in registration mode
  if (isRegistering) {
    return (
      <SignUpPage
        onRegister={handleRegister}
        onBackToSignIn={() => setIsRegistering(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          {websiteContent.logo && (
            <img
              className="mx-auto h-12 w-auto"
              src={websiteContent.logo}
              alt={websiteContent.title}
            />
          )}
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {websiteContent.tagline}
          </p>
        </div>

        {/* Auth Form */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email address</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">
                    Forgot your password?
                  </a>
                </label>
              </div>

              {error && (
                <div className="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="form-control mt-6">
                <button 
                  type="submit" 
                  className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : (isRegistering ? 'Create Account' : 'Sign In')}
                </button>
              </div>
            </form>

            <div className="divider">OR</div>

            {/* Demo Login */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600 text-center">Try our demo accounts:</p>
              <div className="grid gap-2">
                <button 
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={async () => {
                    try {
                      await signIn('admin@sunnydale.com', 'password123');
                    } catch (error) {
                      setError('Demo login failed');
                    }
                  }}
                  disabled={isLoading}
                >
                  School Admin Demo
                </button>
                <button 
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={async () => {
                    try {
                      await signIn('parent@sunnydale.com', 'password123');
                    } catch (error) {
                      setError('Demo login failed');
                    }
                  }}
                  disabled={isLoading}
                >
                  Parent Demo
                </button>
                <button 
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={async () => {
                    try {
                      await signIn('teacher@sunnydale.com', 'password123');
                    } catch (error) {
                      setError('Demo login failed');
                    }
                  }}
                  disabled={isLoading}
                >
                  Teacher Demo
                </button>
                <button 
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={async () => {
                    try {
                      await signIn('staff@sunnydale.com', 'password123');
                    } catch (error) {
                      setError('Demo login failed');
                    }
                  }}
                  disabled={isLoading}
                >
                  Staff Demo
                </button>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  className="link link-primary"
                  onClick={() => setIsRegistering(!isRegistering)}
                  disabled={isLoading}
                >
                  {isRegistering ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>&copy; 2024 {websiteContent.title}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;