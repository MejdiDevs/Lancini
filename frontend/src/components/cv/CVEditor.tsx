import React from 'react';
import { CVData, CVSkill, CVExperience, CVEducation, CVProject } from '@/types/cv';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2 } from 'lucide-react';

interface CVEditorProps {
    data: CVData;
    onChange: (data: CVData) => void;
}

export const CVEditor: React.FC<CVEditorProps> = ({ data, onChange }) => {

    const updatePersonal = (field: string, value: string) => {
        onChange({ ...data, personal: { ...data.personal, [field]: value } });
    };

    // --- Experience Handlers ---
    const addExperience = () => {
        onChange({
            ...data,
            experience: [...data.experience, { company: '', position: '', startDate: '', endDate: '', description: '' }]
        });
    };
    const updateExperience = (index: number, field: keyof CVExperience, value: string) => {
        const newExp = [...data.experience];
        newExp[index] = { ...newExp[index], [field]: value };
        onChange({ ...data, experience: newExp });
    };
    const removeExperience = (index: number) => {
        onChange({ ...data, experience: data.experience.filter((_, i) => i !== index) });
    };

    // --- Education Handlers ---
    const addEducation = () => {
        onChange({
            ...data,
            education: [...data.education, { school: '', degree: '', startDate: '', endDate: '', description: '' }]
        });
    };
    const updateEducation = (index: number, field: keyof CVEducation, value: string) => {
        const newEdu = [...data.education];
        newEdu[index] = { ...newEdu[index], [field]: value };
        onChange({ ...data, education: newEdu });
    };
    const removeEducation = (index: number) => {
        onChange({ ...data, education: data.education.filter((_, i) => i !== index) });
    };

    // --- Skills Handlers ---
    const addSkill = () => {
        onChange({ ...data, skills: [...data.skills, { name: '', level: 3 }] });
    };
    const updateSkill = (index: number, value: string) => {
        const newSkills = [...data.skills];
        newSkills[index] = { ...newSkills[index], name: value };
        onChange({ ...data, skills: newSkills });
    };
    const removeSkill = (index: number) => {
        onChange({ ...data, skills: data.skills.filter((_, i) => i !== index) });
    };

    // --- Projects Handlers ---
    const addProject = () => {
        onChange({
            ...data,
            projects: [...data.projects, { title: '', description: '', technologies: [] }]
        });
    };
    const updateProject = (index: number, field: keyof CVProject, value: any) => {
        const newProjects = [...data.projects];
        newProjects[index] = { ...newProjects[index], [field]: value };
        onChange({ ...data, projects: newProjects });
    };
    const removeProject = (index: number) => {
        onChange({ ...data, projects: data.projects.filter((_, i) => i !== index) });
    };

    return (
        <div className="space-y-8 p-4">

            {/* Personal Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Personal Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Full Name" value={data.personal.fullName || ''} onChange={(e) => updatePersonal('fullName', e.target.value)} />
                    <Input placeholder="Email" value={data.personal.email || ''} onChange={(e) => updatePersonal('email', e.target.value)} />
                    <Input placeholder="Phone" value={data.personal.phone || ''} onChange={(e) => updatePersonal('phone', e.target.value)} />
                    <Input placeholder="Location" value={data.personal.location || ''} onChange={(e) => updatePersonal('location', e.target.value)} />
                    <Input placeholder="LinkedIn URL" className="col-span-2" value={data.personal.linkedin || ''} onChange={(e) => updatePersonal('linkedin', e.target.value)} />
                </div>
                <textarea
                    className="w-full min-h-[100px] p-3 rounded-md border text-sm bg-background"
                    placeholder="Professional Summary"
                    value={data.personal.summary || ''}
                    onChange={(e) => updatePersonal('summary', e.target.value)}
                />
            </div>

            {/* Experience Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold">Experience</h3>
                    <Button size="sm" variant="outline" onClick={addExperience}><Plus className="h-4 w-4 mr-2" /> Add</Button>
                </div>
                {data.experience.map((exp, index) => (
                    <div key={index} className="space-y-3 p-4 border rounded-lg bg-card/50 relative group">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                            onClick={() => removeExperience(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                            <Input placeholder="Job Title" value={exp.position || ''} onChange={(e) => updateExperience(index, 'position', e.target.value)} />
                            <Input placeholder="Company" value={exp.company || ''} onChange={(e) => updateExperience(index, 'company', e.target.value)} />
                            <Input placeholder="Start Date" value={exp.startDate || ''} onChange={(e) => updateExperience(index, 'startDate', e.target.value)} />
                            <Input placeholder="End Date" value={exp.endDate || ''} onChange={(e) => updateExperience(index, 'endDate', e.target.value)} />
                        </div>
                        <textarea
                            className="w-full min-h-[80px] p-3 rounded-md border text-sm bg-background"
                            placeholder="Description of responsibilities..."
                            value={exp.description || ''}
                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        />
                    </div>
                ))}
            </div>

            {/* Education Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <Button size="sm" variant="outline" onClick={addEducation}><Plus className="h-4 w-4 mr-2" /> Add</Button>
                </div>
                {data.education.map((edu, index) => (
                    <div key={index} className="space-y-3 p-4 border rounded-lg bg-card/50 relative group">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                            onClick={() => removeEducation(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                            <Input placeholder="School / University" value={edu.school || ''} onChange={(e) => updateEducation(index, 'school', e.target.value)} />
                            <Input placeholder="Degree" value={edu.degree || ''} onChange={(e) => updateEducation(index, 'degree', e.target.value)} />
                            <Input placeholder="Start Date" value={edu.startDate || ''} onChange={(e) => updateEducation(index, 'startDate', e.target.value)} />
                            <Input placeholder="End Date" value={edu.endDate || ''} onChange={(e) => updateEducation(index, 'endDate', e.target.value)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Skills Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold">Skills</h3>
                    <Button size="sm" variant="outline" onClick={addSkill}><Plus className="h-4 w-4 mr-2" /> Add</Button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {data.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                className="w-40"
                                placeholder="Skill"
                                value={skill.name || ''}
                                onChange={(e) => updateSkill(index, e.target.value)}
                            />
                            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-destructive" onClick={() => removeSkill(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Projects Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold">Projects</h3>
                    <Button size="sm" variant="outline" onClick={addProject}><Plus className="h-4 w-4 mr-2" /> Add</Button>
                </div>
                {data.projects.map((proj, index) => (
                    <div key={index} className="space-y-3 p-4 border rounded-lg bg-card/50 relative group">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                            onClick={() => removeProject(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="space-y-3">
                            <Input placeholder="Project Title" value={proj.title || ''} onChange={(e) => updateProject(index, 'title', e.target.value)} />
                            <Input
                                placeholder="Technologies (comma separated)"
                                value={proj.technologies ? proj.technologies.join(', ') : ''}
                                onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(s => s.trim()))}
                            />
                            <textarea
                                className="w-full min-h-[80px] p-3 rounded-md border text-sm bg-background"
                                placeholder="Project description..."
                                value={proj.description || ''}
                                onChange={(e) => updateProject(index, 'description', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};
