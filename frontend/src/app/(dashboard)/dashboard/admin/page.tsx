'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Check, X, User, Briefcase, FileText, Download, Filter } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'jobs' | 'students'>('jobs');
    const [jobs, setJobs] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [jobsRes, studentsRes] = await Promise.all([
                api.get('/jobs/admin/all'),
                api.get('/profile/all-students')
            ]);
            setJobs(jobsRes.data);
            setStudents(studentsRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleJobAction = async (jobId: string, status: 'open' | 'rejected') => {
        try {
            await api.patch(`/jobs/admin/${jobId}/status`, { status });
            // Update local state by mapping
            setJobs(prevJobs => prevJobs.map(j =>
                j._id === jobId ? { ...j, status } : j
            ));
        } catch (error) {
            console.error('Failed to update job status', error);
            alert('Action failed');
        }
    };

    const pendingJobs = jobs.filter(j => j.status === 'pending');

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage content and users</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchData} className="gap-2">
                        Refresh Data
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('jobs')}
                    className={`pb-4 px-2 font-medium text-sm transition-all relative flex items-center gap-2 ${activeTab === 'jobs' ? 'text-[#EC6D0A]' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Job Moderation
                    {pendingJobs.length > 0 && (
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">
                            {pendingJobs.length}
                        </span>
                    )}
                    {activeTab === 'jobs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EC6D0A]" />}
                </button>
                <button
                    onClick={() => setActiveTab('students')}
                    className={`pb-4 px-2 font-medium text-sm transition-all relative ${activeTab === 'students' ? 'text-[#EC6D0A]' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Student Management
                    {activeTab === 'students' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EC6D0A]" />}
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EC6D0A]"></div>
                </div>
            ) : activeTab === 'jobs' ? (
                <div className="space-y-8 animate-in fade-in cursor-default">
                    {/* Pending Jobs */}
                    {pendingJobs.length > 0 ? (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                                Pending Jobs ({pendingJobs.length})
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {pendingJobs.map(job => (
                                    <div key={job._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between lg:items-center gap-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-4">
                                            {job.enterpriseId?.logoUrl ? (
                                                <img src={job.enterpriseId.logoUrl} className="w-14 h-14 rounded-xl object-cover border" alt="" />
                                            ) : (
                                                <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border font-bold text-xl">
                                                    {job.enterpriseId?.companyName?.[0]}
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                                                <p className="text-sm text-gray-500 font-medium mb-1">{job.enterpriseId?.companyName}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">{job.type}</Badge>
                                                    <Badge variant="secondary" className="bg-blue-50 text-blue-600">{job.location}</Badge>
                                                    {job.remote && <Badge variant="secondary" className="bg-purple-50 text-purple-600">Remote</Badge>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
                                            <Button
                                                onClick={() => handleJobAction(job._id, 'open')}
                                                className="bg-green-600 hover:bg-green-700 text-white flex-1"
                                            >
                                                <Check className="w-4 h-4 mr-2" /> Approve
                                            </Button>
                                            <Button
                                                onClick={() => handleJobAction(job._id, 'rejected')}
                                                variant="outline"
                                                className="text-red-600 hover:bg-red-50 border-red-200 flex-1"
                                            >
                                                <X className="w-4 h-4 mr-2" /> Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-green-800 font-bold text-lg">All Caught Up!</h3>
                            <p className="text-green-600">No pending jobs to review.</p>
                        </div>
                    )}

                    {/* All Jobs Table */}
                    <div className="pt-8 border-t">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Job History</h2>
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-gray-700">Creation Date</th>
                                            <th className="px-6 py-4 font-semibold text-gray-700">Position</th>
                                            <th className="px-6 py-4 font-semibold text-gray-700">Company</th>
                                            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {jobs.filter(j => j.status !== 'pending').map(job => (
                                            <tr key={job._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Date(job.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-900">{job.title}</td>
                                                <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                                                    {job.enterpriseId?.logoUrl ? (
                                                        <img src={job.enterpriseId.logoUrl} className="w-6 h-6 rounded object-cover" />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                                                            {job.enterpriseId?.companyName?.[0]}
                                                        </div>
                                                    )}
                                                    {job.enterpriseId?.companyName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                        ${job.status === 'open' ? 'bg-green-100 text-green-800' :
                                                            job.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                job.status === 'closed' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>
                                                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in">
                    {students.map(student => (
                        <div key={student._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-16 w-16 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100">
                                    {student.profileImage ? (
                                        <img src={student.profileImage} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-300">
                                            <User className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${student.userId?.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                    }`}>
                                    {student.userId?.status || 'Active'}
                                </span>
                            </div>

                            <div className="mb-4">
                                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-[#EC6D0A] transition-colors">
                                    {student.firstName} {student.lastName}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium truncate">{student.userId?.email}</p>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <Briefcase className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">{student.studyYear || 'N/A'}</span>
                                </div>
                                {student.skills && student.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {student.skills.slice(0, 3).map((skill: string) => (
                                            <span key={skill} className="text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100">
                                                {skill}
                                            </span>
                                        ))}
                                        {student.skills.length > 3 && (
                                            <span className="text-[10px] text-gray-400 px-1">+{student.skills.length - 3}</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                {student.cvUrl ? (
                                    <a
                                        href={student.cvUrl}
                                        target="_blank"
                                        className="text-xs font-bold text-[#EC6D0A] hover:underline flex items-center gap-1"
                                    >
                                        <Download className="h-3 w-3" /> CV
                                    </a>
                                ) : (
                                    <span className="text-xs text-gray-300 cursor-not-allowed flex items-center gap-1">
                                        <Download className="h-3 w-3" /> No CV
                                    </span>
                                )}
                                <Link href={`/dashboard/messages/${student.userId?._id}`} className="text-xs font-bold text-gray-400 hover:text-gray-900">
                                    Message
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
