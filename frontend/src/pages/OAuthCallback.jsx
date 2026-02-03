import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';
import { Loader2 } from 'lucide-react';

const OAuthCallback = ({ setUser }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');
            const errorParam = searchParams.get('error');

            if (errorParam) {
                setError('Authentication failed. Please try again.');
                toast.error('OAuth authentication failed');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            if (token) {
                try {
                    // Token is already set in cookie by backend
                    // Fetch user data
                    const { data } = await API.get('/auth/me');
                    setUser(data.data);
                    toast.success('Welcome to LearnX!');
                    
                    // Check if there's a redirect URL stored
                    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
                    if (redirectUrl) {
                        sessionStorage.removeItem('redirectAfterLogin');
                        navigate(redirectUrl);
                    } else if (data.data.role === 'admin') {
                        toast.info('Welcome to Admin Control Center');
                        navigate('/admin');
                    } else if (data.data.role === 'instructor') {
                        navigate('/instructor');
                    } else {
                        navigate('/dashboard');
                    }
                } catch (err) {
                    console.error('OAuth callback error:', err);
                    setError('Failed to complete authentication');
                    toast.error('Authentication error');
                    setTimeout(() => navigate('/login'), 2000);
                }
            } else {
                setError('No authentication token received');
                setTimeout(() => navigate('/login'), 2000);
            }
        };

        handleCallback();
    }, [searchParams, navigate, setUser]);

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-white">
            <div className="text-center">
                {error ? (
                    <div className="text-red-600">
                        <p className="text-xl font-semibold mb-2">{error}</p>
                        <p className="text-gray-600">Redirecting to login...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                        <p className="text-xl font-semibold text-gray-700">Completing sign in...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OAuthCallback;
