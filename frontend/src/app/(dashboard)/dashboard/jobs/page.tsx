'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import {
    Briefcase, CheckCircle, Globe, Bookmark, Bot, Search, Zap, ExternalLink, Clock, DollarSign
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/Dialog';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ApplicationWizard, ApplicationData } from '@/components/ApplicationWizard';

// Extended Job interface
interface Job {
    _id: string;
    title: string;
    description: string;
    type: 'internship' | 'pfe' | 'full-time' | 'part-time';
    location: string;
    remote: boolean;
    requirements: string[];
    enterpriseId: {
        companyName: string;
        logoUrl?: string;
        location?: string;
    };
    salary?: string;
    tags?: string[];
    status?: 'applied' | 'review' | 'interview' | 'rejected' | 'offer';
    appliedDate?: string;
    createdAt: string;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [savedJobs, setSavedJobs] = useState<Job[]>([]);
    const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
    const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
    const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'new' | 'saved' | 'applied'>('new');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [jobForDialog, setJobForDialog] = useState<Job | null>(null);
    const [isApplicationWizardOpen, setIsApplicationWizardOpen] = useState(false);
    const [jobForApplication, setJobForApplication] = useState<Job | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await Promise.all([fetchJobs(), fetchSavedJobs(), fetchAppliedJobs()]);
            setLoading(false);
        };
        load();
    }, []);

    const fetchJobs = async () => {
        try {
            const { data } = await api.get('/jobs');
            const enrichedJobs = enrichJobs(data);
            setJobs(enrichedJobs);
            if (enrichedJobs.length > 0 && !selectedJobId) {
                setSelectedJobId(enrichedJobs[0]._id);
            }
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        }
    };

    const fetchSavedJobs = async () => {
        try {
            const { data } = await api.get('/jobs/saved/list');
            const enriched = enrichJobs(data);
            setSavedJobs(enriched);
            setSavedJobIds(new Set(enriched.map(j => j._id)));
        } catch (error) {
            console.error('Failed to fetch saved jobs:', error);
        }
    };

    const fetchAppliedJobs = async () => {
        try {
            const { data } = await api.get('/jobs/applied/list');
            const enriched = enrichJobs(data);
            setAppliedJobs(enriched);
            setAppliedJobIds(new Set(enriched.map(j => j._id)));
        } catch (error) {
            console.error('Failed to fetch applied jobs:', error);
        }
    };

    const enrichJobs = (data: any[]): Job[] => {
        const logoFallbacks = [
            '/logos/logo1.png',
            '/logos/logo2.png',
            '/logos/logo3.png'
        ];

        return data.map((job: any, index: number) => {
            const enterprise = job.enterpriseId || { companyName: 'Unknown Company' };
            return {
                ...job,
                enterpriseId: {
                    ...enterprise,
                    logoUrl: enterprise.logoUrl || logoFallbacks[index % logoFallbacks.length]
                },
                salary: job.salary || '$1k - $3k/mo',
                tags: job.tags || [job.remote ? 'Remote' : 'On-site', job.type === 'pfe' ? 'PFE' : 'Internship'],
                appliedDate: job.appliedAt || new Date().toISOString()
            };
        });
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, companyName: string) => {
        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=random&color=fff&size=128`;
    };

    const handleToggleSave = async (e: React.MouseEvent, jobId: string) => {
        e.stopPropagation();
        try {
            // Optimistic update
            const isSaved = savedJobIds.has(jobId);
            const newSet = new Set(savedJobIds);
            if (isSaved) {
                newSet.delete(jobId);
                setSavedJobs(prev => prev.filter(j => j._id !== jobId));
            } else {
                newSet.add(jobId);
                const jobToAdd = jobs.find(j => j._id === jobId) || appliedJobs.find(j => j._id === jobId);
                if (jobToAdd) setSavedJobs(prev => [...prev, jobToAdd]);
            }
            setSavedJobIds(newSet);

            await api.post(`/jobs/${jobId}/save`);
        } catch (err) {
            console.error("Failed to toggle save", err);
        }
    };

    const handleApply = async (applicationData: ApplicationData) => {
        if (!jobForApplication) return;

        try {
            if (appliedJobIds.has(jobForApplication._id)) return;

            // Submit application with form data
            await api.post(`/jobs/${jobForApplication._id}/apply`, applicationData);

            // Update state
            const newAppliedIds = new Set(appliedJobIds);
            newAppliedIds.add(jobForApplication._id);
            setAppliedJobIds(newAppliedIds);

            const appliedJob = jobs.find(j => j._id === jobForApplication._id) || savedJobs.find(j => j._id === jobForApplication._id);
            if (appliedJob) {
                setAppliedJobs(prev => [appliedJob, ...prev]);
            }
        } catch (error: any) {
            console.error('Application failed:', error);
            throw error; // Let the wizard handle the error
        }
    };

    const openApplicationWizard = (job: Job) => {
        setJobForApplication(job);
        setIsApplicationWizardOpen(true);
    };

    const openDetailsDialog = (e: React.MouseEvent, job: Job) => {
        e.stopPropagation();
        setJobForDialog(job);
        setIsDialogOpen(true);
    };

    const displayedJobs = activeTab === 'saved' ? savedJobs :
        activeTab === 'applied' ? appliedJobs :
            jobs.filter(job => !appliedJobIds.has(job._id));

    const selectedJob = (activeTab === 'saved'
        ? savedJobs.find(j => j._id === selectedJobId)
        : activeTab === 'applied'
            ? appliedJobs.find(j => j._id === selectedJobId)
            : jobs.find(j => j._id === selectedJobId))
        || displayedJobs[0];

    const renderJobDetails = (job: Job) => (
        <div className="job-details-panel animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border flex items-center justify-center overflow-hidden shadow-sm">
                        {job.enterpriseId.logoUrl ? (
                            <img
                                src={job.enterpriseId.logoUrl}
                                alt="Logo"
                                className="w-full h-full object-contain p-2"
                                onError={(e) => handleImageError(e, job.enterpriseId.companyName)}
                            />
                        ) : (
                            <Briefcase className="h-8 w-8 text-gray-400" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">{job.title}</h2>
                        <p className="text-base text-gray-500 font-medium mt-1">{job.enterpriseId.companyName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => handleToggleSave(e, job._id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 border rounded-xl font-semibold transition-all",
                            savedJobIds.has(job._id) ? "bg-yellow-50 border-yellow-200 text-yellow-600" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        )}
                    >
                        <Bookmark className={cn("h-4 w-4", savedJobIds.has(job._id) && "fill-current")} />
                        {savedJobIds.has(job._id) ? 'Saved' : 'Save'}
                    </button>
                    <span className="bg-[#EC6D0A] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm shadow-[#EC6D0A]/20">
                        Hiring
                    </span>
                </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#F3E8FF] text-[#8B5CF6] px-4 py-2 rounded-full text-[13px] font-bold mb-6 float-right">
                <Zap className="h-4 w-4 fill-current" />
                92% Match with your profile
            </div>

            <div className="flex flex-wrap gap-3 mb-8 clear-both">
                <span className="px-4 py-2 rounded-xl text-[13px] font-bold bg-gray-50 border border-gray-100 text-gray-600 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    {job.remote ? 'Remote' : job.location}
                </span>
                <span className="px-4 py-2 rounded-xl text-[13px] font-bold bg-gray-50 border border-gray-100 text-gray-600 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    Full-time
                </span>
                <span className="px-4 py-2 rounded-xl text-[13px] font-bold bg-gray-50 border border-gray-100 text-gray-600 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    {job.salary || '$2k - $5k'}
                </span>
            </div>

            {appliedJobIds.has(job._id) && (
                <div className="mb-8 p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#EC6D0A]" />
                        Application Timeline
                    </h4>
                    {(() => {
                        const steps = [
                            { id: 'applied', label: 'Applied' },
                            { id: 'review', label: 'Review' },
                            { id: 'interview', label: 'Interview' },
                            { id: 'decision', label: 'Decision' }
                        ];
                        const statusMap: Record<string, number> = {
                            'applied': 0, 'pending': 0,
                            'review': 1, 'reviewed': 1,
                            'interview': 2, 'interviewing': 2,
                            'offer': 3, 'accepted': 3,
                            'rejected': 3
                        };
                        const currentStep = statusMap[job.status || 'applied'] || 0;
                        const isRejected = job.status === 'rejected';

                        return (
                            <div className="relative mx-2">
                                <div className="absolute top-3 left-0 w-full h-1 bg-gray-200 rounded-full" />
                                <div
                                    className={cn("absolute top-3 left-0 h-1 rounded-full transition-all duration-1000", isRejected ? "bg-red-500" : "bg-[#EC6D0A]")}
                                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                                />
                                <div className="relative flex justify-between">
                                    {steps.map((step, idx) => {
                                        const isCompleted = idx < currentStep;
                                        const isActive = idx === currentStep;

                                        return (
                                            <div key={step.id} className="flex flex-col items-center gap-2">
                                                <div className={cn(
                                                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-4 transition-all z-10 bg-white",
                                                    isActive
                                                        ? (isRejected && idx === 3 ? "border-red-500 text-red-500" : "border-[#EC6D0A] text-[#EC6D0A]")
                                                        : isCompleted
                                                            ? "bg-[#133D6F] border-[#133D6F] text-white"
                                                            : "border-gray-200 text-gray-300"
                                                )}>
                                                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : (isActive && isRejected && idx === 3 ? "✕" : (idx + 1))}
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase tracking-wider",
                                                    isActive
                                                        ? (isRejected && idx === 3 ? "text-red-500" : "text-[#EC6D0A]")
                                                        : isCompleted ? "text-[#133D6F]" : "text-gray-400"
                                                )}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            <div className="space-y-6">
                <div className="details-section">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">About the role</h3>
                    <div className="text-[15px] text-gray-600 leading-relaxed">
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-4 mb-2" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                            }}
                        >
                            {job.description}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 pt-8 mt-4 border-t sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
                <Button asChild className="flex-1 bg-[#133D6F] hover:bg-[#112b4d] text-white rounded-xl h-12 px-6 font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
                    <Link href={`/dashboard/interview/${job._id}`} target="_blank">
                        <Bot className="h-5 w-5" />
                        AI Interview Prep
                    </Link>
                </Button>
                <Button
                    onClick={() => openApplicationWizard(job)}
                    disabled={appliedJobIds.has(job._id)}
                    className={cn(
                        "flex-1 rounded-xl h-12 px-8 text-base font-bold shadow-lg transition-all",
                        appliedJobIds.has(job._id)
                            ? "bg-gray-100 text-gray-500 cursor-default shadow-none"
                            : "bg-[#EC6D0A] hover:bg-[#d66209] text-white shadow-[#EC6D0A]/10"
                    )}
                >
                    {appliedJobIds.has(job._id) ? (
                        <span className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Applied
                        </span>
                    ) : 'Apply for this position'}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white">

            {/* Top Tabs */}
            <div className="flex items-center gap-8 px-8 border-b shrink-0 h-16 bg-white">
                {[
                    { id: 'new', label: 'Briefcase', text: 'Discover' },
                    { id: 'saved', label: 'Bookmark', text: 'Saved' },
                    { id: 'applied', label: 'Zap', text: 'Applied' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as any); setSelectedJobId(null); }}
                        className={cn(
                            "relative h-full flex items-center gap-2 text-sm font-medium transition-colors",
                            activeTab === tab.id ? "text-gray-900 font-bold" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        {tab.text}
                        <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors",
                            activeTab === tab.id ? "bg-black text-white" : "bg-gray-100 text-gray-500"
                        )}>
                            {tab.id === 'saved' ? savedJobs.length :
                                tab.id === 'applied' ? appliedJobs.length :
                                    jobs.filter(j => !appliedJobIds.has(j._id)).length}
                        </span>
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-t-sm" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] flex-1 overflow-hidden">

                {/* LIST */}
                <div className="border-r bg-white overflow-y-auto p-4 md:p-6 space-y-4">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mb-4" />
                            Loading jobs...
                        </div>
                    ) : displayedJobs.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
                            <p className="mb-2">No jobs found in this category.</p>
                            {activeTab === 'saved' && <p className="text-sm">Click the bookmark icon on any job to save it here.</p>}
                        </div>
                    ) : (
                        displayedJobs.map((job) => (
                            <div
                                key={job._id}
                                onClick={() => setSelectedJobId(job._id)}
                                className={cn(
                                    "p-6 rounded-2xl border transition-all duration-300 cursor-pointer group relative overflow-hidden bg-white hover:border-gray-300",
                                    selectedJobId === job._id
                                        ? "bg-gradient-to-b from-[#EC6D0A1A] to-white/40 border-[#EC6D0A] shadow-[0_10px_25px_-5px_rgba(236,109,10,0.15),0_8px_10px_-6px_rgba(236,109,10,0.1)] -translate-y-1"
                                        : "border-gray-100 hover:-translate-y-1 hover:shadow-lg"
                                )}
                            >
                                <div className="absolute top-5 right-5 z-10">
                                    <button
                                        onClick={(e) => handleToggleSave(e, job._id)}
                                        className={cn(
                                            "w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 bg-white border shadow-sm",
                                            savedJobIds.has(job._id) ? "text-yellow-500 border-yellow-100" : "text-gray-300 border-gray-100"
                                        )}
                                    >
                                        <Bookmark className={cn("h-4 w-4", savedJobIds.has(job._id) && "fill-current")} />
                                    </button>
                                </div>

                                <div className="flex gap-4 mb-5">
                                    <div className="w-12 h-12 rounded-[12px] bg-gray-50 p-2 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform bg-white">
                                        {job.enterpriseId.logoUrl ? (
                                            <img
                                                src={job.enterpriseId.logoUrl}
                                                alt="Logo"
                                                className="w-full h-full object-contain"
                                                onError={(e) => handleImageError(e, job.enterpriseId.companyName)}
                                            />
                                        ) : (
                                            <Briefcase className="h-6 w-6 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 pr-10">
                                        <h4 className="font-extrabold text-gray-900 truncate text-[16px] mb-0.5 tracking-tight group-hover:text-[#EC6D0A] transition-colors">{job.title}</h4>
                                        <p className="text-[13px] font-medium text-gray-500">{job.enterpriseId.companyName}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white border border-gray-100 text-gray-600 flex items-center gap-1.5">
                                        <Globe className="h-3 w-3 text-gray-400" />
                                        {job.remote ? 'Remote' : job.location}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white border border-gray-100 text-gray-600 flex items-center gap-1.5">
                                        <DollarSign className="h-3 w-3 text-gray-400" />
                                        {job.salary || '$2k - $5k'}
                                    </span>
                                </div>

                                <p className="text-[13px] text-gray-500 line-clamp-2 mb-6 leading-relaxed font-medium">
                                    {job.description}
                                </p>

                                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        {appliedJobIds.has(job._id)
                                            ? `Applied ${new Date(job.appliedDate || Date.now()).toLocaleDateString()}`
                                            : 'Available for interview'}
                                    </span>
                                    <Button
                                        size="sm"
                                        className={cn(
                                            "h-9 px-4 rounded-full text-[12px] font-bold border-none shadow-sm transition-all",
                                            appliedJobIds.has(job._id)
                                                ? "bg-gray-50 text-gray-400"
                                                : "bg-[#EC6D0A] hover:bg-[#d66209] text-white"
                                        )}
                                        onClick={(e) => openDetailsDialog(e, job)}
                                    >
                                        {appliedJobIds.has(job._id) ? 'View Status' : 'Apply Now'}
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* DETAILS PANEL (Empty initially, or show selected) */}
                <div className="hidden lg:block bg-white overflow-y-auto p-10 border-l border-gray-50 shadow-inner">
                    {selectedJob ? (
                        <div className="max-w-3xl mx-auto">
                            {renderJobDetails(selectedJob)}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 animate-in fade-in duration-500">
                            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                                <Briefcase className="h-10 w-10 text-gray-200" />
                            </div>
                            <p className="text-lg font-bold text-gray-300">Select a job to dive into details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* QUICK VIEW DIALOG */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden p-0 rounded-2xl border-none shadow-2xl">
                    <div className="p-8 overflow-y-auto">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-[24px] font-extrabold tracking-tight text-gray-900">Job Opportunity Details</DialogTitle>
                        </DialogHeader>
                        {jobForDialog && renderJobDetails(jobForDialog)}
                    </div>
                </DialogContent>
            </Dialog>

            {/* APPLICATION WIZARD */}
            {jobForApplication && (
                <ApplicationWizard
                    open={isApplicationWizardOpen}
                    onOpenChange={setIsApplicationWizardOpen}
                    jobTitle={jobForApplication.title}
                    companyName={jobForApplication.enterpriseId.companyName}
                    onSubmit={handleApply}
                />
            )}
        </div>
    );
}


