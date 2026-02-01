import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkMessages() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/enetcom-forum');

    const Message = require('./models/Message').default;
    const User = require('./models/User').default;

    const users = await User.find({ role: 'STUDENT' }).limit(3);
    console.log('\nChecking messages for students:');

    for (const user of users) {
        const messages = await Message.find({ receiverId: user._id });
        console.log(`\nUser: ${user.email}`);
        console.log(`  Messages: ${messages.length}`);
        if (messages.length > 0) {
            console.log(`  Sample: ${messages[0].subject}`);
        }
    }

    process.exit(0);
}

checkMessages();
