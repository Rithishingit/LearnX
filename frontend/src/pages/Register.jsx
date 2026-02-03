import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = ({ setUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const { data } = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'student'
            });
            setUser(data.user);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = formData.password.length >= 8 ? 'strong' : formData.password.length >= 6 ? 'medium' : 'weak';

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-white py-12 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <motion.div
                animate={{
                    y: [0, -30, 0],
                    x: [0, 20, 0],
                }}
                transition={{ duration: 15, repeat: Infinity }}
                className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none"
            />

            <motion.div
                animate={{
                    y: [0, 30, 0],
                    x: [0, -20, 0],
                }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none"
            />

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl lg:text-5xl font-bold font-heading text-gray-900 mb-3">
                        Create your account
                    </h1>
                    <p className="text-lg text-gray-600 font-light">
                        Join 50,000+ learners transforming their careers
                    </p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-10 overflow-hidden"
                >
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10 pointer-events-none" />

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        {/* Name Field */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label className="block text-sm font-bold text-gray-900 mb-3">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-transparent rounded-xl font-medium placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:shadow-lg focus:shadow-indigo-500/20 transition-all duration-300"
                                    placeholder="John Doe"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            <label className="block text-sm font-bold text-gray-900 mb-3">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-transparent rounded-xl font-medium placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:shadow-lg focus:shadow-indigo-500/20 transition-all duration-300"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </motion.div>

                        {/* Password Field */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="block text-sm font-bold text-gray-900 mb-3">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-transparent rounded-xl font-medium placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:shadow-lg focus:shadow-indigo-500/20 transition-all duration-300"
                                    placeholder="At least 6 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                                </button>
                            </div>
                            {formData.password && (
                                <div className="mt-2 text-xs font-medium">
                                    <span className={passwordStrength === 'strong' ? 'text-green-500' : passwordStrength === 'medium' ? 'text-yellow-500' : 'text-red-500'}>
                                        Password strength: {passwordStrength}
                                    </span>
                                </div>
                            )}
                        </motion.div>

                        {/* Confirm Password Field */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                        >
                            <label className="block text-sm font-bold text-gray-900 mb-3">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-transparent rounded-xl font-medium placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:shadow-lg focus:shadow-indigo-500/20 transition-all duration-300"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                                </button>
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50 mt-8"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </motion.button>
                    </form>

                    {/* Sign in link */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center text-gray-600 mt-6 font-medium"
                    >
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 hover:text-pink-600 font-bold transition-colors">
                            Sign in
                        </Link>
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;