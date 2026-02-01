import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';

// Load env from backend/.env (src/scripts/../../.env)
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/enetcom-forum';

const createAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@mtc.com';
        const password = 'password123';

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists.');
            console.log('Email:', adminEmail);

            let changed = false;
            // Update role if needed
            if (existingAdmin.role !== 'ADMIN') {
                existingAdmin.role = 'ADMIN';
                changed = true;
                console.log('Updated role to ADMIN');
            }
            // Update status if needed
            if (existingAdmin.status !== 'active') {
                existingAdmin.status = 'active';
                changed = true;
                console.log('Updated status to active');
            }

            if (changed) await existingAdmin.save();
            else console.log('User is already correctly configured.');

        } else {
            console.log('Creating new admin user...');
            const admin = new User({
                email: adminEmail,
                passwordHash: password, // Will be hashed by pre-save
                role: 'ADMIN',
                status: 'active',
                emailVerified: true
            });
            await admin.save();
            console.log('Admin created successfully');
            console.log('Email:', adminEmail);
            console.log('Password:', password);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
