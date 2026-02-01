export interface CVSkill {
    name: string;
    level: number; // 1-5
}

export interface CVEducation {
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface CVExperience {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface CVProject {
    title: string;
    description: string;
    technologies: string[];
    link?: string;
}

export interface CVPersonal {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    website?: string;
    linkedin?: string;
}

export interface CVData {
    personal: CVPersonal;
    education: CVEducation[];
    experience: CVExperience[];
    skills: CVSkill[];
    projects: CVProject[];
}

export const initialCVState: CVData = {
    personal: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
};
