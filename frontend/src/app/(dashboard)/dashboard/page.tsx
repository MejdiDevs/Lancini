'use client';

import {
    Briefcase,
    FileText,
    TrendingUp,
    TrendingDown,
    Bot,
    Eye,
    Target,
    ArrowUpRight,
    Clock,
    MapPin,
    Building2,
    Users,
    Percent,
    Calendar,
    Settings,
    Plus,
    CheckCircle,
    User
} from 'lucide-react';
import Link from 'next/link';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import api from '@/services/api';

// Mock Data
const applicationTrendsData = [
    { month: 'Jan', applications: 5, interviews: 2 },
    { month: 'Feb', applications: 8, interviews: 3 },
    { month: 'Mar', applications: 12, interviews: 5 },
    { month: 'Apr', applications: 10, interviews: 4 },
    { month: 'May', applications: 15, interviews: 7 },
    { month: 'Jun', applications: 18, interviews: 9 },
];

const skillDistributionData = [
    { name: 'Technical', value: 40 },
    { name: 'Soft Skills', value: 30 },
    { name: 'Languages', value: 20 },
    { name: 'Certifications', value: 10 },
];

const COLORS = ['#EC6D0A', '#F97316', '#8B5CF6', '#EAB308'];

const StudentDashboard = () => {
    const { user } = useAuthStore();
    const [timeRange, setTimeRange] = useState('1Y');

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Top Header Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Get a clear view of your career journey
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/cv" className="px-6 py-3 bg-[#EC6D0A] hover:bg-[#d66209] text-white rounded-full font-bold text-sm shadow-lg shadow-orange-200 transition-all hover:scale-105 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Update CV
                        </Link>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Applications */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Applications</span>
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EC6D0A] flex items-center justify-center">
                            <Briefcase className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-4xl font-black text-gray-900 mb-2">24</div>
                    <div className="flex items-center gap-1 text-sm font-bold text-[#EC6D0A]">
                        <TrendingUp className="h-4 w-4" />
                        <span>+12% from last month</span>
                    </div>
                </div>

                {/* CV Score */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">CV Score</span>
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center">
                            <Percent className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-4xl font-black text-gray-900 mb-2">8.7</div>
                    <div className="flex items-center gap-1 text-sm font-bold text-[#F97316]">
                        <TrendingUp className="h-4 w-4" />
                        <span>+0.5 from last update</span>
                    </div>
                </div>

                {/* Profile Views */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Profile Views</span>
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EC6D0A] flex items-center justify-center">
                            <Eye className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-4xl font-black text-gray-900 mb-2">342</div>
                    <div className="flex items-center gap-1 text-sm font-bold text-[#EC6D0A]">
                        <TrendingUp className="h-4 w-4" />
                        <span>+28% from last month</span>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                {/* Application Trends Chart */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Application Trends</h3>
                            <p className="text-xs text-gray-500 font-medium">Track your job search progress over time</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setTimeRange('1Y')}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${timeRange === '1Y'
                                    ? 'bg-[#EC6D0A] text-white'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                1Y
                            </button>
                            <button
                                onClick={() => setTimeRange('6M')}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${timeRange === '6M'
                                    ? 'bg-[#EC6D0A] text-white'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                6M
                            </button>
                            <button
                                onClick={() => setTimeRange('1M')}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${timeRange === '1M'
                                    ? 'bg-[#EC6D0A] text-white'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                1M
                            </button>
                        </div>
                    </div>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={applicationTrendsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: '600', fill: '#9CA3AF' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: '600', fill: '#9CA3AF' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        fontWeight: '600',
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="applications"
                                    stroke="#EC6D0A"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#EC6D0A' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="interviews"
                                    stroke="#F97316"
                                    strokeWidth={3}
                                    strokeDasharray="5 5"
                                    dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#F97316' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-6 mt-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#EC6D0A]"></div>
                            <span className="text-xs font-bold text-gray-600">Applications</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#F97316] opacity-70"></div>
                            <span className="text-xs font-bold text-gray-600">Interviews</span>
                        </div>
                    </div>
                </div>

                {/* Skill Distribution Donut */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Skill Distribution</h3>
                    <div className="relative h-[200px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={skillDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {skillDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <div className="text-3xl font-black text-gray-900">85%</div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Complete</p>
                        </div>
                    </div>
                    <div className="space-y-3 mt-6">
                        {skillDistributionData.map((item, index) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></div>
                                    <span className="text-xs font-bold text-gray-600">{item.name}</span>
                                </div>
                                <span className="text-xs font-black text-gray-900">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recommended Opportunities */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Recommended Opportunities</h3>
                    <a href="/dashboard/jobs" className="text-sm font-bold text-[#EC6D0A] hover:text-[#d66209] transition-colors">
                        View All
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Opportunity Card 1 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
                        <div className="relative h-40 bg-gradient-to-br from-[#133D6F] to-orange-600 overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Building2 className="h-16 w-16 text-white/20" />
                            </div>
                            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                                <span className="text-xs font-bold text-white">PFE</span>
                            </div>
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="p-5">
                            <h4 className="font-bold text-gray-900 mb-2 line-clamp-1">Full-Stack Developer</h4>
                            <p className="text-xs text-gray-500 font-medium mb-3 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                Tunis, Tunisia
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-lg font-bold">React</span>
                                <span className="text-xs bg-blue-50 text-brand-blue px-2 py-1 rounded-lg font-bold">Node.js</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black text-gray-900">95% Match</span>
                                <Clock className="h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Opportunity Card 2 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
                        <div className="relative h-40 bg-gradient-to-br from-orange-400 to-orange-600 overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Building2 className="h-16 w-16 text-white/20" />
                            </div>
                            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                                <span className="text-xs font-bold text-white">Internship</span>
                            </div>
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="p-5">
                            <h4 className="font-bold text-gray-900 mb-2 line-clamp-1">UX/UI Designer</h4>
                            <p className="text-xs text-gray-500 font-medium mb-3 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                Sousse, Tunisia
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-lg font-bold">Figma</span>
                                <span className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-lg font-bold">UI</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black text-gray-900">92% Match</span>
                                <Clock className="h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Opportunity Card 3 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
                        <div className="relative h-40 bg-gradient-to-br from-purple-500 to-indigo-600 overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Building2 className="h-16 w-16 text-white/20" />
                            </div>
                            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                                <span className="text-xs font-bold text-white">PFE</span>
                            </div>
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="p-5">
                            <h4 className="font-bold text-gray-900 mb-2 line-clamp-1">Data Scientist</h4>
                            <p className="text-xs text-gray-500 font-medium mb-3 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                Remote
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-lg font-bold">Python</span>
                                <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded-lg font-bold">ML</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black text-gray-900">88% Match</span>
                                <Clock className="h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Opportunity Card 4 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
                        <div className="relative h-40 bg-gradient-to-br from-yellow-400 to-yellow-600 overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Building2 className="h-16 w-16 text-white/20" />
                            </div>
                            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                                <span className="text-xs font-bold text-white">Internship</span>
                            </div>
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="p-5">
                            <h4 className="font-bold text-gray-900 mb-2 line-clamp-1">Mobile Developer</h4>
                            <p className="text-xs text-gray-500 font-medium mb-3 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                Ariana, Tunisia
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xs bg-cyan-50 text-cyan-600 px-2 py-1 rounded-lg font-bold">Flutter</span>
                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-bold">Dart</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black text-gray-900">85% Match</span>
                                <Clock className="h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const EnterpriseDashboard = () => {
    const { user } = useAuthStore();
    const [timeRange, setTimeRange] = useState('1M');

    // Mock data for enterprise
    const candidateTrendsData = [
        { month: 'Jan', candidates: 45, hired: 8 },
        { month: 'Feb', candidates: 52, hired: 10 },
        { month: 'Mar', candidates: 68, hired: 12 },
        { month: 'Apr', candidates: 55, hired: 9 },
        { month: 'May', candidates: 72, hired: 15 },
        { month: 'Jun', candidates: 85, hired: 18 },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Top Header Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Welcome back, {user?.name?.split(' ')[0] || 'Team'} 👋
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Overview of your hiring pipeline and platform activity
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/listings" className="px-6 py-3 bg-[#EC6D0A] hover:bg-[#d66209] text-white rounded-full font-bold text-sm shadow-lg shadow-orange-200 transition-all hover:scale-105 flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Post New Job
                        </Link>
                    </div>
                </div>
            </div>

            {/* KPI Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Candidates</div>
                        <div className="text-3xl font-black text-gray-900 mb-1">85</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-green-500 mt-2">
                        <TrendingUp className="h-3 w-3" />
                        <span>+24% vs last month</span>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Open Positions</div>
                        <div className="text-3xl font-black text-gray-900 mb-1">12</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-orange-500 mt-2">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>3 new this week</span>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Avg. Time to Hire</div>
                        <div className="text-3xl font-black text-gray-900 mb-1">18d</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-orange-500 mt-2">
                        <TrendingDown className="h-3 w-3" />
                        <span>-2 days vs average</span>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Offer Acceptance</div>
                        <div className="text-3xl font-black text-gray-900 mb-1">92%</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-green-500 mt-2">
                        <TrendingUp className="h-3 w-3" />
                        <span>+5% this quarter</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
                {/* Candidate Trends Chart */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Hiring Trends</h3>
                            <p className="text-xs text-gray-400 font-medium">Candidate intake and hiring success over time</p>
                        </div>
                        <div className="flex gap-2">
                            {['1M', '3M', '6M'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${timeRange === range ? 'bg-[#EC6D0A] text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={candidateTrendsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#9CA3AF' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line type="monotone" dataKey="candidates" stroke="#EC6D0A" strokeWidth={4} dot={{ fill: '#EC6D0A', stroke: '#fff', strokeWidth: 3, r: 6 }} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="hired" stroke="#F97316" strokeWidth={4} strokeDasharray="8 6" dot={{ fill: '#F97316', stroke: '#fff', strokeWidth: 3, r: 6 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-8 mt-8 border-t border-gray-50 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-1 bg-[#EC6D0A] rounded-full" />
                            <span className="text-xs font-bold text-gray-600">Total Candidates</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-1 bg-[#F97316] rounded-full opacity-60" />
                            <span className="text-xs font-bold text-gray-600">Successfully Hired</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Feed</h3>
                        <Link href="/dashboard/candidates" className="text-xs font-bold text-[#EC6D0A] hover:underline">View All</Link>
                    </div>
                    <div className="space-y-6 flex-1">
                        {[
                            { action: 'New candidate applied', target: 'Sarah Johnson', role: 'Frontend Engineer', time: '5m ago', icon: User, color: 'bg-blue-50 text-blue-600' },
                            { action: 'Interview scheduled', target: 'Michael Chen', role: 'UX Designer', time: '1h ago', icon: Calendar, color: 'bg-orange-50 text-orange-600' },
                            { action: 'Offer accepted', target: 'Emma Wilson', role: 'Product Manager', time: '3h ago', icon: CheckCircle, color: 'bg-green-50 text-green-600' },
                            { action: 'Application reviewed', target: 'David Smith', role: 'Backend Engineer', time: '5h ago', icon: FileText, color: 'bg-purple-50 text-purple-600' },
                        ].map((activity, i) => (
                            <div key={i} className="flex gap-4 relative">
                                {i !== 3 && <div className="absolute left-[18px] top-10 bottom-[-24px] w-[2px] bg-gray-50" />}
                                <div className={`w-9 h-9 rounded-xl ${activity.color} flex items-center justify-center flex-shrink-0 z-10 shadow-sm`}>
                                    <activity.icon className="h-4.5 w-4.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <p className="text-xs font-bold text-gray-900 line-clamp-1">{activity.action}</p>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase shrink-0 ml-2">{activity.time}</span>
                                    </div>
                                    <p className="text-xs font-bold text-[#EC6D0A] truncate">{activity.target}</p>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight mt-0.5">{activity.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-50">
                        <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl text-xs font-bold transition-colors">
                            Complete Setup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminOverview = () => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({
        pendingJobs: 0,
        totalJobs: 0,
        totalStudents: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [jobsRes, studentsRes] = await Promise.all([
                    api.get('/jobs/admin/all').catch(() => ({ data: [] })),
                    api.get('/profile/all-students').catch(() => ({ data: [] }))
                ]);

                const jobs = jobsRes.data || [];
                const students = studentsRes.data || [];

                setStats({
                    pendingJobs: jobs.filter((j: any) => j.status === 'pending').length,
                    totalJobs: jobs.length,
                    totalStudents: students.length
                });
            } catch (error) {
                console.error('Failed to fetch admin stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        System Administration
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Overview of platform activity and moderation tasks
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/admin" className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-bold text-sm shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Open Console
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pending Review</span>
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-4xl font-black text-gray-900 mb-1">{loading ? '-' : stats.pendingJobs}</div>
                    <span className="text-xs font-bold text-orange-500">Jobs awaiting approval</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Students</span>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-4xl font-black text-gray-900 mb-1">{loading ? '-' : stats.totalStudents}</div>
                    <span className="text-xs font-bold text-blue-500">Registered profiles</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Jobs</span>
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Briefcase className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-4xl font-black text-gray-900 mb-1">{loading ? '-' : stats.totalJobs}</div>
                    <span className="text-xs font-bold text-purple-500">All time listings</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">System Health</span>
                        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-4xl font-black text-gray-900 mb-1">98%</div>
                    <span className="text-xs font-bold text-green-500">Operational</span>
                </div>
            </div>

            {/* Quick Actions / Recent Activity Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/dashboard/admin" className="p-4 rounded-xl border hover:border-orange-200 hover:bg-orange-50 transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="font-bold text-gray-900">Verify Jobs</div>
                            <div className="text-xs text-gray-500 font-medium">Review pending listings</div>
                        </Link>
                        <Link href="/dashboard/admin" className="p-4 rounded-xl border hover:border-blue-200 hover:bg-blue-50 transition-all group">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Users className="h-5 w-5" />
                            </div>
                            <div className="font-bold text-gray-900">Manage Users</div>
                            <div className="text-xs text-gray-500 font-medium">View student database</div>
                        </Link>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Admin Console</h3>
                        <p className="opacity-70 mb-8 max-w-sm">
                            Access full administrative capabilities, user management, and detailed reporting in the main console.
                        </p>
                        <Link href="/dashboard/admin">
                            <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                                Go to Console
                            </button>
                        </Link>
                    </div>
                    <Settings className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
                </div>
            </div>
        </div>
    );
};

export default function DashboardPage() {
    const { user } = useAuthStore();

    return (
        <div className="max-w-[1400px] mx-auto">
            {user?.role === 'ENTERPRISE' ? <EnterpriseDashboard /> : user?.role === 'ADMIN' ? <AdminOverview /> : <StudentDashboard />}
        </div>
    );
}


