import { Request, Response } from 'express';
import Job from '../models/Job';
import Application from '../models/Application';
import mongoose from 'mongoose';
import StudentProfile from '../models/StudentProfile';

export const getAllJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.find({ status: 'open' })
            .populate('enterpriseId', 'companyName logoUrl')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getJobById = async (req: Request, res: Response) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('enterpriseId', 'companyName logoUrl location website');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createJob = async (req: Request, res: Response) => {
    try {
        // Force status to pending for moderation
        const job = await Job.create({
            ...req.body,
            enterpriseId: req.user._id,
            status: 'pending'
        });
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

import User from '../models/User';

export const toggleSaveJob = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Ensure savedJobs array exists
        if (!user.savedJobs) user.savedJobs = [];

        const jobId = new mongoose.Types.ObjectId(id as string);
        const index = user.savedJobs.findIndex(jid => jid.toString() === id);

        if (index === -1) {
            user.savedJobs.push(jobId);
        } else {
            user.savedJobs.splice(index, 1);
        }
        await user.save();
        res.json(user.savedJobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getSavedJobs = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'savedJobs',
            populate: { path: 'enterpriseId', select: 'companyName logoUrl' }
        });
        res.json(user?.savedJobs || []);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const applyToJob = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const studentId = req.user._id;

        // Check if already applied
        const existing = await Application.findOne({ jobId: id, studentId });
        if (existing) {
            return res.status(400).json({ message: 'You have already applied to this job' });
        }

        const application = await Application.create({
            jobId: id,
            studentId,
            status: 'pending'
        });

        res.status(201).json(application);
    } catch (error) {
        console.error('Apply Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getAppliedJobs = async (req: Request, res: Response) => {
    try {
        const applications = await Application.find({ studentId: req.user._id })
            .populate({
                path: 'jobId',
                populate: { path: 'enterpriseId', select: 'companyName logoUrl' }
            })
            .sort({ appliedAt: -1 });

        // Return job objects with appliedAt included
        const jobResults = applications.map(app => {
            const job = app.jobId as any; // Cast to access toObject
            const jobObj = typeof job.toObject === 'function' ? job.toObject() : job;
            return {
                ...jobObj,
                appliedAt: app.appliedAt,
                status: app.status
            };
        });
        res.json(jobResults);
    } catch (error) {
        console.error('Fetch Applied Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
export const getEnterpriseJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.find({ enterpriseId: req.user._id })
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateJob = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const job = await Job.findOne({ _id: id, enterpriseId: req.user._id });

        if (!job) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }

        const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteJob = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const job = await Job.findOne({ _id: id, enterpriseId: req.user._id });

        if (!job) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }

        await Job.findByIdAndDelete(id);
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getJobsByEnterprise = async (req: Request, res: Response) => {
    try {
        const { enterpriseId } = req.params;
        const jobs = await Job.find({ enterpriseId, status: 'open' })
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching enterprise jobs:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getJobApplications = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const job = await Job.findOne({ _id: id, enterpriseId: req.user._id });

        if (!job) {
            return res.status(404).json({ message: 'Job not found or access denied' });
        }

        const applications = await Application.find({ jobId: id })
            .populate('studentId', 'email') // User model has email
            .sort({ appliedAt: -1 })
            .lean();

        // Fetch corresponding student profiles
        const userIds = applications.map(app => (app.studentId as any)?._id).filter(Boolean);
        const profiles = await StudentProfile.find({ userId: { $in: userIds } }).lean();

        // Merge profile data into response
        const enrichedApplications = applications.map(app => {
            const user = app.studentId as any;
            if (!user) return app; // Should not happen if referential integrity is kept

            const profile = profiles.find(p => p.userId.toString() === user._id.toString());

            return {
                ...app,
                studentId: {
                    _id: user._id,
                    email: user.email,
                    firstName: profile?.firstName || '',
                    lastName: profile?.lastName || '',
                    profileImage: profile?.profileImage,
                    bio: profile?.bio,
                    cvUrl: profile?.cvUrl || profile?.portfolio // Fallback or strict? Just cvUrl is fine.
                }
            };
        });

        res.json(enrichedApplications);
    } catch (error) {
        console.error('Fetch Applications Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
    try {
        const { id, applicationId } = req.params;
        const { status } = req.body;

        // Verify ownership
        const job = await Job.findOne({ _id: id, enterpriseId: req.user._id });
        if (!job) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const application = await Application.findByIdAndUpdate(
            applicationId,
            { status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getAdminJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.find({})
            .populate('enterpriseId', 'companyName logoUrl email')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error('Admin Jobs Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateJobStatusAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const job = await Job.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!job) return res.status(404).json({ message: 'Job not found' });

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};