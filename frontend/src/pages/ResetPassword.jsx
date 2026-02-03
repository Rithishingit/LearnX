import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { Lock, Loader2, CheckCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = ({ setUser }) => {
    const { resettoken } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const { data } = await API.put(`/auth/resetpassword/${resettoken}`, { password });
            setSuccess(true);
            toast.success('Password reset successful!');
            
            if (data.user && setUser) {
                setUser(data.user);
            }
            
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to reset password. Link may be expired.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-white py-12 px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                    >
                        <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Reset!</h1>
                    <p className="text-gray-600 mb-6">Your password has been successfully reset.</p>
                    <p className="text-sm text-gray-500">Redirecting to login...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-white py-12 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <motion.div
                animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                transition={{ duration: 15, repeat: Infinity }}
                className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none"
            />

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Reset Password</h1>
                    <p className="text-gray-600">Enter your new password below</p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-10"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-3">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 bg-slate-100 border-2 border-transparent rounded-xl font-medium placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-3">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-100 border-2 border-transparent rounded-xl font-medium placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                            )}
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Password must:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li className={`flex items-center gap-2 ${password.length >= 6 ? 'text-green-600' : ''}`}>
                                    <CheckCircle className={`w-4 h-4 ${password.length >= 6 ? 'text-green-500' : 'text-gray-300'}`} />
                                    Be at least 6 characters
                                </li>
                                <li className={`flex items-center gap-2 ${password === confirmPassword && password ? 'text-green-600' : ''}`}>
                                    <CheckCircle className={`w-4 h-4 ${password === confirmPassword && password ? 'text-green-500' : 'text-gray-300'}`} />
                                    Match confirmation
                                </li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading || password !== confirmPassword || password.length < 6}
                            className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-2xl disabled:shadow-none disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Resetting...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Back to Login */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-600 mt-8"
                >
                    Remember your password?{' '}
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
                        Sign in
                    </Link>
                </motion.p>
            </div>
        </div>
    );
};

export default ResetPassword;
