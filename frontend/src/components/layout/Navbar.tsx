'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { useEffect } from 'react';

export default function Navbar() {
    const { user, isAuthenticated, logout, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container-custom flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/enetcom-forum-logo.png"
                        alt="Lancini - ENET'Com Forum"
                        width={180}
                        height={60}
                        className="h-12 w-auto"
                        priority
                    />
                </Link>
                <div className="flex items-center space-x-6">
                    <Link href="/editions" className="text-sm font-medium hover:text-primary transition-colors">
                        Editions
                    </Link>
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>
                            <Button onClick={() => logout()} variant="outline">
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link href="/auth/login">
                                <Button variant="ghost">Log in</Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button>Sign up</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
