import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, Shield, Menu, X, Heart, Trophy, LayoutDashboard } from 'lucide-react';
import { logout } from '../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import BrandLogo from './BrandLogo';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isHome = location.pathname === '/';
    const navClassName = isHome
        ? 'sticky top-0 z-50 bg-slate-950/35 backdrop-blur-xl border-b border-white/10'
        : 'sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm';

    const navLinkClassName = isHome
        ? 'text-slate-200 hover:text-white font-semibold transition-colors relative group'
        : 'text-gray-700 hover:text-indigo-600 font-semibold transition-colors relative group';

    const mobileWrapClassName = isHome ? 'pt-4 pb-4 border-t border-white/10 space-y-4' : 'pt-4 pb-4 border-t border-gray-100 space-y-4';

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={navClassName}
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="group">
                        <BrandLogo
                            theme={isHome ? 'dark' : 'light'}
                            iconSize={40}
                            className=""
                            iconWrapClassName="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:shadow-2xl"
                            wordmarkClassName=""
                        />
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link 
                            to="/courses" 
                            className={navLinkClassName}
                        >
                            Browse Courses
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 group-hover:w-full transition-all duration-300" />
                        </Link>
                        
                        {user ? (
                            <div className="flex items-center gap-6">
                                <Link 
                                    to="/dashboard" 
                                    className={navLinkClassName}
                                >
                                    Dashboard
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 group-hover:w-full transition-all duration-300" />
                                </Link>

                                {user.role === 'admin' && (
                                    <Link 
                                        to="/admin" 
                                        className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Admin Panel
                                    </Link>
                                )}

                                {user.role === 'instructor' && (
                                    <Link 
                                        to="/instructor" 
                                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Instructor
                                    </Link>
                                )}
                                
                                <Link 
                                    to="/wishlist" 
                                    className={`p-2 transition-colors relative ${isHome ? 'text-slate-300 hover:text-pink-300' : 'text-gray-500 hover:text-pink-500'}`}
                                    title="Wishlist"
                                >
                                    <Heart className="w-5 h-5" />
                                </Link>

                                <Link 
                                    to="/leaderboard" 
                                    className={`p-2 transition-colors relative ${isHome ? 'text-slate-300 hover:text-amber-300' : 'text-gray-500 hover:text-amber-500'}`}
                                    title="Leaderboard"
                                >
                                    <Trophy className="w-5 h-5" />
                                </Link>
                                
                                <Link 
                                    to="/profile" 
                                    className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition-all duration-300 border ${
                                        isHome
                                            ? 'bg-white/5 hover:bg-white/10 text-white border-white/15 hover:border-white/25'
                                            : 'bg-gradient-to-r from-indigo-500/10 to-pink-500/10 hover:from-indigo-500/20 hover:to-pink-500/20 text-indigo-600 border-indigo-200 hover:border-indigo-400'
                                    }`}
                                >
                                    <User className="w-4 h-4" />
                                    {user.name?.split(' ')[0]}
                                </Link>
                                
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout} 
                                    className={`p-2 rounded-lg transition-colors ${isHome ? 'text-slate-300 hover:text-red-300 hover:bg-white/5' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </motion.button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link 
                                    to="/login" 
                                    className={navLinkClassName}
                                >
                                    Sign in
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 group-hover:w-full transition-all duration-300" />
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white px-7 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-0.5"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${isHome ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                    >
                        {mobileMenuOpen ? (
                            <X className={`w-6 h-6 ${isHome ? 'text-white' : 'text-gray-700'}`} />
                        ) : (
                            <Menu className={`w-6 h-6 ${isHome ? 'text-white' : 'text-gray-700'}`} />
                        )}
                    </motion.button>
                </div>

                <motion.div
                    initial={false}
                    animate={mobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden overflow-hidden"
                >
                    <div className={mobileWrapClassName}>
                        <Link to="/courses" className={`block font-semibold ${isHome ? 'text-slate-200 hover:text-white' : 'text-gray-700 hover:text-indigo-600'}`}>
                            Browse Courses
                        </Link>
                        {user ? (
                            <>
                                <Link to="/profile" className={`block font-semibold ${isHome ? 'text-slate-200 hover:text-white' : 'text-gray-700 hover:text-indigo-600'}`}>
                                    My Profile
                                </Link>
                                <Link to="/dashboard" className={`block font-semibold ${isHome ? 'text-slate-200 hover:text-white' : 'text-gray-700 hover:text-indigo-600'}`}>
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className={`w-full text-left font-semibold ${isHome ? 'text-slate-200 hover:text-red-300' : 'text-gray-700 hover:text-red-600'}`}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className={`block font-semibold ${isHome ? 'text-slate-200 hover:text-white' : 'text-gray-700 hover:text-indigo-600'}`}>
                                    Sign in
                                </Link>
                                <Link to="/register" className="block bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-5 py-2 rounded-xl font-bold text-center">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
