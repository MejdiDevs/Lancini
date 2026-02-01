'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import api from '@/services/api';
import { ChevronDown, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { login } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-white overflow-hidden">
            {/* Left Panel: Auth Form */}
            {/* Left Panel: Auth Form */}
            <main className="w-full lg:w-1/2 flex flex-col p-10 lg:p-12 h-screen relative max-w-[640px] mx-auto overflow-y-auto">
                <div className="my-auto w-full max-w-[420px] self-center">
                    <h1 className="text-[40px] font-bold tracking-tighter text-gray-900 mb-6">Welcome Back</h1>
                    <p className="text-sm text-gray-500 leading-relaxed mb-12">
                        To sign in to your account, please enter your email address and password.
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email Address"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-[18px] bg-gray-50 border border-transparent rounded-[100px] text-[15px] transition-all focus:bg-white focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-[#EC6D0A]/5 placeholder:text-gray-400 font-medium"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-[18px] bg-gray-50 border border-transparent rounded-[100px] text-[15px] transition-all focus:bg-white focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-[#EC6D0A]/5 placeholder:text-gray-400 font-medium"
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 font-bold bg-red-50 py-3 rounded-2xl border border-red-100 px-4">
                                {error}
                            </div>
                        )}

                        <div className="text-left pl-5 mt-[-4px] mb-3">
                            <Link href="#" className="text-[13px] text-brand-orange hover:underline font-medium">Forgot password?</Link>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-[18px] h-auto bg-brand-orange hover:bg-[#d66209] text-white rounded-[100px] text-base font-semibold shadow-xl shadow-orange-200 transition-all hover:-translate-y-0.5"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-12 space-y-4">
                        <div className="text-sm font-bold text-gray-400">
                            Looking for an account?{' '}
                            <Link href="/auth/register" className="text-[#EC6D0A] hover:underline">
                                Create Student Account
                            </Link>
                        </div>
                    </div>
                </div>

                <footer className="mt-auto text-center pt-8">
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
                    <h2 className="text-[32px] font-semibold leading-tight mb-6 tracking-tight">The Gateway to Advanced Engineering Careers</h2>
                    <p className="text-[15px] leading-relaxed text-white/80">
                        Join the most prestigious network of engineers in Tunisia. Discover elite internship opportunities and launch your professional journey with top-tier industrial partners.
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
            `}</style>
        </div>
    );
}

