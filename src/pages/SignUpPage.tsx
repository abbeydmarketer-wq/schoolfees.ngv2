import React, { useState } from 'react';
import { NewSchoolRegistrationData } from '../types';

interface SignUpPageProps {
  onRegister: (data: NewSchoolRegistrationData & {password: string}) => Promise<void>;
  onBackToSignIn: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onRegister, onBackToSignIn }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<NewSchoolRegistrationData & {
    password: string; 
    confirmPassword: string; 
    schoolType: string; 
    studentCapacity: string; 
    gradesOffered: string[]; 
    academicYear: string; 
    currency: string; 
    preferredGateways: string[]
  }>({    
    username: '',
    schoolName: '',
    schoolEmail: '',
    schoolAddress: '',
    schoolPhone: '',
    adminName: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
    schoolType: 'primary',
    studentCapacity: '100-300',
    gradesOffered: [],
    academicYear: '2024/2025',
    currency: 'NGN',
    preferredGateways: ['paystack']
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (currentStep < 4) {
      handleNext();
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, schoolType, studentCapacity, gradesOffered, academicYear, currency, preferredGateways, ...registrationData } = formData;
      await onRegister(registrationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                School Username (will be your school's URL: username.schoolfee.ng)
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-1 block w-full input input-bordered"
                placeholder="your-school-name"
              />
              <p className="text-xs text-gray-500 mt-1">Choose a unique identifier for your school</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Official School Name *
              </label>
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                required
                className="mt-1 block w-full input input-bordered"
                placeholder="e.g., St. Mary's College"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                School Address *
              </label>
              <textarea
                name="schoolAddress"
                value={formData.schoolAddress}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1 block w-full textarea textarea-bordered"
                placeholder="Complete address including city and state"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  School Email *
                </label>
                <input
                  type="email"
                  name="schoolEmail"
                  value={formData.schoolEmail}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full input input-bordered"
                  placeholder="admin@yourschool.edu.ng"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  School Phone *
                </label>
                <input
                  type="tel"
                  name="schoolPhone"
                  value={formData.schoolPhone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full input input-bordered"
                  placeholder="+234 XXX XXX XXXX"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                School Type *
              </label>
              <select
                name="schoolType"
                value={formData.schoolType}
                onChange={handleChange}
                required
                className="mt-1 block w-full select select-bordered"
              >
                <option value="primary">Primary School</option>
                <option value="secondary">Secondary School</option>
                <option value="mixed">Primary & Secondary</option>
                <option value="nursery">Nursery School</option>
                <option value="tertiary">Tertiary Institution</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Student Population *
              </label>
              <select
                name="studentCapacity"
                value={formData.studentCapacity}
                onChange={handleChange}
                required
                className="mt-1 block w-full select select-bordered"
              >
                <option value="1-50">1 - 50 students</option>
                <option value="51-100">51 - 100 students</option>
                <option value="101-300">101 - 300 students</option>
                <option value="301-500">301 - 500 students</option>
                <option value="501-1000">501 - 1,000 students</option>
                <option value="1000+">1,000+ students</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Grades/Classes Offered *
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {['Nursery 1', 'Nursery 2', 'Reception', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'].map((grade) => (
                  <label key={grade} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={formData.gradesOffered.includes(grade)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            gradesOffered: [...prev.gradesOffered, grade]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            gradesOffered: prev.gradesOffered.filter(g => g !== grade)
                          }));
                        }
                      }}
                    />
                    <span className="text-sm">{grade}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Academic Year *
                </label>
                <select
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full select select-bordered"
                >
                  <option value="2024/2025">2024/2025</option>
                  <option value="2025/2026">2025/2026</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Currency *
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full select select-bordered"
                >
                  <option value="NGN">Nigerian Naira (₦)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Payment Methods *
              </label>
              <div className="space-y-2">
                {[
                  { id: 'paystack', name: 'Paystack (Cards, Bank Transfer, USSD)' },
                  { id: 'flutterwave', name: 'Flutterwave (Cards, Mobile Money)' },
                  { id: 'bank_transfer', name: 'Direct Bank Transfer' },
                  { id: 'cash', name: 'Cash Payments' }
                ].map((gateway) => (
                  <label key={gateway.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={formData.preferredGateways.includes(gateway.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            preferredGateways: [...prev.preferredGateways, gateway.id]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            preferredGateways: prev.preferredGateways.filter(g => g !== gateway.id)
                          }));
                        }
                      }}
                    />
                    <span>{gateway.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Administrator Account</h3>
              <p className="text-sm text-blue-700">This will be the main account that manages your school on SchoolFee.NG</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Administrator Full Name *
              </label>
              <input
                type="text"
                name="adminName"
                value={formData.adminName}
                onChange={handleChange}
                required
                className="mt-1 block w-full input input-bordered"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Administrator Email *
              </label>
              <input
                type="email"
                name="adminEmail"
                value={formData.adminEmail}
                onChange={handleChange}
                required
                className="mt-1 block w-full input input-bordered"
                placeholder="john@yourschool.edu.ng"
              />
              <p className="text-xs text-gray-500 mt-1">This will be your login email</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full input input-bordered"
                placeholder="Must be at least 8 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 block w-full input input-bordered"
                placeholder="Confirm your password"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'School Information';
      case 2: return 'School Details';
      case 3: return 'Academic Setup';
      case 4: return 'Administrator Account';
      default: return 'Setup';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Your School Account</h1>
          <p className="text-gray-600 mt-2">Complete onboarding to start managing school fees</p>
          
          {/* Step Indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && <div className={`w-8 h-0.5 ${currentStep > step ? 'bg-primary' : 'bg-gray-300'}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-xl mb-6">{getStepTitle()}</h2>
            
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-error mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {renderStepContent()}

              <div className="flex justify-between mt-8 pt-6 border-t">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="btn btn-outline"
                    disabled={loading}
                  >
                    Previous
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onBackToSignIn}
                    className="btn btn-ghost"
                  >
                    Back to Sign In
                  </button>
                )}

                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {currentStep === 4 ? (loading ? 'Creating Account...' : 'Create School Account') : 'Next Step'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;