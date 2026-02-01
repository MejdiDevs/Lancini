'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
    Github,
    Linkedin,
    Globe,
    Heart,
    Eye,
    FileText,
    Briefcase,
    MapPin,
    Building2,
    Twitter,
    Clock,
    Zap,
    Users
} from 'lucide-react';
import { ensureProtocol } from '@/utils/urlHelpers';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ProjectDialog } from '@/components/ProjectDialog';
import { useAuthStore } from '@/store/authStore';

interface Project {
    _id: string;
    title: string;
    description: string;
    imageUrl?: string;
    tags: string[];
    link?: string;
    likes: number;
    likedBy: string[];
    views: number;
}

interface Job {
    _id: string;
    title: string;
    description: string;
    type: string;
    location: string;
    remote: boolean;
    salary?: string;
}

export default function PublicProfilePage() {
    const params = useParams();
    const username = params.username as string;

    const [profile, setProfile] = useState<any>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('work');
    const [error, setError] = useState<string | null>(null);

    // Dialog & Interaction State
    const { user } = useAuthStore();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    const handleProjectClick = async (project: Project) => {
        // Optimistic view increment
        const updatedProjects = projects.map(p =>
            p._id === project._id ? { ...p, views: p.views + 1 } : p
        );
        setProjects(updatedProjects);

        // Find updated project reference
        const pToShow = updatedProjects.find(p => p._id === project._id);
        setSelectedProject(pToShow || project);
        setDialogOpen(true);

        try {
            await api.post(`/profile/public/projects/${project._id}/view`);
        } catch (e) {
            console.error('Failed to increment view', e);
        }
    };

    const handleLike = async (id: string) => {
        if (!user) {
            // Ideally trigger login modal or redirect, simplified for now
            return;
        }
        setLikeLoading(true);
        try {
            const { data } = await api.post(`/profile/projects/${id}/like`);
            setProjects(prev => prev.map(p => p._id === id ? data : p));
            if (selectedProject?._id === id) {
                setSelectedProject(data);
            }
        } catch (e) {
            console.error('Failed to like project', e);
        } finally {
            setLikeLoading(false);
        }
    };

    useEffect(() => {
        if (username) {
            fetchProfile();
        }
    }, [username]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/profile/public/${username}`);
            setProfile(data);

            if (data.role === 'STUDENT') {
                fetchProjects(data.userId);
            } else if (data.role === 'ENTERPRISE') {
                fetchJobs(data.userId);
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            setError('Profile not found');
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async (userId: string) => {
        try {
            const { data } = await api.get(`/profile/public/projects/${userId}`);
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
    };

    const fetchJobs = async (enterpriseId: string) => {
        try {
            const { data } = await api.get(`/jobs/enterprise/${enterpriseId}`);
            setJobs(data);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#EC6D0A] rounded-full animate-spin mb-4" />
            <p className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Loading Profile...</p>
        </div>
    );

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
                <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-lg">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Endpoint Lost</h1>
                    <p className="text-gray-500 font-bold mb-8">The profile @{username} hasn't been broadcasted to our network yet.</p>
                    <Button asChild className="bg-gray-900 text-white rounded-2xl px-8 font-bold">
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const isStudent = profile.role === 'STUDENT';

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Banner */}
            <div className="w-full h-80 relative overflow-hidden">
                {(isStudent ? profile?.bannerImage : profile?.bannerUrl) ? (
                    <img
                        src={isStudent ? profile.bannerImage : profile.bannerUrl}
                        alt="Banner"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 via-emerald-50 to-[#F0FDFA]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50/80 to-transparent" />
            </div>

            <div className="container mx-auto max-w-7xl px-4 relative -mt-40">
                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10">

                    {/* Left Sidebar: Identity */}
                    <div className="space-y-8">
                        {/* Identity Card */}
                        <div className="bg-white rounded-2xl p-10 shadow-2xl border border-white">
                            <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-xl mb-8 -mt-24 ring-8 ring-white bg-white mx-auto lg:mx-0">
                                {(isStudent ? profile?.profileImage : profile?.logoUrl) ? (
                                    <img
                                        src={isStudent ? profile.profileImage : profile.logoUrl}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#EC6D0A] to-[#d66209] flex items-center justify-center text-white text-6xl font-black">
                                        {isStudent ? (profile.firstName?.[0] || 'U') : (profile.companyName?.[0] || 'C')}
                                    </div>
                                )}
                            </div>

                            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                                {isStudent ? `${profile.firstName} ${profile.lastName}` : profile.companyName}
                            </h1>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] mb-6">
                                {isStudent ? 'Digital Architect / Student' : `${profile.industry || 'Market Leader'}`}
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                    <MapPin className="h-4 w-4 text-[#EC6D0A] opacity-60" />
                                    {isStudent ? 'Tunisia, ME' : (profile.location || 'HQ - Global')}
                                </div>
                                {isStudent && (
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                        <Briefcase className="h-4 w-4 text-[#EC6D0A] opacity-60" />
                                        University of ENET'Com
                                    </div>
                                )}
                                {!isStudent && profile.size && (
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                        <Users className="h-4 w-4 text-[#EC6D0A] opacity-60" />
                                        {profile.size} Members
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-50">
                                {profile.website && (
                                    <a href={ensureProtocol(profile.website)} target="_blank" className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                        <Globe className="h-5 w-5 text-gray-500" />
                                    </a>
                                )}
                                {profile.linkedin && (
                                    <a href={ensureProtocol(profile.linkedin)} target="_blank" className="p-3 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors">
                                        <Linkedin className="h-5 w-5 text-blue-600" />
                                    </a>
                                )}
                                {isStudent && profile.github && (
                                    <a href={ensureProtocol(profile.github)} target="_blank" className="p-3 bg-gray-900 rounded-2xl hover:bg-black transition-colors">
                                        <Github className="h-5 w-5 text-white" />
                                    </a>
                                )}
                                {!isStudent && profile.twitter && (
                                    <a href={ensureProtocol(profile.twitter)} target="_blank" className="p-3 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors">
                                        <Twitter className="h-5 w-5 text-[#133D6F]" />
                                    </a>
                                )}
                                {profile.portfolio && (
                                    <a href={ensureProtocol(profile.portfolio)} target="_blank" className="p-3 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors">
                                        <Briefcase className="h-5 w-5 text-[#EC6D0A]" />
                                    </a>
                                )}
                            </div>

                            {isStudent && profile.cvUrl && (
                                <Button asChild className="w-full mt-8 bg-gray-900 text-white rounded-2xl h-14 font-black text-lg shadow-xl shadow-gray-200">
                                    <a href={profile.cvUrl} target="_blank">View CV</a>
                                </Button>
                            )}
                        </div>

                        {/* Skills Box (Students Only) */}
                        {isStudent && (
                            <div className="bg-gray-900 rounded-2xl p-10 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
                                <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-40">Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills?.map((s: string, i: number) => (
                                        <span key={i} className="px-6 py-2 bg-white/10 rounded-2xl text-xs font-black">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Main Content */}
                    <div className="space-y-10">
                        {/* Summary / About */}
                        <div className="bg-white rounded-2xl p-12 border border-white shadow-sm">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">About</h2>
                            <p className="text-xl text-gray-600 font-medium leading-relaxed">
                                {isStudent
                                    ? (profile.bio || 'Dynamic student at ENET\'Com.')
                                    : (profile.description || 'Global enterprise pushing innovation limits.')
                                }
                            </p>
                        </div>

                        {/* Dynamic Grid: Projects or Jobs */}
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                    {isStudent ? 'Selected Works' : 'Active Pipeline'}
                                </h2>
                                <div className="flex-1 h-px bg-gray-100" />
                                <span className="bg-gray-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    {isStudent ? `${projects.length} Entries` : `${jobs.length} Positions`}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {isStudent ? (
                                    projects.length > 0 ? projects.map((p) => (
                                        <Card
                                            key={p._id}
                                            onClick={() => handleProjectClick(p)}
                                            className="p-0 border-none bg-white rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-700 cursor-pointer"
                                        >
                                            <div className="h-64 bg-gray-50 overflow-hidden relative">
                                                {p.imageUrl ? (
                                                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Globe className="h-16 w-16 text-gray-100" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="p-8">
                                                <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-[#EC6D0A] transition-colors">{p.title}</h3>
                                                <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-6">{p.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex gap-4">
                                                        <span className="flex items-center gap-1 text-[11px] font-black text-gray-300 uppercase">
                                                            <Heart className={`h-3 w-3 ${user && p.likedBy?.includes(user._id) ? 'text-red-500 fill-red-500' : ''}`} /> {p.likes}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-[11px] font-black text-gray-300 uppercase">
                                                            <Eye className="h-3 w-3" /> {p.views}
                                                        </span>
                                                    </div>
                                                    <span className="text-[#EC6D0A] font-black text-sm group-hover:translate-x-1 transition-transform inline-block">View Details →</span>
                                                </div>
                                            </div>
                                        </Card>
                                    )) : (
                                        <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
                                            <p className="text-gray-300 font-black uppercase tracking-widest text-xs">No entries published yet</p>
                                        </div>
                                    )
                                ) : (
                                    jobs.length > 0 ? jobs.map((j) => (
                                        <Card key={j._id} className="p-10 border-none bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all group">
                                            <div className="pb-8 border-b border-gray-50 mb-8">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="bg-[#EC6D0A]/10 text-[#EC6D0A] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                        Active Hiring
                                                    </span>
                                                    <span className="bg-gray-50 text-gray-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100">
                                                        {j.type}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-[#EC6D0A] transition-colors line-clamp-2">{j.title}</h3>
                                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                                                    <MapPin className="h-3 w-3" /> {j.location}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-black text-gray-900">{j.salary || 'Competitive Pay'}</p>
                                                <Button size="sm" asChild className="bg-gray-900 text-white rounded-xl font-bold px-6">
                                                    <Link href={`/jobs/${j._id}`}>Apply →</Link>
                                                </Button>
                                            </div>
                                        </Card>
                                    )) : (
                                        <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
                                            <p className="text-gray-300 font-black uppercase tracking-widest text-xs">All positions are currently filled</p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProjectDialog
                project={selectedProject}
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onLike={handleLike}
                isLiked={selectedProject && user ? selectedProject.likedBy?.includes(user._id) : false}
                loadingLike={likeLoading}
            />
        </div>
    );
}

function XCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
        </svg>
    )
}
