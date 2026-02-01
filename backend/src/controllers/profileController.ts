import { Request, Response } from 'express';
import StudentProfile from '../models/StudentProfile';
import EnterpriseProfile from '../models/EnterpriseProfile';
import User from '../models/User';
import Project from '../models/Project';

export const getMyProfile = async (req: Request, res: Response) => {
    try {
        let profile;
        if (req.user.role === 'STUDENT') {
            profile = await StudentProfile.findOne({ userId: req.user._id });
        } else if (req.user.role === 'ENTERPRISE') {
            profile = await EnterpriseProfile.findOne({ userId: req.user._id });
        }

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const role = req.user.role;
        const updateData: any = {};
        let profile;

        if (role === 'STUDENT') {
            const { firstName, lastName, bio, studyYear, skills, github, linkedin, portfolio, profileImage, bannerImage, cvUrl, username } = req.body;

            if (firstName !== undefined) updateData.firstName = firstName;
            if (lastName !== undefined) updateData.lastName = lastName;
            if (bio !== undefined) updateData.bio = bio;
            if (studyYear !== undefined) updateData.studyYear = studyYear;
            if (skills !== undefined) updateData.skills = skills;
            if (github !== undefined) updateData.github = github;
            if (linkedin !== undefined) updateData.linkedin = linkedin;
            if (portfolio !== undefined) updateData.portfolio = portfolio;
            if (profileImage !== undefined) updateData.profileImage = profileImage;
            if (bannerImage !== undefined) updateData.bannerImage = bannerImage;
            if (cvUrl !== undefined) updateData.cvUrl = cvUrl;
            if (username !== undefined) updateData.username = username;

            profile = await StudentProfile.findOneAndUpdate(
                { userId: req.user._id },
                { $set: updateData },
                { new: true, runValidators: false }
            );
        } else if (role === 'ENTERPRISE') {
            const { companyName, slug, description, industry, website, location, size, contactName, logoUrl, bannerUrl, linkedin, twitter } = req.body;

            if (companyName !== undefined) updateData.companyName = companyName;
            if (slug !== undefined) updateData.slug = slug;
            if (description !== undefined) updateData.description = description;
            if (industry !== undefined) updateData.industry = industry;
            if (website !== undefined) updateData.website = website;
            if (location !== undefined) updateData.location = location;
            if (size !== undefined) updateData.size = size;
            if (contactName !== undefined) updateData.contactName = contactName;
            if (logoUrl !== undefined) updateData.logoUrl = logoUrl; // logoUrl instead of profileImage
            if (bannerUrl !== undefined) updateData.bannerUrl = bannerUrl;
            if (linkedin !== undefined) updateData.linkedin = linkedin;
            if (twitter !== undefined) updateData.twitter = twitter;

            profile = await EnterpriseProfile.findOneAndUpdate(
                { userId: req.user._id },
                { $set: updateData },
                { new: true, runValidators: false }
            );
        }

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        console.error('❌ Error updating profile:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get user's projects
export const getMyProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create project
export const createProject = async (req: Request, res: Response) => {
    try {
        const { title, description, imageUrl, tags, link } = req.body;

        console.log('📝 Creating project with:', {
            title,
            description,
            imageUrl: imageUrl ? 'YES' : 'NO',
            tags,
            link
        });

        const project = await Project.create({
            userId: req.user._id,
            title,
            description,
            imageUrl,
            tags,
            link
        });

        console.log('✅ Project created successfully!');
        console.log('📸 Project image URL:', project.imageUrl);

        res.status(201).json(project);
    } catch (error) {
        console.error('❌ Error creating project:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update project
export const updateProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        console.log('📝 Updating project:', id);
        console.log('📄 Update data:', req.body);

        const project = await Project.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            { $set: req.body },
            { new: true }
        );

        if (!project) {
            console.error('❌ Project not found:', id);
            return res.status(404).json({ message: 'Project not found' });
        }

        console.log('✅ Project updated successfully!');
        res.json(project);
    } catch (error) {
        console.error('❌ Error updating project:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete project
export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const project = await Project.findOneAndDelete({ _id: id, userId: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Public: Get profile by username or slug
export const getProfileByUsername = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;

        // Check student first
        const studentProfile = await StudentProfile.findOne({ username }).lean();
        if (studentProfile) {
            return res.json({ ...studentProfile, role: 'STUDENT' });
        }

        // Check enterprise (slug)
        const enterpriseProfile = await EnterpriseProfile.findOne({ slug: username }).lean();
        if (enterpriseProfile) {
            return res.json({ ...enterpriseProfile, role: 'ENTERPRISE' });
        }

        return res.status(404).json({ message: 'Profile not found' });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Public: Get projects by user ID
export const getProjectsByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const projects = await Project.find({ userId }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects by user ID:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const students = await StudentProfile.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        console.error('Error fetching all students:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
