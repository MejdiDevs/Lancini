import { Request, Response } from 'express';
import InterviewSession from '../models/InterviewSession';
import StudentProfile from '../models/StudentProfile';
import Job from '../models/Job';
import { parseResume, getSummaryForAnalysis } from '../services/resumeParser';
import { generateFirstQuestion, generateNextQuestion } from '../services/aiService';
import path from 'path';
import fs from 'fs';

// Helper to get resume summary
const getResumeSummary = async (userId: string) => {
    const profile = await StudentProfile.findOne({ userId });
    if (profile && profile.cvUrl) {
        let filePath = profile.cvUrl;
        const textPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
        const possiblePaths = [
            filePath,
            path.join(process.cwd(), filePath),
            path.join(process.cwd(), 'uploads', path.basename(filePath)),
            path.join(__dirname, '../../', textPath)
        ];

        for (const p of possiblePaths) {
            if (fs.existsSync(p) && p.toLowerCase().endsWith('.pdf')) {
                const parsed = await parseResume(p);
                return getSummaryForAnalysis(parsed);
            }
        }
    }
    return "No resume provided.";
};

export const startInterview = async (req: Request, res: Response) => {
    try {
        const { jobId, role } = req.body;
        const userId = req.user._id;

        // If jobId provided, fetch role from job
        let targetRole = role;
        if (jobId) {
            const job = await Job.findById(jobId);
            if (job) targetRole = job.title;
        }

        if (!targetRole) return res.status(400).json({ message: "Role is required" });

        const resumeSummary = await getResumeSummary(userId);
        const question = await generateFirstQuestion(targetRole, resumeSummary);

        const session = await InterviewSession.create({
            userId,
            jobId,
            role: targetRole,
            messages: [{
                role: 'interviewer',
                content: question || "Tell me about yourself.",
                timestamp: new Date()
            }]
        });

        res.json({ sessionId: session._id, question });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to start interview" });
    }
};

export const submitAnswer = async (req: Request, res: Response) => {
    try {
        const { sessionId, answer } = req.body;
        const session = await InterviewSession.findById(sessionId);

        if (!session) return res.status(404).json({ message: "Session not found" });

        // Add user answer
        session.messages.push({
            role: 'candidate',
            content: answer,
            timestamp: new Date()
        });

        // Generate history string
        const historyContext = session.messages.slice(-6).map(m =>
            `${m.role.toUpperCase()}: ${m.content}`
        ).join('\n');

        const aiResponse = await generateNextQuestion(session.role, historyContext, answer);

        // Add AI response
        session.messages.push({
            role: 'interviewer',
            content: aiResponse || "Thank you. Let's move on.",
            timestamp: new Date()
        });

        await session.save();

        res.json({
            response: aiResponse,
            isFinished: false // Implement finish logic later
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to process answer" });
    }
};

export const getSession = async (req: Request, res: Response) => {
    try {
        const session = await InterviewSession.findById(req.params.id);
        if (!session) return res.status(404).json({ message: "Session not found" });
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: "Error fetching session" });
    }
};
