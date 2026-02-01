import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/enetcom-forum';

async function verifyUserByEmail(email: string) {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`❌ User not found: ${email}`);
            process.exit(1);
        }

        if (user.emailVerified) {
            console.log(`ℹ️  User ${email} is already verified`);
            process.exit(0);
        }

        user.emailVerified = true;
        user.status = 'active';
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        console.log(`✅ Successfully verified user: ${email}`);
        console.log(`   Status: ${user.status}`);
        console.log(`   Role: ${user.role}\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
    console.log('Usage: npm run verify-user <email>');
    console.log('Example: npm run verify-user john.doe@gmail.com');
    process.exit(1);
}

verifyUserByEmail(email);
