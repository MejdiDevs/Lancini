'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '@/services/api';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams?.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link');
            return;
        }

        verifyEmail();
    }, [token]);

    const verifyEmail = async () => {
        try {
            const { data } = await api.get(`/auth/verify-email?token=${token}`);
            setStatus('success');
            setMessage(data.message || 'Email verified successfully!');

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        } catch (error: any) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
                        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                            Verifying Your Email
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Please wait while we verify your email address...
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle2 className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                            Email Verified!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {message}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            Redirecting to login page...
                        </p>
                        <Link href="/auth/login">
                            <Button className="w-full">
                                Go to Login
                            </Button>
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                            Verification Failed
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {message}
                        </p>
                        <div className="space-y-3">
                            <Link href="/auth/login">
                                <Button variant="outline" className="w-full">
                                    Back to Login
                                </Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button className="w-full">
                                    Register Again
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

