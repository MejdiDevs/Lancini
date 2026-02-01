import { Request, Response } from 'express';
import StudentProfile from '../models/StudentProfile';
import CV from '../models/CV';
import { parseResume, getSummaryForAnalysis } from '../services/resumeParser';
import { analyzeResumeAts } from '../services/aiService';
import path from 'path';
import fs from 'fs';

const convertCVSectionsToText = (sections: any[]): string => {
    let text = "";

    const personal = sections.find(s => s.type === 'personal');
    if (personal && personal.content) {
        const p = personal.content;
        text += `CONTACT:\nName: ${p.fullName || ''}\nEmail: ${p.email || ''}\nPhone: ${p.phone || ''}\nSummary: ${p.summary || ''}\n\n`;
    }

    const skills = sections.find(s => s.type === 'skills');
    if (skills && Array.isArray(skills.content)) {
        text += `SKILLS:\n${skills.content.map((s: any) => s.name || s).join(', ')}\n\n`;
    }

    const experience = sections.find(s => s.type === 'experience');
    if (experience && Array.isArray(experience.content)) {
        text += `EXPERIENCE:\n`;
        experience.content.forEach((exp: any) => {
            text += `${exp.role} at ${exp.company} (${exp.startDate} - ${exp.endDate}):\n${exp.description}\n`;
        });
        text += `\n`;
    }

    const education = sections.find(s => s.type === 'education');
    if (education && Array.isArray(education.content)) {
        text += `EDUCATION:\n`;
        education.content.forEach((edu: any) => {
            text += `${edu.degree} in ${edu.field} at ${edu.school}\n`;
        });
        text += `\n`;
    }

    return text;
};

export const analyzeCV = async (req: Request, res: Response) => {
    const userId = req.user._id;
    let cvText = '';

    // 1. Try uploaded file (Priority as per user request)
    const profile = await StudentProfile.findOne({ userId });
    console.log("Profile Found:", profile ? profile._id : "No");

    if (profile && profile.cvUrl) {
        let filePath = profile.cvUrl;
        console.log("CV URL:", filePath);

        // Handle local paths
        // Remove leading slash if present for path.join
        const textPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;

        // Try multiple path resolutions
        const possiblePaths = [
            filePath,
            path.join(process.cwd(), filePath),
            path.join(process.cwd(), 'uploads', path.basename(filePath)),
            path.join(__dirname, '../../', textPath)
        ];

        let foundPath = '';
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                foundPath = p;
                break;
            }
        }

        if (foundPath && foundPath.toLowerCase().endsWith('.pdf')) {
            console.log("Parsing PDF at:", foundPath);
            try {
                const parsed = await parseResume(foundPath);
                cvText = getSummaryForAnalysis(parsed);
            } catch (e) {
                console.error("PDF Parse Failed:", e);
                // Continue to fallback
            }
        } else {
            console.log("File not found or not PDF:", possiblePaths);
        }
    }

    // 2. Fallback to CV Builder Data
    if (!cvText || cvText.length < 50) {
        console.log("Detailed parsing failed or empty, trying CV Builder data");
        const cv = await CV.findOne({ userId });
        if (cv && cv.sections) {
            cvText = convertCVSectionsToText(cv.sections);
        }
    }

    if (!cvText || cvText.length < 50) {
        return res.status(400).json({
            message: "Could not extract sufficient text from your CV. Please ensure you have uploaded a PDF or filled out the CV Designer."
        });
    }

    console.log("Analyzing Text Length:", cvText.length);

    try {
        const analysis = await analyzeResumeAts(cvText);
        res.json(analysis);
    } catch (error: any) {
        console.error("Analysis Error:", error);
        res.status(500).json({ message: "AI Analysis failed", error: error.message });
    }
};
