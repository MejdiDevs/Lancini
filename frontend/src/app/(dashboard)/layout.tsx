'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    List,
    Users,
    MessageSquare,
    User,
    Percent,
    Settings,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading, user, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) return null;

    const isActive = (path: string) => pathname === path;

    const SidebarIcon = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
        <div className="w-full flex items-center justify-center group-hover:justify-start">
            <Link
                href={href}
                className={cn(
                    "flex items-center transition-all duration-300 group/link overflow-hidden",
                    // Square when collapsed, wide when expanded
                    "w-11 h-11 group-hover:w-full rounded-2xl",
                    isActive(href)
                        ? "bg-[#d66209] text-white shadow-[0_4px_12px_rgba(236,109,10,0.3)]"
                        : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                )}
            >
                <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                </div>
                <span className="whitespace-nowrap font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 pr-4">
                    {label}
                </span>
            </Link>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#F3F4F6] p-4 gap-5">
            {/* Sidebar Rail / Expandable */}
            <aside className="w-[72px] shrink-0 hidden md:block relative z-[999]">
                <div className="fixed top-4 left-4 h-[calc(100vh-32px)] w-[72px] hover:w-64 bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06),0_2px_6px_-1px_rgba(0,0,0,0.03)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group overflow-hidden flex flex-col items-center py-8">
                    {/* Top: Profile Image */}
                    <div className="mb-10 w-full flex justify-center group-hover:justify-start px-3.5 transition-all">
                        <div className="relative shrink-0">
                            {user?.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt="Profile"
                                    className="h-11 w-11 rounded-2xl object-cover ring-2 ring-gray-50 shadow-sm transition-transform group-hover:scale-105"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=EC6D0A&color=fff`;
                                    }}
                                />
                            ) : (
                                <div className="h-11 w-11 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 group-hover:bg-[#d66209] group-hover:text-white transition-colors duration-500">
                                    <User className="h-5 w-5" />
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 border-2 border-white rounded-full shadow-sm" />
                        </div>
                    </div>

                    <nav className="flex flex-col gap-4 w-full px-3.5 flex-1">
                        <SidebarIcon href="/dashboard" icon={LayoutDashboard} label="Overview" />

                        {/* ... rest of the nav remains same ... */}
                        {user?.role === 'STUDENT' && (
                            <>
                                <SidebarIcon href="/dashboard/cv" icon={FileText} label="CV Designer" />
                                <SidebarIcon href="/dashboard/cv-score" icon={Percent} label="CV Score" />
                                <SidebarIcon href="/dashboard/jobs" icon={Briefcase} label="Find Jobs" />
                            </>
                        )}

                        {user?.role === 'ENTERPRISE' && (
                            <>
                                <SidebarIcon href="/dashboard/listings" icon={List} label="My Listings" />
                                <SidebarIcon href="/dashboard/candidates" icon={Users} label="Find Candidates" />
                            </>
                        )}

                        {user?.role === 'ADMIN' && (
                            <SidebarIcon href="/dashboard/admin" icon={Settings} label="Admin" />
                        )}

                        <SidebarIcon href="/dashboard/messages" icon={MessageSquare} label="Messages" />
                        {user?.role !== 'ADMIN' && (
                            <SidebarIcon href="/dashboard/profile" icon={User} label="Profile" />
                        )}
                    </nav>

                    {/* Bottom: User Info */}
                    <div className="mt-auto w-full px-3.5 space-y-4">
                        <div className="pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-3 min-w-0">
                            <div className="min-w-0 pr-4">
                                <p className="text-sm font-black text-gray-900 truncate">
                                    {user?.name || 'User Account'}
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                                    {user?.role}
                                </p>
                            </div>
                        </div>

                        <div className="w-full flex items-center justify-center group-hover:justify-start">
                            <button
                                onClick={() => logout()}
                                className="flex items-center w-11 h-11 group-hover:w-full rounded-2xl transition-all duration-300 overflow-hidden text-red-500 hover:bg-red-50 group/logout"
                            >
                                <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                                    <LogOut className="h-5 w-5 transition-transform group-hover/logout:-translate-x-1" />
                                </div>
                                <span className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn(
                "flex-1 overflow-y-auto rounded-2xl bg-transparent",
                (pathname === '/dashboard/jobs' || pathname === '/dashboard/candidates') ? 'p-0' : 'p-2'
            )}>
                {children}
            </main>
        </div>
    );
}


