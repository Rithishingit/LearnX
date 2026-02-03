import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import API from '../services/api';
import { toast } from 'react-toastify';
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await login(formData);
            setUser(data.user);
            toast.success('Welcome back!');
            
            // Check if there's a redirect URL stored
            const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
                sessionStorage.removeItem('redirectAfterLogin');
                navigate(redirectUrl);
            } else if (data.user.role === 'admin') {
                toast.info('Welcome to Admin Control Center');
                navigate('/admin');
            } else if (data.user.role === 'instructor') {
                navigate('/instructor');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!forgotEmail) {
            toast.error('Please enter your email');
            return;
        }
        setForgotLoading(true);
        try {
            const { data } = await API.post('/auth/forgotpassword', { email: forgotEmail });
            toast.success('Password reset link sent to your email!');
            setShowForgotPassword(false);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send reset email');
        } finally {
            setForgotLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    const handleGithubLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/github';
    };

    const handleMicrosoftLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/microsoft';
    };

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
                        Welcome Back
                    </h1>
                    <p className="text-lg text-gray-600 font-light">
                        Continue your learning journey
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-10 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10 pointer-events-none" />

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label className="block text-sm font-bold text-gray-900 mb-3">
                                Email Address
                            </label>
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

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <label className="block text-sm font-bold text-gray-900">
                                    Password
                                </label>
                                <button 
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
                                >
                                    Forgot?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-transparent rounded-xl font-medium placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:shadow-lg focus:shadow-indigo-500/20 transition-all duration-300"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="my-8 flex items-center gap-3 relative z-10">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                        <span className="text-sm text-gray-500 font-medium">or</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>

                    {/* Social Login */}
                    <div className="space-y-3 relative z-10">
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={handleGoogleLogin}
                            type="button"
                            className="w-full border-2 border-gray-200 hover:border-red-300 text-gray-700 rounded-xl py-3 font-bold hover:bg-red-50 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={handleGithubLogin}
                            type="button"
                            className="w-full border-2 border-gray-200 hover:border-gray-400 text-gray-700 rounded-xl py-3 font-bold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Continue with GitHub
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={handleMicrosoftLogin}
                            type="button"
                            className="w-full border-2 border-gray-200 hover:border-blue-500 text-gray-700 rounded-xl py-3 font-bold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 0H0V11H11V0Z" fill="#F25022"/>
                                <path d="M23 0H12V11H23V0Z" fill="#7FBA00"/>
                                <path d="M11 12H0V23H11V12Z" fill="#00A4EF"/>
                                <path d="M23 12H12V23H23V12Z" fill="#FFB900"/>
                            </svg>
                            Continue with Microsoft
                        </motion.button>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-gray-600 mt-8 font-medium"
                >
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
                        Sign up
                    </Link>
                </motion.p>
            </div>

            {/* Forgot Password Modal */}
            <AnimatePresence>
                {showForgotPassword && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowForgotPassword(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h3>
                            <p className="text-gray-600 mb-6">Enter your email and we'll send you a reset link.</p>
                            
                            <form onSubmit={handleForgotPassword}>
                                <div className="relative mb-4">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                                    <input
                                        type="email"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-100 border-2 border-transparent rounded-xl font-medium placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition-all"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                                
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(false)}
                                        className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={forgotLoading}
                                        className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {forgotLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;
