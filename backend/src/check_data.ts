import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/enetcom-forum';

async function checkData() {
    await mongoose.connect(MONGODB_URI);

    const Job = require('./models/Job').default;
    const Message = require('./models/Message').default;

    const jobCount = await Job.countDocuments();
    const messageCount = await Message.countDocuments();

    console.log('Jobs in database:', jobCount);
    console.log('Messages in database:', messageCount);

    if (jobCount > 0) {
        const jobs = await Job.find().limit(1);
        console.log('Sample job:', JSON.stringify(jobs[0], null, 2));
    }

    if (messageCount > 0) {
        const messages = await Message.find().limit(1);
        console.log('Sample message:', JSON.stringify(messages[0], null, 2));
    }

    process.exit(0);
}

checkData();
