import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import StudentProfile from '../models/StudentProfile';
import EnterpriseProfile from '../models/EnterpriseProfile';
import Job from '../models/Job';
import CV from '../models/CV';
import ForumEdition from '../models/ForumEdition';
import Message from '../models/Message';

dotenv.config();



const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/enetcom-forum';

// Sample data
const companies = [
    { name: 'Vermeg', industry: 'FinTech', size: '500+', location: 'Tunis' },
    { name: 'Orange Tunisia', industry: 'Telecommunications', size: '1000+', location: 'Tunis' },
    { name: 'Telnet', industry: 'Software Development', size: '200-500', location: 'Sousse' },
    { name: 'Cynoia', industry: 'Cybersecurity', size: '50-200', location: 'Tunis' },
    { name: 'Sofrecom', industry: 'IT Consulting', size: '200-500', location: 'Tunis' },
    { name: 'Expensya', industry: 'SaaS', size: '100-200', location: 'Tunis' },
    { name: 'Linedata', industry: 'Financial Software', size: '500+', location: 'Tunis' },
    { name: 'Focus Corporation', industry: 'ERP Solutions', size: '200-500', location: 'Sfax' },
];

const studentNames = [
    { firstName: 'Ahmed', lastName: 'Ben Ali' },
    { firstName: 'Fatima', lastName: 'Trabelsi' },
    { firstName: 'Mohamed', lastName: 'Khiari' },
    { firstName: 'Amira', lastName: 'Ben Salem' },
    { firstName: 'Youssef', lastName: 'Gharbi' },
    { firstName: 'Salma', lastName: 'Mansouri' },
    { firstName: 'Karim', lastName: 'Bouazizi' },
    { firstName: 'Nour', lastName: 'Hamdi' },
    { firstName: 'Rami', lastName: 'Jebali' },
    { firstName: 'Ines', lastName: 'Cherif' },
    { firstName: 'Mehdi', lastName: 'Sassi' },
    { firstName: 'Leila', lastName: 'Dridi' },
    { firstName: 'Omar', lastName: 'Ayari' },
    { firstName: 'Sarra', lastName: 'Kacem' },
    { firstName: 'Bilel', lastName: 'Mrad' },
];

const skills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
    'Angular', 'Vue.js', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'Machine Learning', 'Data Science', 'Cybersecurity',
    'DevOps', 'CI/CD', 'Git', 'Agile', 'Scrum'
];

const jobTitles = [
    'Full Stack Developer Intern',
    'Frontend Developer Intern',
    'Backend Developer Intern',
    'Mobile App Developer Intern',
    'Data Science Intern',
    'DevOps Engineer Intern',
    'Cybersecurity Analyst Intern',
    'UI/UX Designer Intern',
    'QA Engineer Intern',
    'Cloud Engineer Intern',
];

async function clearDatabase() {
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await EnterpriseProfile.deleteMany({});
    await Job.deleteMany({});
    await CV.deleteMany({});
    await ForumEdition.deleteMany({});
    console.log('✅ Database cleared');
}

async function seedForumEditions() {
    console.log('📅 Seeding Forum Editions...');

    const editions = [
        {
            year: 2025,
            title: 'ENET\'Com Forum 2025 - Digital Transformation',
            description: 'The 2025 edition focused on digital transformation and Industry 4.0, bringing together 150 students and 45 leading companies in Tunisia. Students explored opportunities in AI, IoT, and cloud computing.',
            highlights: [
                'First-ever AI Workshop with Microsoft Tunisia',
                'Record 120 internship offers in one day',
                '3 startup pitch competitions with €10,000 in prizes',
                'Virtual reality company tours',
                'Blockchain and Web3 masterclass'
            ],
            statistics: {
                studentsParticipated: 150,
                companiesParticipated: 45,
                internshipsOffered: 120
            },
            published: true
        },
        {
            year: 2024,
            title: 'ENET\'Com Forum 2024 - Innovation & Sustainability',
            description: 'The 2024 edition emphasized sustainable technology and green innovation. Over 130 students connected with 40 companies committed to environmental responsibility.',
            highlights: [
                'Green Tech Summit with international speakers',
                'Launch of ENET\'Com Sustainability Initiative',
                '95% placement rate for participating students',
                'Carbon-neutral event certification',
                'Smart cities workshop series'
            ],
            statistics: {
                studentsParticipated: 130,
                companiesParticipated: 40,
                internshipsOffered: 95
            },
            published: true
        },
        {
            year: 2023,
            title: 'ENET\'Com Forum 2023 - Connecting Talent',
            description: 'Our 2023 forum marked a milestone with the introduction of our digital platform, making it easier than ever for students to connect with potential employers.',
            highlights: [
                'Launch of online application system',
                'First virtual company tours',
                'Career mentorship program initiated',
                'Student project showcase competition',
                'Technical interview bootcamp'
            ],
            statistics: {
                studentsParticipated: 110,
                companiesParticipated: 35,
                internshipsOffered: 80
            },
            published: true
        }
    ];

    await ForumEdition.insertMany(editions);
    console.log(`✅ Created ${editions.length} forum editions`);
}

async function seedStudents() {
    console.log('👨‍🎓 Seeding Students...');

    const students = [];
    const hashedPassword = await bcrypt.hash('password123', 10);

    for (let i = 0; i < studentNames.length; i++) {
        const student = studentNames[i];
        const username = `${student.firstName.toLowerCase()}.${student.lastName.toLowerCase().replace(' ', '')}`;
        const email = `${username}@mejdi.ch`;

        // Create user
        const user = await User.create({
            email,
            passwordHash: hashedPassword,
            role: 'STUDENT',
            status: 'active',
            emailVerified: true
        });

        // Random skills (3-7 skills per student)
        const studentSkills = [];
        const numSkills = Math.floor(Math.random() * 5) + 3;
        const shuffledSkills = [...skills].sort(() => 0.5 - Math.random());
        for (let j = 0; j < numSkills; j++) {
            studentSkills.push(shuffledSkills[j]);
        }

        // Create student profile
        const profile = await StudentProfile.create({
            userId: user._id,
            username,
            firstName: student.firstName,
            lastName: student.lastName,
            about: `Passionate ${['Software Engineering', 'Computer Networks', 'Data Science'][i % 3]} student at ENET'Com. Looking for challenging internship opportunities to apply my skills and learn from industry experts.`,
            skills: studentSkills,
            studyYear: ['1A', '2A', '3A', 'Master'][i % 4],
            specialization: ['Software Engineering', 'Computer Networks', 'Data Science', 'Cybersecurity'][i % 4],
            linkedinUrl: `https://linkedin.com/in/${username}`,
            githubUrl: `https://github.com/${username}`,
            lookingForInternship: Math.random() > 0.3
        });

        // Create CV for some students
        if (i % 2 === 0) {
            await CV.create({
                userId: user._id,
                templateId: 'modern',
                sections: [
                    {
                        id: 'personal',
                        type: 'personal',
                        title: 'Personal Information',
                        visible: true,
                        content: {
                            fullName: `${student.firstName} ${student.lastName}`,
                            email,
                            phone: `+216 ${Math.floor(Math.random() * 90000000) + 10000000}`,
                            location: 'Sfax, Tunisia'
                        }
                    },
                    {
                        id: 'education',
                        type: 'education',
                        title: 'Education',
                        visible: true,
                        content: [
                            {
                                institution: 'ENET\'Com - National School of Electronics and Telecommunications',
                                degree: 'Engineering Degree',
                                field: profile.specialization,
                                startDate: '2022',
                                endDate: '2026',
                                description: 'Focus on modern technologies and practical applications'
                            }
                        ]
                    },
                    {
                        id: 'skills',
                        type: 'skills',
                        title: 'Technical Skills',
                        visible: true,
                        content: studentSkills
                    },
                    {
                        id: 'projects',
                        type: 'projects',
                        title: 'Projects',
                        visible: true,
                        content: [
                            {
                                name: 'E-Commerce Platform',
                                description: 'Full-stack web application with React and Node.js',
                                technologies: ['React', 'Node.js', 'MongoDB'],
                                url: `https://github.com/${username}/ecommerce`
                            }
                        ]
                    }
                ],
                score: Math.floor(Math.random() * 30) + 70 // Score between 70-100
            });
        }

        students.push({ user, profile });
    }

    console.log(`✅ Created ${students.length} students`);
    return students;
}

async function seedEnterprises() {
    console.log('🏢 Seeding Enterprises...');

    const enterprises = [];
    const hashedPassword = await bcrypt.hash('password123', 10);

    for (let i = 0; i < companies.length; i++) {
        const company = companies[i];
        const slug = company.name.toLowerCase().replace(/\s+/g, '-');
        const email = `hr@${slug}.com`;

        // Create user
        const user = await User.create({
            email,
            passwordHash: hashedPassword,
            role: 'ENTERPRISE',
            status: 'active',
            emailVerified: true
        });

        // Create enterprise profile
        const profile = await EnterpriseProfile.create({
            userId: user._id,
            slug,
            companyName: company.name,
            description: `${company.name} is a leading ${company.industry} company in Tunisia, committed to innovation and excellence. We offer exciting opportunities for talented students to grow their careers.`,
            industry: company.industry,
            website: `https://www.${slug}.com`,
            location: company.location,
            size: company.size,
            contactName: `HR Manager - ${company.name}`,
            onboardingComplete: true,
            isApproved: true
        });

        enterprises.push({ user, profile });
    }

    console.log(`✅ Created ${enterprises.length} enterprises`);
    return enterprises;
}

async function seedJobs(enterprises: any[]) {
    console.log('💼 Seeding Jobs...');

    const jobs = [];

    for (let i = 0; i < enterprises.length; i++) {
        const enterprise = enterprises[i];
        const numJobs = Math.floor(Math.random() * 3) + 1; // 1-3 jobs per company

        for (let j = 0; j < numJobs; j++) {
            const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
            const isPFE = Math.random() > 0.6;

            const job = await Job.create({
                enterpriseId: enterprise.profile._id,
                title,
                description: `We are looking for a motivated ${title} to join our team. This is an excellent opportunity to work on real-world projects and gain hands-on experience in ${enterprise.profile.industry}.

**Responsibilities:**
- Collaborate with senior developers on ongoing projects
- Write clean, maintainable code
- Participate in code reviews and team meetings
- Learn and apply best practices in software development

**What We Offer:**
- Mentorship from experienced professionals
- Exposure to cutting-edge technologies
- Potential for full-time employment after internship
- Competitive stipend`,
                requirements: [
                    'Currently enrolled in Computer Science or related field',
                    'Strong problem-solving skills',
                    'Good communication skills in French and English',
                    'Passion for technology and learning',
                    Math.random() > 0.5 ? 'Experience with Git and version control' : 'Familiarity with Agile methodologies'
                ],
                type: isPFE ? 'pfe' : 'internship',
                location: enterprise.profile.location,
                remote: Math.random() > 0.7,
                status: ['open', 'open', 'open', 'closed'][Math.floor(Math.random() * 4)] as any
            });

            jobs.push(job);
        }
    }

    console.log(`✅ Created ${jobs.length} job listings`);
    return jobs;
}

async function seedMessages(students: any[], enterprises: any[]) {
    console.log('📨 Seeding Messages...');

    // Create Admin/System Sender
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
        email: 'admin@enetcom-forum.tn',
        passwordHash: adminPassword,
        role: 'ADMIN',
        status: 'active',
        emailVerified: true
    });

    const messages = [];
    const allUsers = [...students.map(s => s.user), ...enterprises.map(e => e.user)];

    for (const user of allUsers) {
        // Welcome Message
        messages.push({
            senderId: admin._id,
            receiverId: user._id,
            subject: 'Welcome to ENET\'Com Forum!',
            content: `Dear ${user.role === 'STUDENT' ? 'Student' : 'Partner'},

Welcome to the ENET'Com Forum platform! We are thrilled to have you here.

This platform is designed to bridge the gap between talented students and leading enterprises. 

For Students:
- Complete your profile and build your resume using our CV Designer.
- Browse job listings and apply for internships.
- Connect with companies.

For Enterprises:
- Use your dashboard to post job offers.
- Review applications and find the best talent.

If you have any questions, feel free to contact us.

Best regards,
The ENET'Com Forum Team`,
            read: false,
            createdAt: new Date()
        });
    }

    await Message.insertMany(messages);
    console.log(`✅ Created ${messages.length} welcome messages`);
}

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Clear existing data
        await clearDatabase();
        console.log('');

        // Seed data
        console.log('... Seeding Forum Editions');
        await seedForumEditions();
        console.log('... Seeding Students');
        const students = await seedStudents();
        console.log('... Seeding Enterprises');
        const enterprises = await seedEnterprises();
        console.log('... Seeding Jobs');
        const jobs = await seedJobs(enterprises);
        console.log('... Seeding Messages');
        await seedMessages(students, enterprises);

        // Summary
        console.log('📊 Seeding Summary:');
        console.log('='.repeat(50));
        console.log(`✅ Forum Editions: 3`);
        console.log(`✅ Students: ${students.length}`);
        console.log(`✅ Student CVs: ${Math.floor(students.length / 2)}`);
        console.log(`✅ Enterprises: ${enterprises.length}`);
        console.log(`✅ Job Listings: ${jobs.length}`);
        console.log('='.repeat(50));
        console.log('\n🎉 Database seeding completed successfully!\n');

        console.log('📝 Test Credentials:');
        console.log('Student: ahmed.benali@mejdi.ch / password123');
        console.log('Enterprise: hr@vermeg.com / password123');
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', JSON.stringify(error, null, 2));
        console.error(error);
        process.exit(1);
    }
}

seedDatabase();
