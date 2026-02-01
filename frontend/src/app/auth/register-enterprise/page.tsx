'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import api from '@/services/api';
import { ChevronDown, Loader2, CheckCircle2 } from 'lucide-react';

export default function RegisterEnterprisePage() {
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords don't match");
        }
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register/enterprise', formData);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-2xl p-10 shadow-2xl text-center">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-[#EC6D0A]" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Vérifiez vos emails</h2>
                    <p className="text-gray-500 font-bold mb-8 leading-relaxed">
                        Un lien de vérification a été envoyé à <span className="text-[#EC6D0A]">{formData.email}</span>. Veuillez vérifier votre compte d'entreprise pour continuer.
                    </p>
                    <Button onClick={() => router.push('/auth/login')} className="w-full bg-[#EC6D0A] hover:bg-[#d66209] text-white rounded-full h-14 font-bold">
                        Retour à la connexion
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-white overflow-hidden">
            {/* Left Panel: Auth Form */}
            <main className="w-full lg:w-1/2 flex flex-col p-10 lg:p-12 h-screen relative max-w-[640px] mx-auto overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-[420px] self-center">
                    <h1 className="text-[40px] font-bold tracking-tighter text-gray-900 mb-6">Hello There</h1>
                    <p className="text-sm text-gray-500 leading-relaxed mb-8">
                        Recruit the best talent from ENET'Com and grow your engineering talent pipeline.
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            name="companyName"
                            placeholder="Company Name"
                            required
                            value={formData.companyName}
                            onChange={handleChange}
                            className="w-full px-6 py-[18px] bg-gray-50 border border-transparent rounded-[100px] text-[15px] transition-all focus:bg-white focus:border-[#EC6D0A] focus:outline-none placeholder:text-gray-400 font-medium"
                        />

                        <input
                            name="email"
                            type="email"
                            placeholder="Professional Email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-6 py-[18px] bg-gray-50 border border-transparent rounded-[100px] text-[15px] transition-all focus:bg-white focus:border-[#EC6D0A] focus:outline-none placeholder:text-gray-400 font-medium"
                        />

                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-6 py-[18px] bg-gray-50 border border-transparent rounded-[100px] text-[15px] transition-all focus:bg-white focus:border-[#EC6D0A] focus:outline-none placeholder:text-gray-400 font-medium"
                        />

                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-6 py-[18px] bg-gray-50 border border-transparent rounded-[100px] text-[15px] transition-all focus:bg-white focus:border-[#EC6D0A] focus:outline-none placeholder:text-gray-400 font-medium"
                        />

                        {error && (
                            <div className="text-sm text-red-500 font-bold bg-red-50 py-3 rounded-2xl border border-red-100 px-4 text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-[18px] h-auto bg-[#EC6D0A] hover:bg-[#d66209] text-white rounded-[100px] text-base font-semibold shadow-xl shadow-orange-200 transition-all hover:-translate-y-0.5 mt-4"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Sign Up"}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-50 space-y-4">
                        <div className="text-sm font-bold text-gray-400 text-center">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-[#EC6D0A] hover:underline">
                                Sign In
                            </Link>
                        </div>
                        <div className="text-sm font-bold text-gray-400 text-center">
                            Are you a Student?{' '}
                            <Link href="/auth/register" className="text-[#EC6D0A] hover:underline">
                                Student Portal
                            </Link>
                        </div>
                    </div>
                </div>

                <footer className="mt-auto text-center pt-8 shrink-0">
                    <p className="text-[11px] text-gray-400 font-medium opacity-60 uppercase tracking-[0.2em]">
                        © 2026 Lancini • ENET'Com Forum • Tunisia
                    </p>
                </footer>
            </main>

            {/* Right Panel: Showcase */}
            <section className="hidden lg:flex w-1/2 relative h-screen items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src="/enet-bg.jpg" alt="University Campus" className="w-full h-full object-cover brightness-95" />
                    <div className="absolute inset-0 bg-black/10" />
                </div>

                <div className="relative z-10 bg-[#2b2b2b66] backdrop-blur-[16px] border border-white/10 p-12 rounded-2xl max-w-[540px] w-11/12 text-white shadow-2xl animate-in fade-in zoom-in duration-700">
                    <div className="mb-8">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="animate-spin-slow">
                            <circle cx="20" cy="20" r="18" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                            <path d="M20 2C29.9411 2 38 10.0589 38 20" stroke="white" stroke-width="4" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h2 className="text-[32px] font-semibold leading-tight mb-6 tracking-tight">Scale Your Engineering Excellence</h2>
                    <p className="text-[15px] leading-relaxed text-white/80">
                        Partner with ENET'Com to access a specialized pool of engineering talent. Transform your recruitment process with a data-driven approach to finding the right match for your enterprise.
                    </p>
                </div>
            </section>

            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}

