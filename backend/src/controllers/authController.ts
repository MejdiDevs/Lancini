import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import StudentProfile from '../models/StudentProfile';
import EnterpriseProfile from '../models/EnterpriseProfile';
import Message from '../models/Message';
import { sendVerificationEmail } from '../services/emailService';
import { ALLOWED_EMAIL_DOMAIN } from '../config/constants';

const generateToken = (id: string, role: string): string => {
    const secret = process.env.JWT_SECRET || 'dev-secret-key';
    return jwt.sign({ id, role }, secret, { expiresIn: '24h' });
};

export const registerStudent = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, studyYear } = req.body;

    if (!email.endsWith(ALLOWED_EMAIL_DOMAIN)) {
        return res.status(400).json({ message: `Must use ${ALLOWED_EMAIL_DOMAIN} email` });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const user = await User.create({
            email,
            passwordHash: password,
            role: 'STUDENT',
            status: 'pending_verification',
            emailVerified: false,
        });

        console.log('✅ User created:', user._id);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await user.save();

        console.log('✅ Verification token generated');

        await StudentProfile.create({
            userId: user._id,
            username: email.split('@')[0],
            firstName,
            lastName,
            studyYear,
            skills: []
        });

        console.log('✅ Student profile created');

        // Create welcome message from ENET'Com team
        try {
            let adminUser = await User.findOne({ email: 'admin@enetcom-forum.tn' });
            if (!adminUser) {
                adminUser = await User.create({
                    email: 'admin@enetcom-forum.tn',
                    passwordHash: 'admin-system-account',
                    role: 'ADMIN',
                    status: 'active',
                    emailVerified: true
                });
            }

            await Message.create({
                senderId: adminUser._id,
                receiverId: user._id,
                subject: 'Welcome to ENET\'Com Forum!',
                content: `Dear ${firstName},

Welcome to the ENET'Com Forum platform! We are thrilled to have you here.

This platform is designed to bridge the gap between talented students and leading enterprises. 

Here's what you can do:
- Complete your profile and build your resume using our CV Designer
- Browse job listings and apply for internships
- Connect with companies and explore opportunities

If you have any questions, feel free to reach out.

Best regards,
The ENET'Com Forum Team`,
                read: false
            });
            console.log('✅ Welcome message created');
        } catch (error) {
            console.error('⚠️ Failed to create welcome message:', error);
            // Don't fail registration if message creation fails
        }

        // Send verification email
        try {
            await sendVerificationEmail(email, firstName, verificationToken);
            console.log(`📧 Verification email sent to ${email}`);
        } catch (error) {
            console.error('⚠️ Failed to send verification email:', error);
            // Don't fail registration if email fails
        }

        res.status(201).json({
            message: 'Registration successful! Please check your email to verify your account.',
            email: user.email,
            requiresVerification: true
        });
    } catch (error: any) {
        console.error('❌ Registration error:', error);
        res.status(500).json({
            message: error.message || 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
        });
    }
};

export const registerEnterprise = async (req: Request, res: Response) => {
    const { email, password, companyName } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const user = await User.create({
            email,
            passwordHash: password,
            role: 'ENTERPRISE',
            status: 'pending_verification',
            emailVerified: false,
        });

        const slug = companyName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 7);

        await EnterpriseProfile.create({
            userId: user._id,
            companyName,
            slug,
            onboardingComplete: true
        });

        // Verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();

        // Send verification email
        try {
            await sendVerificationEmail(email, companyName, verificationToken);
        } catch (error) {
            console.error('⚠️ Verification email failed:', error);
        }

        res.status(201).json({
            message: 'Registration successful! Please check your email to verify your account.',
            email: user.email,
            requiresVerification: true
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Registration failed' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Check if email is verified
        if (!user.emailVerified) {
            return res.status(403).json({
                message: 'Please verify your email before logging in. Check your inbox for the verification link.',
                requiresVerification: true,
                email: user.email
            });
        }

        const token = generateToken(user._id.toString(), user.role);

        let profileData: any = {};
        if (user.role === 'STUDENT') {
            const profile = await StudentProfile.findOne({ userId: user._id });
            if (profile) {
                profileData = {
                    name: `${profile.firstName} ${profile.lastName}`,
                    profileImage: profile.profileImage
                };
            }
        } else if (user.role === 'ENTERPRISE') {
            const profile = await EnterpriseProfile.findOne({ userId: user._id });
            if (profile) {
                profileData = {
                    name: profile.companyName,
                    profileImage: profile.logoUrl
                };
            }
        } else if (user.role === 'ADMIN') {
            profileData = { name: 'Administrator' };
        }

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ _id: user._id, email: user.email, role: user.role, ...profileData });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

export const logoutUser = (req: Request, res: Response) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out' });
};

export const getMe = async (req: Request, res: Response) => {
    const user = await User.findById(req.user._id).select('-passwordHash').lean();

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    let profileData: any = {};

    if (user.role === 'STUDENT') {
        const profile = await StudentProfile.findOne({ userId: user._id });
        if (profile) {
            profileData = {
                name: `${profile.firstName} ${profile.lastName}`,
                profileImage: profile.profileImage
            };
        }
    } else if (user.role === 'ENTERPRISE') {
        const profile = await EnterpriseProfile.findOne({ userId: user._id });
        if (profile) {
            profileData = {
                name: profile.companyName,
                profileImage: profile.logoUrl
            };
        }
    } else if (user.role === 'ADMIN') {
        profileData = {
            name: 'Administrator'
        };
    }

    res.json({ ...user, ...profileData });
};

export const updatePassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
        user.passwordHash = newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(401).json({ message: 'Invalid current password' });
    }
};
