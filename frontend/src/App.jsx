import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Homepage from './components/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import OAuthCallback from './pages/OAuthCallback'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import InstructorDashboard from './pages/InstructorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import CreateCourse from './pages/CreateCourse'
import Learn from './pages/Learn'
import Leaderboard from './pages/Leaderboard'
import Wishlist from './pages/Wishlist'
import LearnXAI from './components/LearnXAI'
import { getMe, setSuppressAuthErrors } from './services/api'

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setSuppressAuthErrors(true);
                const { data } = await getMe();
                setUser(data.data);
            } catch (error) {
                setUser(null);
            } finally {
                setSuppressAuthErrors(false);
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-4">
                        LearnX
                    </div>
                    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen">
                <Navbar user={user} setUser={setUser} />
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" replace />} />
                    <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" replace />} />
                    <Route path="/reset-password/:resettoken" element={<ResetPassword setUser={setUser} />} />
                    <Route path="/oauth-callback" element={<OAuthCallback setUser={setUser} />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:id" element={<CourseDetail user={user} />} />
                    <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />} />
                    <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" replace />} />
                    <Route path="/leaderboard" element={<Leaderboard user={user} />} />
                    <Route path="/wishlist" element={user ? <Wishlist user={user} /> : <Navigate to="/login" replace />} />
                    <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/" replace />} />
                    <Route path="/instructor" element={user?.role === 'instructor' ? <InstructorDashboard user={user} /> : <Navigate to="/" replace />} />
                    <Route path="/instructor/create-course" element={user?.role === 'admin' || user?.role === 'instructor' ? <CreateCourse /> : <Navigate to="/" replace />} />
                    <Route path="/learn/:id" element={user ? <Learn user={user} /> : <Navigate to="/login" replace />} />
                </Routes>
                <ToastContainer 
                    theme="light" 
                    position="bottom-right" 
                    toastClassName="!bg-white !text-gray-900 !shadow-soft-lg !border !border-gray-100"
                />
                <LearnXAI user={user} />
            </div>
        </Router>
    )
}

export default App