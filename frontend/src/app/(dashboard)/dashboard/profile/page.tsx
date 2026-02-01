'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Card } from '@/components/ui/Card';
import {
    Edit2,
    Linkedin,
    Globe,
    Briefcase,
    MapPin,
    Building2,
    ExternalLink,
    Twitter,
    Loader2,
    Users,
    Heart,
    Eye,
    Github
} from 'lucide-react';
import { FileUpload } from '@/components/ui/FileUpload';
import { ensureProtocol } from '@/utils/urlHelpers';
import Link from 'next/link';
import { ProjectDialog } from '@/components/ProjectDialog';

interface EnterpriseProfile {
    companyName: string;
    slug: string;
    description?: string;
    industry?: string;
    website?: string;
    location?: string;
    size?: string;
    contactName?: string;
    linkedin?: string;
    twitter?: string;
    logoUrl?: string;
    bannerUrl?: string;
}

interface StudentProfile {
    firstName: string;
    lastName: string;
    username: string;
    bio?: string;
    studyYear: string;
    skills: string[];
    github?: string;
    linkedin?: string;
    portfolio?: string;
    profileImage?: string;
    bannerImage?: string;
    cvUrl?: string;
}

interface Job {
    _id: string;
    title: string;
    type: string;
    location: string;
    status: string;
    salary?: string;
    createdAt: string;
}

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

export default function ProfilePage() {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<any>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [listings, setListings] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);

    // Edit data state
    const [editData, setEditData] = useState<any>({});

    // Project Dialog State
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    const handleProjectClick = async (project: Project) => {
        // Optimistic update
        const updatedProjects = projects.map(p =>
            p._id === project._id ? { ...p, views: p.views + 1 } : p
        );
        setProjects(updatedProjects);

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
        fetchProfile();
        if (user?.role === 'STUDENT') {
            fetchProjects();
        } else if (user?.role === 'ENTERPRISE') {
            fetchListings();
        }
    }, [user?.role]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/profile/me');
            setProfile(data);
            setEditData(data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/profile/projects');
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
    };

    const fetchListings = async () => {
        try {
            const { data } = await api.get('/jobs/my-listings');
            setListings(data);
        } catch (error) {
            console.error('Failed to fetch listings:', error);
        }
    };

    const handleSave = async () => {
        try {
            const { data } = await api.put('/profile/me', editData);
            setProfile(data);
            setEditOpen(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="font-bold uppercase tracking-widest text-[10px]">Loading Profile...</p>
        </div>
    );

    const isStudent = user?.role === 'STUDENT';

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
                                    <div className="w-full h-full bg-gradient-to-br from-[#d66209] to-[#EC6D0A] flex items-center justify-center text-white text-6xl font-black">
                                        {isStudent ? `${profile?.firstName?.[0]}${profile?.lastName?.[0]}` : profile?.companyName?.[0]}
                                    </div>
                                )}
                            </div>

                            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                                {isStudent ? `${profile?.firstName} ${profile?.lastName}` : profile?.companyName}
                            </h1>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] mb-6">
                                {isStudent ? 'Digital Architect / Student' : `${profile?.industry || 'Market Leader'}`}
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                    <MapPin className="h-4 w-4 text-[#d66209] opacity-60" />
                                    {isStudent ? 'Tunisia, ME' : (profile?.location || 'HQ - Global')}
                                </div>
                                {isStudent && (
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                        <Briefcase className="h-4 w-4 text-[#d66209] opacity-60" />
                                        University of ENET'Com
                                    </div>
                                )}
                                {!isStudent && profile?.size && (
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                        <Users className="h-4 w-4 text-[#d66209] opacity-60" />
                                        {profile.size} Members
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-50">
                                {profile?.website && (
                                    <a href={ensureProtocol(profile.website)} target="_blank" className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                        <Globe className="h-5 w-5 text-gray-500" />
                                    </a>
                                )}
                                {profile?.linkedin && (
                                    <a href={ensureProtocol(profile.linkedin)} target="_blank" className="p-3 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors">
                                        <Linkedin className="h-5 w-5 text-brand-blue" />
                                    </a>
                                )}
                                {isStudent && profile?.github && (
                                    <a href={ensureProtocol(profile.github)} target="_blank" className="p-3 bg-gray-900 rounded-2xl hover:bg-black transition-colors">
                                        <Github className="h-5 w-5 text-white" />
                                    </a>
                                )}
                                {!isStudent && profile?.twitter && (
                                    <a href={ensureProtocol(profile.twitter)} target="_blank" className="p-3 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors">
                                        <Twitter className="h-5 w-5 text-[#133D6F]" />
                                    </a>
                                )}
                                {profile?.portfolio && (
                                    <a href={ensureProtocol(profile.portfolio)} target="_blank" className="p-3 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors">
                                        <Briefcase className="h-5 w-5 text-[#EC6D0A]" />
                                    </a>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 mt-8">
                                <Button
                                    onClick={() => setEditOpen(true)}
                                    className="w-full bg-gray-900 text-white rounded-2xl h-14 font-black text-lg shadow-xl shadow-gray-200"
                                >
                                    <Edit2 className="h-5 w-5 mr-2" />
                                    Edit Profile
                                </Button>
                                {(isStudent ? profile?.username : profile?.slug) && (
                                    <Button
                                        variant="outline"
                                        asChild
                                        className="w-full border-2 border-gray-200 hover:border-gray-300 rounded-2xl h-14 font-black text-lg"
                                    >
                                        <a href={`/p/${isStudent ? profile.username : profile.slug}`} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-5 w-5 mr-2" />
                                            View Public Profile
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Skills Box (Students Only) */}
                        {isStudent && (
                            <div className="bg-gray-900 rounded-2xl p-10 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
                                <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-40">Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile?.skills?.map((s: string, i: number) => (
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
                                    ? (profile?.bio || 'Dynamic student at ENET\'Com.')
                                    : (profile?.description || 'Global enterprise pushing innovation limits.')
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
                                    {isStudent ? `${projects.length} Entries` : `${listings.length} Positions`}
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
                                                <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-[#d66209] transition-colors">{p.title}</h3>
                                                <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-6">{p.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex gap-4">
                                                        <span className="flex items-center gap-1 text-[11px] font-black text-gray-300 uppercase">
                                                            <Heart className={`h-3 w-3 ${user && p.likedBy?.includes(user._id) ? 'text-red-500 fill-red-500' : ''}`} /> {p.likes || 0}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-[11px] font-black text-gray-300 uppercase">
                                                            <Eye className="h-3 w-3" /> {p.views || 0}
                                                        </span>
                                                    </div>
                                                    <span className="text-[#d66209] font-black text-sm group-hover:translate-x-1 transition-transform inline-block">View Details →</span>
                                                </div>
                                            </div>
                                        </Card>
                                    )) : (
                                        <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
                                            <p className="text-gray-300 font-black uppercase tracking-widest text-xs">No entries published yet</p>
                                        </div>
                                    )
                                ) : (
                                    listings.length > 0 ? listings.map((j) => (
                                        <Card key={j._id} className="p-10 border-none bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all group">
                                            <div className="pb-8 border-b border-gray-50 mb-8">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="bg-[#d66209]/10 text-[#d66209] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                        Active Hiring
                                                    </span>
                                                    <span className="bg-gray-50 text-gray-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100">
                                                        {j.type}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-[#d66209] transition-colors line-clamp-2">{j.title}</h3>
                                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                                                    <MapPin className="h-3 w-3" /> {j.location}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-black text-gray-900">{j.salary || 'Competitive Pay'}</p>
                                                <Button size="sm" asChild className="bg-gray-900 text-white rounded-xl font-bold px-6">
                                                    <Link href={`/dashboard/listings`}>Manage →</Link>
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

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 mt-6">
                        {/* Image Uploads */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FileUpload
                                endpoint={isStudent ? "/upload/profile-image" : "/upload/logo"}
                                label={isStudent ? "Profile Photo" : "Company Logo"}
                                accept="image/*"
                                currentUrl={isStudent ? editData.profileImage : editData.logoUrl}
                                onUploadComplete={(url) => setEditData({ ...editData, [isStudent ? 'profileImage' : 'logoUrl']: url })}
                            />
                            <FileUpload
                                endpoint="/upload/banner"
                                label="Banner Image"
                                accept="image/*"
                                currentUrl={isStudent ? editData.bannerImage : editData.bannerUrl}
                                onUploadComplete={(url) => setEditData({ ...editData, [isStudent ? 'bannerImage' : 'bannerUrl']: url })}
                            />
                        </div>

                        {/* Text Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isStudent ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">First Name</label>
                                        <Input value={editData.firstName || ''} onChange={e => setEditData({ ...editData, firstName: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Last Name</label>
                                        <Input value={editData.lastName || ''} onChange={e => setEditData({ ...editData, lastName: e.target.value })} />
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-2 col-span-full">
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Company Name</label>
                                    <Input value={editData.companyName || ''} onChange={e => setEditData({ ...editData, companyName: e.target.value })} />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Bio</label>
                            <textarea
                                value={(isStudent ? editData.bio : editData.description) || ''}
                                onChange={e => setEditData({ ...editData, [isStudent ? 'bio' : 'description']: e.target.value })}
                                className="w-full min-h-[120px] px-4 py-3 border border-gray-200 rounded-2xl resize-none font-medium text-gray-700 focus:border-gray-400 focus:outline-none transition-colors"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Website</label>
                                <Input value={editData.website || ''} onChange={e => setEditData({ ...editData, website: e.target.value })} placeholder="https://example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Portfolio</label>
                                <Input value={editData.portfolio || ''} onChange={e => setEditData({ ...editData, portfolio: e.target.value })} placeholder="https://portfolio.com" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">LinkedIn</label>
                                <Input value={editData.linkedin || ''} onChange={e => setEditData({ ...editData, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{isStudent ? 'GitHub' : 'Twitter'}</label>
                                <Input value={(isStudent ? editData.github : editData.twitter) || ''} onChange={e => setEditData({ ...editData, [isStudent ? 'github' : 'twitter']: e.target.value })} placeholder={isStudent ? 'https://github.com/username' : 'https://twitter.com/username'} />
                            </div>
                        </div>

                        <DialogFooter className="pt-6">
                            <Button variant="ghost" onClick={() => setEditOpen(false)} className="rounded-full px-6">Cancel</Button>
                            <Button onClick={handleSave} className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 font-semibold">Save Changes</Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
            {/* Project Dialog */}
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


