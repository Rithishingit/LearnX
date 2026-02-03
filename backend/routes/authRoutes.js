const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { 
    register, 
    login, 
    getMe, 
    logout,
    oauthLogin,
    forgotPassword,
    resetPassword,
    updatePassword,
    getUserStats,
    getLeaderboard,
    updateStreak
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/oauth', oauthLogin);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatepassword', protect, updatePassword);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.get('/stats', protect, getUserStats);
router.get('/leaderboard', getLeaderboard);
router.put('/streak', protect, updateStreak);

// Helper function to generate JWT and redirect
const handleOAuthCallback = (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    
    // Set cookie
    res.cookie('token', token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
    });
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}`);
};

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed` }),
    handleOAuthCallback
);

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=github_auth_failed` }),
    handleOAuthCallback
);

// Microsoft OAuth routes
router.get('/microsoft', passport.authenticate('microsoft', { scope: ['user.read'] }));
router.get('/microsoft/callback',
    passport.authenticate('microsoft', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=microsoft_auth_failed` }),
    handleOAuthCallback
);

module.exports = router;
