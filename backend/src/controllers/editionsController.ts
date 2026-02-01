import { Request, Response } from 'express';
import ForumEdition from '../models/ForumEdition';

export const getAllEditions = async (req: Request, res: Response) => {
    const editions = await ForumEdition.find({ published: true })
        .sort({ year: -1 })
        .select('year title statistics');
    res.json(editions);
};

export const getEditionByYear = async (req: Request, res: Response) => {
    const { year } = req.params;
    const edition = await ForumEdition.findOne({ year: parseInt(year), published: true });

    if (!edition) {
        return res.status(404).json({ message: 'Edition not found' });
    }

    res.json(edition);
};

// Seed function for demo data
export const seedEditions = async (req: Request, res: Response) => {
    const demoEditions = [
        {
            year: 2025,
            title: 'ENET\'Com Forum 2025 - Digital Transformation',
            description: 'The 2025 edition focused on digital transformation and Industry 4.0, bringing together 150 students and 45 leading companies in Tunisia. Students explored opportunities in AI, IoT, and cloud computing.',
            highlights: [
                'First-ever AI Workshop with Microsoft Tunisia',
                'Record 120 internship offers in one day',
                '3 startup pitch competitions with €10,000 in prizes'
            ],
            statistics: {
                studentsParticipated: 150,
                companiesParticipated: 45,
                internshipsOffered: 120
            },
            gallery: [
                { url: '/images/2025-opening.jpg', caption: 'Opening Ceremony' },
                { url: '/images/2025-workshop.jpg', caption: 'AI Workshop Session' },
                { url: '/images/2025-networking.jpg', caption: 'Networking Event' }
            ],
            charteGraphique: [
                { name: 'Charte Graphique 2025.pdf', url: '/downloads/charte-2025.pdf', fileSize: 2500000 }
            ],
            published: true
        },
        {
            year: 2024,
            title: 'ENET\'Com Forum 2024 - Innovation & Sustainability',
            description: 'The 2024 edition emphasized sustainable technology and green innovation. Over 130 students connected with 40 companies committed to environmental responsibility.',
            highlights: [
                'Green Tech Summit with international speakers',
                'Launch of ENET\'Com Sustainability Initiative',
                '95% placement rate for participating students'
            ],
            statistics: {
                studentsParticipated: 130,
                companiesParticipated: 40,
                internshipsOffered: 95
            },
            gallery: [
                { url: '/images/2024-panel.jpg', caption: 'Sustainability Panel Discussion' },
                { url: '/images/2024-expo.jpg', caption: 'Company Expo Hall' }
            ],
            charteGraphique: [
                { name: 'Charte Graphique 2024.pdf', url: '/downloads/charte-2024.pdf', fileSize: 2200000 }
            ],
            published: true
        },
        {
            year: 2023,
            title: 'ENET\'Com Forum 2023 - Connecting Talent',
            description: 'Our 2023 forum marked a milestone with the introduction of our digital platform, making it easier than ever for students to connect with potential employers.',
            highlights: [
                'Launch of online application system',
                'First virtual company tours',
                'Career mentorship program initiated'
            ],
            statistics: {
                studentsParticipated: 110,
                companiesParticipated: 35,
                internshipsOffered: 80
            },
            gallery: [
                { url: '/images/2023-platform.jpg', caption: 'Platform Launch Event' }
            ],
            charteGraphique: [
                { name: 'Charte Graphique 2023.pdf', url: '/downloads/charte-2023.pdf', fileSize: 1900000 }
            ],
            published: true
        }
    ];

    try {
        await ForumEdition.deleteMany({}); // Clear existing
        await ForumEdition.insertMany(demoEditions);
        res.json({ message: 'Demo editions seeded successfully', count: demoEditions.length });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
