'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import FormField from '@/components/FormField';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import LocationInput from '@/components/LocationInput';
import ConsentCheckbox from '@/components/ConsentCheckbox';
import SocialSignIn from '@/components/SocialSignIn';
import SkipToMain from '@/components/SkipToMain';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validateTermsAcceptance,
  getFieldError 
} from '@/lib/validation';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  acceptTerms: boolean;
  newsletterOptIn: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  location?: string;
  acceptTerms?: string;
  newsletterOptIn?: string;
  general?: string;
}

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    acceptTerms: false,
    newsletterOptIn: false
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Phone validation (required)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Name validation (optional but if provided, must be valid)
    if (formData.firstName) {
      const firstNameError = validateName(formData.firstName, 'First name');
      if (firstNameError) newErrors.firstName = firstNameError;
    }
    
    if (formData.lastName) {
      const lastNameError = validateName(formData.lastName, 'Last name');
      if (lastNameError) newErrors.lastName = lastNameError;
    }
    
    // Terms acceptance validation
    const termsError = validateTermsAcceptance(formData.acceptTerms);
    if (termsError) newErrors.acceptTerms = termsError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName || undefined,
          lastName: formData.lastName || undefined,
          phone: formData.phone,
          location: formData.location || undefined,
          newsletterOptIn: formData.newsletterOptIn,
          acceptTerms: formData.acceptTerms
        }),
      });
      
      if (response.ok) {
        setIsSuccess(true);
        // Auto sign in after successful registration
        setTimeout(async () => {
          const result = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            redirect: false,
          });
          
          if (result?.ok) {
            router.push(callbackUrl);
          } else {
            router.push('/login?message=Account created successfully. Please sign in.');
          }
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.error || 'Failed to create account. Please try again.' });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialError = (error: string) => {
    setErrors({ general: error });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <SkipToMain />
        <div className="max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Happy Hour!
            </h1>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. You'll be signed in automatically.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SkipToMain />
      
      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
              <p className="mt-2 text-sm text-gray-600">
                Join thousands of users saving money on dining
              </p>
            </div>

            <div className="mt-8">
              {/* Social Sign In */}
              <SocialSignIn 
                className="mb-6" 
                onError={handleSocialError}
              />

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* General Error */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-700">{errors.general}</p>
                    </div>
                  </div>
                )}

                {/* Email */}
                <FormField
                  label="Email address"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(value) => updateField('email', value)}
                  placeholder="Enter your email"
                  required
                  error={errors.email}
                  autoComplete="email"
                />

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                    <span className="text-red-500 ml-1" aria-label="required">*</span>
                  </label>
                  <PasswordStrengthMeter
                    password={formData.password}
                    showPassword={showPassword}
                    onToggleVisibility={() => setShowPassword(!showPassword)}
                    onChange={(value) => updateField('password', value)}
                  />
                </div>

                {/* Confirm Password */}
                <FormField
                  label="Confirm password"
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(value) => updateField('confirmPassword', value)}
                  placeholder="Confirm your password"
                  required
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                />

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="First name (Optional)"
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(value) => updateField('firstName', value)}
                    placeholder="First name"
                    error={errors.firstName}
                    autoComplete="given-name"
                  />
                  <FormField
                    label="Last name (Optional)"
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(value) => updateField('lastName', value)}
                    placeholder="Last name"
                    error={errors.lastName}
                    autoComplete="family-name"
                  />
                </div>

                {/* Phone */}
                <FormField
                  label="Phone number (Required)"
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => updateField('phone', value)}
                  placeholder="Enter your phone number"
                  required
                  error={errors.phone}
                  autoComplete="tel"
                />

                {/* Location */}
                <LocationInput
                  value={formData.location}
                  onChange={(value) => updateField('location', value)}
                  error={errors.location}
                />

                {/* Newsletter Opt-In */}
                <ConsentCheckbox
                  checked={formData.newsletterOptIn}
                  onChange={(checked) => updateField('newsletterOptIn', checked)}
                  label="I agree to receive newsletters and promotional communications from Happy Hour."
                  showTermsLinks={false}
                />

                {/* Terms Acceptance */}
                <ConsentCheckbox
                  checked={formData.acceptTerms}
                  onChange={(checked) => updateField('acceptTerms', checked)}
                  error={errors.acceptTerms}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                  >
                    Sign in instead
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Image/Info */}
        <div className="hidden lg:block relative w-0 flex-1">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80)'
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="relative h-full flex items-center justify-center p-12">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Start Saving Today</h2>
              <p className="text-lg mb-6">
                Join thousands of users discovering amazing deals at their favorite restaurants
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Exclusive deals up to 50% off</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Discover new restaurants near you</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Easy mobile redemption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  );
}