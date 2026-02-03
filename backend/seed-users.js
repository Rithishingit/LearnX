const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB Connected');
    seedUsers();
}).catch(err => {
    console.error('MongoDB Error:', err);
    process.exit(1);
});

const seedUsers = async () => {
    try {
        const users = [
            {
                name: 'Test Student',
                email: 'student@test.com',
                password: 'Password123',
                role: 'student'
            },
            {
                name: 'Test Instructor',
                email: 'instructor@test.com',
                password: 'Password123',
                role: 'instructor'
            },
            {
                name: 'Test Admin',
                email: 'admin@test.com',
                password: 'Password123',
                role: 'admin'
            }
        ];

        for (const userData of users) {
            const exists = await User.findOne({ email: userData.email });
            if (exists) {
                // Delete and recreate to reset password
                await User.deleteOne({ email: userData.email });
            }
            const user = new User(userData);
            await user.save();
            console.log(`✅ Created: ${userData.email} / ${userData.password}`);
        }

        console.log('\n🎉 All test accounts ready!');
        console.log('\nLogin with:');
        console.log('  Email: student@test.com');
        console.log('  Password: Password123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};
