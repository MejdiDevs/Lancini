'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
    CheckCircle,
    XCircle,
    Loader2,
    Sparkles,
    TrendingUp,
    Award,
    Layout,
    Type,
    Brain,
    Target,
    Zap,
    AlertCircle
} from 'lucide-react';
import api from '@/services/api';

interface AnalysisResult {
    overall_score: number;
    feedback_summary: string[];
    pros: string[];
    cons: string[];
    improvement_suggestions: string[];
    ats_criteria_ratings: {
        skill_match_score: number;
        keyword_match_score: number;
        experience_relevance_score: number;
        resume_formatting_score: number;
        action_verb_usage_score: number;
        job_fit_score: number;
    };
    top_matches: { title: string; description: string }[];
    top_gaps: { title: string; description: string }[];
}

export default function CVScorePage() {
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/cv-analysis/analyze');
            setResult(data);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to analyze CV. Please ensure you have uploaded a CV in the dashboard.');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-orange-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-orange-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="h-[calc(100vh-32px)] bg-white rounded-2xl border border-gray-100 shadow-md overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-yellow-500" />
                            AI CV Scorer
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Get instant, AI-powered feedback on your resume to beat the ATS.
                        </p>
                    </div>
                    {!result && !loading && (
                        <Button
                            onClick={handleAnalyze}
                            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                        >
                            <Brain className="h-4 w-4 mr-2" />
                            Analyze My CV
                        </Button>
                    )}
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                        <div className="relative">
                            <div className="w-24 h-24 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                            </div>
                        </div>
                        <h3 className="mt-6 text-lg font-semibold text-gray-800">Analyzing your CV...</h3>
                        <p className="text-gray-500 mt-2 text-sm max-w-md text-center">
                            Our AI is reviewing your skills, formatting, and relevance against industry standards.
                        </p>
                    </div>
                ) : !result ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                            <Target className="h-10 w-10 text-brand-blue" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Ready to optimize?</h3>
                        <p className="text-gray-500 mt-2 mb-8 max-w-lg text-center">
                            Hit analyze to get a detailed breakdown of your CV's strengths, weaknesses, and a personalized improvement plan.
                        </p>
                        <Button onClick={handleAnalyze} size="lg" className="px-8">
                            Start Analysis
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* LEFT COLUMN - Narrow */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Score Card */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
                                { /* Gradient Removed */}

                                <h3 className="text-xl font-bold text-gray-900 mb-6">ATS Compatibility Score</h3>

                                <div className="relative mb-6">
                                    <svg className="w-48 h-48 transform -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="none"
                                            className="text-gray-100"
                                        />
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="none"
                                            strokeDasharray={2 * Math.PI * 88}
                                            strokeDashoffset={2 * Math.PI * 88 * (1 - result.overall_score / 100)}
                                            className={getScoreColor(result.overall_score)}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-5xl font-extrabold ${getScoreColor(result.overall_score)}`}>
                                            {result.overall_score}
                                        </span>
                                        <span className="text-sm font-medium text-gray-400 mt-1">/ 100</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 font-medium">
                                    {result.overall_score >= 80 ? "Excellent Job! 🚀" : result.overall_score >= 60 ? "Good Start! 👍" : "Needs Improvement 🛠️"}
                                </p>
                            </div>

                            {/* Detailed Ratings */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <Layout className="h-4 w-4 text-gray-400" />
                                    Breakdown
                                </h4>
                                <div className="space-y-4">
                                    {(result.ats_criteria_ratings ? [
                                        { label: "Skills Match", score: result.ats_criteria_ratings.skill_match_score, icon: Zap },
                                        { label: "Keywords", score: result.ats_criteria_ratings.keyword_match_score, icon: Target },
                                        { label: "Formatting", score: result.ats_criteria_ratings.resume_formatting_score, icon: Layout },
                                        { label: "Impact", score: result.ats_criteria_ratings.action_verb_usage_score, icon: TrendingUp },
                                    ] : []).map((item) => (
                                        <div key={item.label}>
                                            <div className="flex justify-between text-xs font-medium mb-1.5">
                                                <span className="text-gray-600 flex items-center gap-1.5">
                                                    <item.icon className="h-3 w-3" /> {item.label}
                                                </span>
                                                <span className="text-gray-900">{item.score}/10</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${getScoreBg(item.score * 10)}`}
                                                    style={{ width: `${item.score * 10}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - Wide */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Summary Box */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Executive Summary</h3>
                                <div className="space-y-2">
                                    {result.feedback_summary?.map((line, i) => (
                                        <div key={i} className="flex gap-3">
                                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${i < 2 ? 'bg-orange-500' : 'bg-red-400'}`} />
                                            <p className="text-gray-600 leading-relaxed text-sm">{line}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Improvements */}
                            <div className="bg-orange-50/50 rounded-3xl p-8 border border-orange-100">
                                <h3 className="text-xl font-bold text-[#133D6F] mb-6 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-orange-600" />
                                    Action Plan
                                </h3>
                                <div className="grid gap-4">
                                    {result.improvement_suggestions?.map((suggestion, i) => (
                                        <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-orange-50 flex gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                                                {i + 1}
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed pt-1.5">{suggestion}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pros/Cons Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Top Matches */}
                                <div className="bg-orange-50/30 rounded-3xl p-6 border border-orange-100">
                                    <h4 className="font-bold text-orange-700 mb-4 flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5" />
                                        Top Matches
                                    </h4>
                                    <div className="space-y-4">
                                        {result.top_matches?.map((match, i) => (
                                            <div key={i} className="bg-white p-3 rounded-xl border border-orange-50 shadow-sm">
                                                <p className="font-bold text-sm text-gray-900">{match.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">{match.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Gaps */}
                                <div className="bg-red-50/30 rounded-3xl p-6 border border-red-100">
                                    <h4 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5" />
                                        Skill Gaps
                                    </h4>
                                    <div className="space-y-4">
                                        {result.top_gaps?.map((gap, i) => (
                                            <div key={i} className="bg-white p-3 rounded-xl border border-red-50 shadow-sm">
                                                <p className="font-bold text-sm text-gray-900">{gap.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">{gap.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Weaknesses (Full Width) */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <XCircle className="h-5 w-5 text-red-500" />
                                    Areas for Improvement
                                </h4>
                                <ul className="space-y-3">
                                    {result.cons?.map((con, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-gray-600">
                                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
                                            {con}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


