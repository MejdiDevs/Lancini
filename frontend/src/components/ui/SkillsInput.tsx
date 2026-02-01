import { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';

interface SkillsInputProps {
    skills: string[];
    onChange: (skills: string[]) => void;
}

export function SkillsInput({ skills, onChange }: SkillsInputProps) {
    const [inputValue, setInputValue] = useState('');

    const addSkill = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !skills.includes(trimmed)) {
            onChange([...skills, trimmed]);
            setInputValue('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        onChange(skills.filter(skill => skill !== skillToRemove));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a skill (e.g., React, Python, Design)"
                />
                <Button
                    type="button"
                    onClick={addSkill}
                    disabled={!inputValue.trim()}
                    size="sm"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium group hover:bg-primary/20 transition-colors"
                        >
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-1 hover:bg-primary/30 rounded-full p-0.5 transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {skills.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    No skills added yet. Type and press Enter or click + to add.
                </p>
            )}
        </div>
    );
}
