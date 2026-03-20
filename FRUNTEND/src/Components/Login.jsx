import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-transparent pt-24 px-4">
      <div className="max-w-md mx-auto rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
        
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded text-red-200 text-sm">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg text-white focus:outline-none focus:border-accent ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg text-white focus:outline-none focus:border-accent ${
                errors.password ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/80 bg-emerald-700 disabled:bg-gray-600 text-white font-bold py-2 rounded-lg transition-colors mt-6"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-accent hover:text-accent/80 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
