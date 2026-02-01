import { Request, Response } from 'express';
import CV from '../models/CV';
// import { generatePDF } from '../services/pdfService'; // To be implemented

export const getMyCV = async (req: Request, res: Response) => {
    const cv = await CV.findOne({ userId: req.user._id });
    if (!cv) {
        // Return empty template if no CV exists
        return res.json({
            templateId: 'modern',
            sections: [
                { id: 'personal', type: 'personal', title: 'Personal Info', visible: true, content: {} },
                { id: 'education', type: 'education', title: 'Education', visible: true, content: [] },
                { id: 'experience', type: 'experience', title: 'Experience', visible: true, content: [] },
                { id: 'skills', type: 'skills', title: 'Skills', visible: true, content: [] },
                { id: 'projects', type: 'projects', title: 'Projects', visible: true, content: [] },
            ]
        });
    }
    res.json(cv);
};

export const updateCV = async (req: Request, res: Response) => {
    const { sections, templateId } = req.body;

    let cv = await CV.findOne({ userId: req.user._id });

    if (cv) {
        cv.sections = sections;
        cv.templateId = templateId;
        await cv.save();
    } else {
        cv = await CV.create({
            userId: req.user._id,
            sections,
            templateId
        });
    }

    res.json(cv);
};

export const exportCV = async (req: Request, res: Response) => {
    // Logic to generate PDF using Puppeteer will go here
    // For now, returning a mock success
    res.json({ message: 'PDF Export triggered', url: '/mock-cv.pdf' });
};
