import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaFire, FaEye, FaEyeSlash } from 'react-icons/fa';
import { authAPI } from '../services/authService';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const isAdminLogin = location.pathname === '/admin/login';
  const from = location.state?.from?.pathname || (isAdminLogin ? '/admin' : '/');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = isAdminLogin 
        ? await authAPI.adminLogin(formData)
        : await authAPI.login(formData);

      login(response, response.token);
      toast.success(`Welcome back, ${response.firstName}!`);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-gold-400 to-primary-600 p-4 rounded-full"
            >
              <FaFire className="text-3xl text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            {isAdminLogin ? 'Admin Login' : 'Welcome Back'}
          </h1>
          <p className="text-gray-400">
            {isAdminLogin ? 'Login to admin dashboard' : 'Login to your SparkFire account'}
          </p>
        </div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 space-y-6"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-gold-400 focus:outline-none transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-gold-400 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : isAdminLogin ? 'Login to Dashboard' : 'Login'}
          </motion.button>

          {/* Links */}
          {!isAdminLogin && (
            <div className="space-y-3">
              <p className="text-center text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-gold-400 hover:text-gold-300 font-semibold">
                  Register here
                </Link>
              </p>
              <p className="text-center text-gray-400 text-sm">
                <Link to="/admin/login" className="text-blue-400 hover:text-blue-300">
                  Admin Login →
                </Link>
              </p>
            </div>
          )}

          {isAdminLogin && (
            <p className="text-center text-gray-400 text-sm">
              <Link to="/login" className="text-gold-400 hover:text-gold-300">
                ← Back to User Login
              </Link>
            </p>
          )}
        </motion.form>

        {/* Demo Credentials (for testing) */}
        {isAdminLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 glass rounded-xl p-4 text-center text-sm"
          >
            <p className="text-gray-400 mb-2">Demo Admin Credentials:</p>
            <p className="text-gold-400">Create admin first using API</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
