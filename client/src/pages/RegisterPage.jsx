import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Activity, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

/**
 * RegisterPage - Create a new AdsPulse account
 * Features: password strength indicator, validation, terms agreement
 */
export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const cardRef = useRef(null);

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Calculate password strength
  const getPasswordStrength = (password) => {
    if (!password) return { level: 'weak', score: 0 };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 'weak', score };
    if (score <= 4) return { level: 'fair', score };
    return { level: 'strong', score };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.level === 'weak') {
      newErrors.password = 'Password is too weak. Add uppercase, numbers, or special characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle shake animation for errors
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      triggerShake();
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Account created! Welcome to AdsPulse');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const message = error.response?.data?.error?.message || 'Registration failed. Please try again.';
      setErrors({ submit: message });
      triggerShake();
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength.level === 'weak') return '#F87171';
    if (passwordStrength.level === 'fair') return '#FBBF24';
    return '#34D399';
  };

  const getStrengthLabel = () => {
    if (passwordStrength.level === 'weak') return 'Weak';
    if (passwordStrength.level === 'fair') return 'Fair';
    return 'Strong';
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background: 'var(--color-bg-primary)',
        backgroundImage: `
          linear-gradient(0deg, transparent 24%, rgba(79, 142, 247, 0.05) 25%, rgba(79, 142, 247, 0.05) 26%, transparent 27%, transparent 74%, rgba(79, 142, 247, 0.05) 75%, rgba(79, 142, 247, 0.05) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(79, 142, 247, 0.05) 25%, rgba(79, 142, 247, 0.05) 26%, transparent 27%, transparent 74%, rgba(79, 142, 247, 0.05) 75%, rgba(79, 142, 247, 0.05) 76%, transparent 77%, transparent)
        `,
        backgroundSize: '50px 50px'
      }}
    >
      {/* Animated gradient orb background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/3 -left-32 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'linear-gradient(135deg, #A78BFA 0%, #4F8EF7 100%)',
            animation: 'float 8s ease-in-out infinite'
          }}
        />
      </div>

      {/* Card container */}
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-md transition-transform duration-100"
        style={{
          transform: shake ? 'translateX(-10px)' : 'translateX(0)',
          animation: shake ? 'shake 0.5s ease-in-out' : 'none'
        }}
      >
        <div
          className="px-8 py-10 rounded-2xl border overflow-y-auto max-h-[90vh]"
          style={{
            background: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border)'
          }}
        >
          {/* Logo and heading */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#A78BFA] flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                AdsPulse
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              Create your account
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Get started with free Google Ads analysis
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name input */}
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder=" "
                className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                  errors.name
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border focus:ring-[#4F8EF7]/20'
                }`}
                style={{
                  background: 'var(--color-bg-primary)',
                  borderColor: errors.name ? undefined : 'var(--color-border)',
                  color: 'var(--color-text-primary)'
                }}
              />
              <label
                className="absolute left-4 top-3 transition-all duration-200 pointer-events-none text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Full name
              </label>
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Email input */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder=" "
                className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border focus:ring-[#4F8EF7]/20'
                }`}
                style={{
                  background: 'var(--color-bg-primary)',
                  borderColor: errors.email ? undefined : 'var(--color-border)',
                  color: 'var(--color-text-primary)'
                }}
              />
              <label
                className="absolute left-4 top-3 transition-all duration-200 pointer-events-none text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Email address
              </label>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder=" "
                className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border focus:ring-[#4F8EF7]/20'
                }`}
                style={{
                  background: 'var(--color-bg-primary)',
                  borderColor: errors.password ? undefined : 'var(--color-border)',
                  color: 'var(--color-text-primary)'
                }}
              />
              <label
                className="absolute left-4 top-3 transition-all duration-200 pointer-events-none text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-full transition-all"
                        style={{
                          background:
                            i < passwordStrength.score
                              ? getStrengthColor()
                              : 'var(--color-border)'
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: getStrengthColor() }}>
                    Password strength: {getStrengthLabel()}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password input */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder=" "
                className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border focus:ring-[#4F8EF7]/20'
                }`}
                style={{
                  background: 'var(--color-bg-primary)',
                  borderColor: errors.confirmPassword ? undefined : 'var(--color-border)',
                  color: 'var(--color-text-primary)'
                }}
              />
              <label
                className="absolute left-4 top-3 transition-all duration-200 pointer-events-none text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Confirm password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>

              {/* Password match indicator */}
              {formData.confirmPassword && (
                <div className="absolute right-4 top-3 pointer-events-none">
                  {formData.password === formData.confirmPassword ? (
                    <Check className="w-5 h-5 text-[#34D399]" />
                  ) : (
                    <X className="w-5 h-5 text-red-400" />
                  )}
                </div>
              )}

              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (errors.terms) {
                    setErrors((prev) => ({ ...prev, terms: '' }));
                  }
                }}
                className="w-4 h-4 rounded cursor-pointer mt-0.5 flex-shrink-0"
                style={{
                  accentColor: 'var(--color-accent-primary)',
                  background: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border)'
                }}
              />
              <label htmlFor="agreeTerms" className="text-xs cursor-pointer flex-1">
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  I agree to the{' '}
                  <a href="#" className="text-[#4F8EF7] hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#4F8EF7] hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-400 -mt-2">{errors.terms}</p>
            )}

            {/* Submit error */}
            {errors.submit && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{
                  background: 'rgba(248, 113, 113, 0.1)',
                  color: '#fca5a5',
                  border: '1px solid #f87171'
                }}
              >
                {errors.submit}
              </div>
            )}

            {/* Register button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-97 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              style={{
                background: 'var(--color-accent-primary)',
                color: 'white'
              }}
            >
              {isLoading ? (
                <>
                  <div
                    className="w-4 h-4 border-2 border-transparent rounded-full animate-spin"
                    style={{ borderTopColor: 'white' }}
                  />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div
              className="flex-1 h-px"
              style={{ background: 'var(--color-border)' }}
            />
            <span style={{ color: 'var(--color-text-secondary)' }} className="text-xs">
              Already have an account?
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: 'var(--color-border)' }}
            />
          </div>

          {/* Login link */}
          <p className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Sign in to your account{' '}
            <Link
              to="/login"
              className="font-semibold transition-colors"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              here
            </Link>
          </p>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }

        @keyframes float {
          0%, 100% { transform: translate(0px, 0px); }
          33% { transform: translate(30px, -30px); }
          66% { transform: translate(-20px, 20px); }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
