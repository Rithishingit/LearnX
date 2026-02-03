const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Helper function to handle OAuth user creation/login
const handleOAuthUser = async (profile, provider, done) => {
    try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        
        if (!email) {
            return done(new Error('No email provided by OAuth provider'), null);
        }

        // Check if user exists with this OAuth ID
        let user = await User.findOne({ oauthProvider: provider, oauthId: profile.id });

        if (user) {
            return done(null, user);
        }

        // Check if user exists with this email
        user = await User.findOne({ email });

        if (user) {
            // Link OAuth to existing account
            user.oauthProvider = provider;
            user.oauthId = profile.id;
            if (!user.profilePic || user.profilePic === 'default-avatar.png') {
                user.profilePic = profile.photos && profile.photos[0] ? profile.photos[0].value : 'default-avatar.png';
            }
            await user.save();
            return done(null, user);
        }

        // Create new user
        const newUser = await User.create({
            name: profile.displayName || profile.username || email.split('@')[0],
            email,
            oauthProvider: provider,
            oauthId: profile.id,
            profilePic: profile.photos && profile.photos[0] ? profile.photos[0].value : 'default-avatar.png',
            isEmailVerified: true,
            points: 100,
            badges: [{
                id: 'newcomer',
                name: 'Newcomer',
                icon: '🌟',
                description: 'Joined the LearnX community',
            }],
        });

        return done(null, newUser);
    } catch (err) {
        return done(err, null);
    }
};

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'not-configured',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'not-configured',
    callbackURL: '/api/auth/google/callback',
    scope: ['profile', 'email']
}, (accessToken, refreshToken, profile, done) => {
    handleOAuthUser(profile, 'google', done);
}));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'not-configured',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'not-configured',
    callbackURL: '/api/auth/github/callback',
    scope: ['user:email']
}, (accessToken, refreshToken, profile, done) => {
    handleOAuthUser(profile, 'github', done);
}));

// Microsoft Strategy
passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID || 'not-configured',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || 'not-configured',
    callbackURL: '/api/auth/microsoft/callback',
    scope: ['user.read']
}, (accessToken, refreshToken, profile, done) => {
    handleOAuthUser(profile, 'microsoft', done);
}));

module.exports = passport;
