'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    XCircle,
    CheckCircle,
    Briefcase,
    Globe,
    Clock,
    DollarSign,
    MoreVertical,
    AlertCircle,
    ChevronRight,
    Loader2,
    User,
    FileText,
    Mail,
    ExternalLink,
    Filter
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { SkillsInput } from '@/components/ui/SkillsInput';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(
    () => import('@uiw/react-md-editor'),
    { ssr: false }
);

interface Application {
    _id: string;
    studentId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        profileImage?: string;
        bio?: string;
        cvUrl?: string;
    };
    status: 'pending' | 'reviewed' | 'interviewing' | 'accepted' | 'rejected';
    appliedAt: string;
}

interface Job {
    _id: string;
    title: string;
    description: string;
    type: 'internship' | 'pfe';
    location: string;
    remote: boolean;
    requirements: string[];
    status: 'open' | 'closed' | 'filled' | 'pending' | 'rejected';
    salary?: string;
    createdAt: string;
}

export default function ListingsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Partial<Job>>({
        title: '',
        description: '',
        type: 'internship',
        location: '',
        remote: false,
        requirements: [],
        status: 'open',
        salary: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    // Application Management
    const [applications, setApplications] = useState<Application[]>([]);
    const [loadingApps, setLoadingApps] = useState(false);
    const [detailTab, setDetailTab] = useState<'overview' | 'applicants'>('overview');

    useEffect(() => {
        if (selectedJobId) {
            fetchApplications(selectedJobId);
        }
    }, [selectedJobId]);

    const fetchApplications = async (jobId: string) => {
        setLoadingApps(true);
        try {
            const { data } = await api.get(`/jobs/${jobId}/applications`);
            setApplications(data);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoadingApps(false);
        }
    };

    const handleUpdateAppStatus = async (appId: string, newStatus: string) => {
        try {
            const { data } = await api.patch(`/jobs/${selectedJobId}/applications/${appId}`, { status: newStatus });
            setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: data.status } : a));
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    useEffect(() => {
        fetchMyListings();
    }, []);

    const fetchMyListings = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/jobs/my-listings');
            setJobs(data);
            if (data.length > 0 && !selectedJobId) {
                setSelectedJobId(data[0]._id);
            }
        } catch (error) {
            console.error('Failed to fetch listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = (job?: Job) => {
        if (job) {
            setFormData(job);
            setIsEditing(true);
        } else {
            setFormData({
                title: '',
                description: '**Role Overview**\n\n**Requirements**\n* ',
                type: 'internship',
                location: '',
                remote: false,
                requirements: [],
                status: 'open',
                salary: ''
            });
            setIsEditing(false);
        }
        setIsFormOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEditing && formData._id) {
                await api.patch(`/jobs/${formData._id}`, formData);
            } else {
                await api.post('/jobs', formData);
            }
            await fetchMyListings();
            setIsFormOpen(false);
        } catch (error) {
            console.error('Failed to save job:', error);
            alert('Failed to save listing. Please check all fields.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (jobId: string) => {
        if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
        try {
            await api.delete(`/jobs/${jobId}`);
            setJobs(prev => prev.filter(j => j._id !== jobId));
            if (selectedJobId === jobId) setSelectedJobId(null);
        } catch (error) {
            console.error('Failed to delete job:', error);
        }
    };

    const handleToggleStatus = async (job: Job) => {
        const newStatus = job.status === 'open' ? 'closed' : 'open';
        try {
            await api.patch(`/jobs/${job._id}`, { status: newStatus });
            setJobs(prev => prev.map(j => j._id === job._id ? { ...j, status: newStatus } : j));
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const selectedJob = jobs.find(j => j._id === selectedJobId) || jobs[0];

    return (
        <div className="flex flex-col h-[calc(100vh-32px)] bg-gray-50/50 rounded-2xl overflow-hidden border border-white shadow-sm">
            {/* Header */}
            <header className="px-8 py-6 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Listings</h1>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Manage your opportunities</p>
                </div>
                <Button
                    onClick={() => handleOpenForm()}
                    className="bg-[#d66209] hover:bg-[#15803d] text-white rounded-2xl px-6 font-bold shadow-lg shadow-orange-100 flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Create New Listing
                </Button>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[400px_1fr] overflow-hidden">
                {/* Left: List */}
                <aside className="border-r border-gray-100 bg-white/50 overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <Loader2 className="h-8 w-8 animate-spin mb-4" />
                            <p className="font-bold">Syncing listings...</p>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <Briefcase className="h-12 w-12 text-gray-200 mb-4" />
                            <p className="text-gray-400 font-bold">No listings yet</p>
                            <Button variant="ghost" className="mt-2 text-[#d66209]" onClick={() => handleOpenForm()}>Create your first one</Button>
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <div
                                key={job._id}
                                onClick={() => setSelectedJobId(job._id)}
                                className={cn(
                                    "p-5 rounded-2xl border transition-all duration-300 cursor-pointer group relative bg-white",
                                    selectedJobId === job._id
                                        ? "border-[#d66209] shadow-[0_10px_25px_-5px_rgba(236,109,10,0.1)] -translate-y-1"
                                        : "border-gray-100 hover:border-gray-200 hover:shadow-md"
                                )}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className={cn(
                                        "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                        job.status === 'open' ? "bg-green-50 border-green-100 text-green-600" :
                                            job.status === 'pending' ? "bg-orange-50 border-orange-100 text-orange-600" :
                                                job.status === 'rejected' ? "bg-red-50 border-red-100 text-red-600" :
                                                    "bg-gray-50 border-gray-200 text-gray-400"
                                    )}>
                                        {job.status}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="font-extrabold text-gray-900 group-hover:text-[#d66209] transition-colors line-clamp-1">{job.title}</h3>
                                <p className="text-xs text-gray-500 font-medium mt-1 mb-4 flex items-center gap-2">
                                    <Globe className="h-3 w-3" />
                                    {job.location} {job.remote && '• Remote'}
                                </p>
                                <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-tighter">
                                    <span>{job.type}</span>
                                    <span>•</span>
                                    <span>{job.salary || 'Competitive'}</span>
                                </div>
                            </div>
                        ))
                    )}
                </aside>

                {/* Right: Details */}
                <main className="bg-white overflow-y-auto p-10">
                    {selectedJob ? (
                        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-start mb-10 pb-8 border-b border-gray-50">
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={cn(
                                            "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border shadow-sm",
                                            selectedJob.status === 'open' ? "bg-green-50 border-green-100 text-green-600" :
                                                selectedJob.status === 'pending' ? "bg-orange-50 border-orange-100 text-orange-600" :
                                                    selectedJob.status === 'rejected' ? "bg-red-50 border-red-100 text-red-600" :
                                                        "bg-gray-50 border-gray-200 text-gray-400"
                                        )}>
                                            Status: {selectedJob.status}
                                        </div>
                                        <div className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-50 bg-blue-50/50 text-brand-blue">
                                            {selectedJob.type}
                                        </div>
                                    </div>
                                    <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">{selectedJob.title}</h2>
                                    <div className="flex flex-wrap gap-4 mt-6">
                                        <div className="flex items-center gap-2 text-gray-500 font-bold text-sm bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                                            <Globe className="h-4 w-4" />
                                            {selectedJob.location} {selectedJob.remote && '(Remote)'}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 font-bold text-sm bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                                            <DollarSign className="h-4 w-4" />
                                            {selectedJob.salary || 'Competitive'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Button
                                        onClick={() => handleOpenForm(selectedJob)}
                                        className="bg-white border-2 border-[#d66209] text-[#d66209] hover:bg-orange-50 rounded-2xl px-6 font-bold flex items-center gap-2 h-12"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Edit Details
                                    </Button>
                                    <Button
                                        onClick={() => handleToggleStatus(selectedJob)}
                                        variant="ghost"
                                        className={cn(
                                            "rounded-2xl px-6 font-bold flex items-center gap-2 h-12 border-2",
                                            selectedJob.status === 'open'
                                                ? "border-red-100 text-red-500 hover:bg-red-50"
                                                : "border-orange-100 text-orange-500 hover:bg-orange-50"
                                        )}
                                    >
                                        {selectedJob.status === 'open' ? (
                                            <><XCircle className="h-4 w-4" /> Close Listing</>
                                        ) : (
                                            <><CheckCircle className="h-4 w-4" /> Reopen Listing</>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(selectedJob._id)}
                                        variant="ghost"
                                        className="text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* TABS */}
                            <div className="flex items-center gap-6 border-b border-gray-100 mb-8">
                                <button
                                    onClick={() => setDetailTab('overview')}
                                    className={cn("pb-4 text-sm font-bold border-b-2 transition-colors", detailTab === 'overview' ? "border-[#d66209] text-[#d66209]" : "border-transparent text-gray-400 hover:text-gray-600")}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setDetailTab('applicants')}
                                    className={cn("pb-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", detailTab === 'applicants' ? "border-[#d66209] text-[#d66209]" : "border-transparent text-gray-400 hover:text-gray-600")}
                                >
                                    Applicants
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">{applications.length}</span>
                                </button>
                            </div>

                            {detailTab === 'overview' ? (
                                <div className="prose prose-lg max-w-none animate-in fade-in duration-300">
                                    <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Requirement & Description</h3>

                                    {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-8 animate-in fade-in duration-700">
                                            {selectedJob.requirements.map((req, i) => (
                                                <span key={i} className="px-5 py-2 rounded-2xl bg-white border-2 border-[#d66209]/20 text-[#d66209] text-[13px] font-black shadow-sm">
                                                    {req}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100">
                                        <ReactMarkdown
                                            components={{
                                                h1: ({ node, ...props }) => <h1 className="text-2xl font-black mt-8 mb-4 tracking-tight" {...props} />,
                                                h2: ({ node, ...props }) => <h2 className="text-xl font-black mt-6 mb-3 tracking-tight text-gray-800" {...props} />,
                                                p: ({ node, ...props }) => <p className="text-[16px] text-gray-600 leading-relaxed mb-4 font-medium" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 mt-2 space-y-3" {...props} />,
                                                li: ({ node, ...props }) => <li className="text-gray-600 font-medium" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="font-black text-gray-900" {...props} />,
                                                code: ({ node, ...props }) => <code className="bg-gray-100 px-2 py-0.5 rounded font-bold text-[#d66209]" {...props} />,
                                            }}
                                        >
                                            {selectedJob.description}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    {loadingApps ? (
                                        <div className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-300" /></div>
                                    ) : applications.length === 0 ? (
                                        <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                                            <p className="text-gray-400 font-bold">No applications yet.</p>
                                        </div>
                                    ) : (
                                        applications.map((app) => (
                                            <div key={app._id} className="bg-white border hover:border-blue-200 transition-all p-6 rounded-2xl group flex flex-col gap-4 shadow-sm hover:shadow-md">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden shrink-0">
                                                            {app.studentId?.profileImage ? (
                                                                <img src={app.studentId.profileImage} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400"><User className="h-6 w-6" /></div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h4 className="font-bold text-gray-900 truncate">{app.studentId?.firstName} {app.studentId?.lastName}</h4>
                                                            <a href={`mailto:${app.studentId?.email}`} className="text-xs text-gray-500 hover:text-[#d66209] flex items-center gap-1">
                                                                <Mail className="h-3 w-3" /> {app.studentId?.email}
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(app.appliedAt).toLocaleDateString()}</span>
                                                        {app.studentId?.cvUrl && (
                                                            <a href={app.studentId.cvUrl} target="_blank" className="block mt-1 text-xs font-bold text-blue-600 hover:underline flex items-center justify-end gap-1">
                                                                <FileText className="h-3 w-3" /> View CV
                                                            </a>
                                                        )}
                                                        <a href={`/p/${app.studentId?.firstName}`} target="_blank" className="block mt-1 text-xs font-bold text-gray-400 hover:text-[#d66209] flex items-center justify-end gap-1">
                                                            <ExternalLink className="h-3 w-3" /> Profile
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-gray-50">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Application Status</p>
                                                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                                                        {[
                                                            { id: 'pending', label: 'Applied' },
                                                            { id: 'reviewed', label: 'Review' },
                                                            { id: 'interviewing', label: 'Interview' },
                                                            { id: 'accepted', label: 'Offer' },
                                                            { id: 'rejected', label: 'Rejected' },
                                                        ].map((status) => (
                                                            <button
                                                                key={status.id}
                                                                onClick={() => handleUpdateAppStatus(app._id, status.id)}
                                                                className={cn(
                                                                    "px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap",
                                                                    app.status === status.id
                                                                        ? (status.id === 'rejected' ? "bg-red-50 border-red-200 text-red-600" : (status.id === 'accepted' ? "bg-blue-50 border-blue-200 text-[#133D6F]" : "bg-[#EC6D0A] border-[#EC6D0A] text-white"))
                                                                        : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                                                                )}
                                                            >
                                                                {status.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-300">
                            <Briefcase className="h-20 w-20 mb-6 opacity-20" />
                            <p className="text-xl font-bold">Select a listing to view details</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Create/Edit Sheet (Modal) */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-10 rounded-2xl border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tight mb-8">
                            {isEditing ? 'Edit Listing' : 'Create New Opportunity'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2 col-span-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Job Title</label>
                                <Input
                                    placeholder="e.g. Senior Frontend Developer (Next.js)"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="h-14 rounded-2xl border-gray-100 focus:ring-[#d66209] text-lg font-bold"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Location</label>
                                <Input
                                    placeholder="City, Country"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="h-14 rounded-2xl border-gray-100 font-bold"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Salary Range (Optional)</label>
                                <Input
                                    placeholder="e.g. $2,000 - $4,000 / mo"
                                    value={formData.salary}
                                    onChange={e => setFormData({ ...formData, salary: e.target.value })}
                                    className="h-14 rounded-2xl border-gray-100 font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Type</label>
                                <select
                                    className="w-full h-14 rounded-2xl border border-gray-100 bg-white px-4 font-bold outline-none focus:ring-2 focus:ring-[#d66209]/20"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                >
                                    <option value="internship">Internship</option>
                                    <option value="pfe">PFE</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 pt-6">
                                <input
                                    type="checkbox"
                                    id="remote"
                                    checked={formData.remote}
                                    onChange={e => setFormData({ ...formData, remote: e.target.checked })}
                                    className="w-6 h-6 rounded-lg text-[#d66209] focus:ring-[#d66209]"
                                />
                                <label htmlFor="remote" className="font-bold text-gray-700">Available for Remote</label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Key Requirements / Tech Stack</label>
                            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                <SkillsInput
                                    skills={formData.requirements || []}
                                    onChange={skills => setFormData({ ...formData, requirements: skills })}
                                />
                                <p className="text-[10px] text-gray-400 font-bold mt-4 uppercase tracking-widest">Added {formData.requirements?.length || 0} requirements</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Job Description (Markdown)</label>
                            <div data-color-mode="light">
                                <MDEditor
                                    value={formData.description}
                                    onChange={val => setFormData({ ...formData, description: val || '' })}
                                    preview="edit"
                                    height={300}
                                    className="rounded-2xl overflow-hidden border-gray-100"
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsFormOpen(false)}
                                className="rounded-2xl px-8 font-bold text-gray-400 hover:text-gray-600 h-14"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="bg-[#d66209] hover:bg-[#15803d] text-white rounded-2xl px-12 font-bold shadow-lg shadow-orange-100 h-14"
                            >
                                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : (isEditing ? 'Update Listing' : 'Publish Listing')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <style jsx global>{`
                .wmde-markdown-var { --color-accent-fg: #d66209; }
                .w-md-editor { border-radius: 20px !important; box-shadow: none !important; }
            `}</style>
        </div>
    );
}


