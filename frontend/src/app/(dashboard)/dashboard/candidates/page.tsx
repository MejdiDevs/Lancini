'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Calendar,
    MessageSquare,
    Paperclip,
    Plus,
    LayoutGrid,
    Bot,
    CheckSquare,
    ExternalLink,
    MapPin,
    GraduationCap,
    Star,
    Sparkles,
    Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Student {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    bio?: string;
    skills: string[];
    studyYear: string;
    lookingForInternship: boolean;
    createdAt: string;
}

export default function FindCandidatesPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(false); // Set to false manually for demo if needed, but fetch real
            const { data } = await api.get('/profile/all-students');
            setStudents(data);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: 'featured', title: 'Featured Talent', color: 'orange', dot: 'bg-[#EC6D0A]' },
        { id: 'internship', title: 'Internship Ready (2A)', color: 'yellow', dot: 'bg-[#FFC107]' },
        { id: 'early', title: 'Early Careers (1A)', color: 'gray', dot: 'bg-gray-400' },
    ];

    const getStudentsByCategory = (catId: string) => {
        if (!students) return [];
        let filtered = students.filter(s =>
            s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.skills.some(sk => sk.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        switch (catId) {
            case 'featured':
                return filtered.filter(s => s.skills.length > 5).slice(0, 5);
            case 'graduating':
                return filtered.filter(s => ['3A', 'Master', '3rd Year'].includes(s.studyYear));
            case 'internship':
                return filtered.filter(s => ['2A', '2nd Year'].includes(s.studyYear));
            case 'early':
                return filtered.filter(s => ['1A', '1st Year'].includes(s.studyYear));
            default:
                return filtered;
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Sparkles className="h-8 w-8 text-[#d66209] animate-pulse mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Scanning Talent Pool...</p>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-[#F9FAFB]">
            {/* Page Controls - From CandRef Structure */}
            <div className="px-10 py-10 bg-[#F9FAFB] shrink-0">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Talent Discovery Board</h1>

                    <div className="flex gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#d66209] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name or skill..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-11 w-64 pl-10 pr-4 bg-white border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#d66209]/10 focus:border-[#d66209] transition-all shadow-sm"
                            />
                        </div>
                        <Button variant="ghost" className="bg-white border border-gray-100 rounded-xl h-11 px-4 font-bold text-gray-600 shadow-sm">
                            <Filter className="h-4 w-4 mr-2 opacity-60" /> Filter
                        </Button>
                    </div>
                </div>
            </div>

            {/* Kanban Board - From CandRef Structure */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-10">
                <div className="flex gap-6 px-8 h-full min-w-max">
                    {categories.map((cat) => {
                        const catStudents = getStudentsByCategory(cat.id);
                        return (
                            <div key={cat.id} className="w-[320px] h-full flex flex-col shrink-0">
                                {/* Column Header */}
                                <div className={cn(
                                    "flex items-center px-4 py-3.5 rounded-2xl mb-5 space-x-3",
                                    cat.id === 'featured' ? "bg-orange-50" :
                                        cat.id === 'internship' ? "bg-yellow-50" : "bg-gray-50"
                                )}>
                                    <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", cat.dot)} />
                                    <span className="flex-1 text-xs font-black uppercase tracking-widest text-gray-900">
                                        {cat.title} ({catStudents.length.toString().padStart(2, '0')})
                                    </span>
                                    <button className="h-6 w-6 rounded-lg hover:bg-white/50 flex items-center justify-center text-gray-400">
                                        <Plus className="h-3 w-3" />
                                    </button>
                                </div>

                                {/* Column Cards Container */}
                                <div className="flex-1 space-y-4 overflow-y-auto pr-3 custom-scrollbar pb-10">
                                    {catStudents.map((s) => (
                                        <Card key={s._id} className="p-5 border-gray-100 hover:border-[#d66209] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-grab">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 border-2 border-white shadow-sm ring-1 ring-gray-100">
                                                    {s.profileImage ? (
                                                        <img src={s.profileImage} alt={s.firstName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[#d66209] font-black text-sm">
                                                            {s.firstName[0]}{s.lastName[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-black text-gray-900 truncate">{s.firstName} {s.lastName}</h4>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">@{s.username}</p>
                                                </div>
                                                <button className="text-gray-300 hover:text-gray-600 transition-colors">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-[11px] font-bold text-gray-600 line-clamp-2 leading-relaxed">
                                                    {s.bio || 'Future engineer ready to innovate.'}
                                                </p>
                                            </div>

                                            {/* Progress simulation per CandRef */}
                                            <div className="space-y-2 mb-5">
                                                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                                    <span>Profile Match</span>
                                                    <span className="text-[#d66209]">{(Math.floor(Math.random() * 40) + 60)}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                                    <div className={cn("h-full rounded-full transition-all duration-1000",
                                                        cat.id === 'featured' ? "bg-[#EC6D0A]" :
                                                            cat.id === 'internship' ? "bg-[#FFC107]" : "bg-gray-400"
                                                    )} style={{ width: `${(Math.floor(Math.random() * 40) + 60)}%` }} />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                                    <Calendar className="h-3 w-3 opacity-40" />
                                                    {new Date(s.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                </div>
                                                <div className="flex gap-4">
                                                    <Link href={`/p/${s.username}`} target="_blank" className="text-gray-300 hover:text-[#d66209] transition-colors">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                    <span className="flex items-center gap-1 text-[10px] font-black text-gray-300 uppercase">
                                                        <Paperclip className="h-3 w-3" /> {Math.floor(Math.random() * 3)}
                                                    </span>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}

                                    {catStudents.length === 0 && (
                                        <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-200">Empty Orbit</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D1D5DB;
                }
            `}</style>
        </div>
    );
}


