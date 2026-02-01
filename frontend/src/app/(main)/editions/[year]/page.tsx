'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Users, Building2, TrendingUp, Sparkles, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/services/api';

interface EditionDetail {
    year: number;
    title: string;
    description: string;
    highlights: string[];
    statistics: {
        studentsParticipated: number;
        companiesParticipated: number;
        internshipsOffered: number;
    };
    gallery: Array<{
        url: string;
        caption: string;
    }>;
    charteGraphique: Array<{
        name: string;
        url: string;
        fileSize: number;
    }>;
}

export default function EditionDetailPage() {
    const params = useParams();
    const year = params?.year as string;
    const [edition, setEdition] = useState<EditionDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (year) {
            fetchEdition();
        }
    }, [year]);

    const fetchEdition = async () => {
        try {
            const { data } = await api.get(`/editions/${year}`);
            setEdition(data);
        } catch (error) {
            console.error('Failed to fetch edition:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading edition...</p>
                </div>
            </div>
        );
    }

    if (!edition) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Edition Not Found</h2>
                    <p className="text-muted-foreground mb-6">The edition you're looking for doesn't exist.</p>
                    <Link href="/editions">
                        <Button>Back to Editions</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <section className="py-12 border-b border-gray-200 dark:border-gray-800">
                <div className="container-custom">
                    <Link href="/editions">
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to All Editions
                        </Button>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1.5 text-sm font-medium text-white mb-4">
                            <Sparkles className="h-4 w-4" />
                            <span>Forum {edition.year}</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                            {edition.title}
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
                            {edition.description}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12">
                <div className="container-custom">
                    <div className="grid md:grid-cols-3 gap-6">
                        <motion.div
                            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Users className="h-8 w-8 text-blue-600 mb-3" />
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {edition.statistics.studentsParticipated}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Students Participated</div>
                        </motion.div>

                        <motion.div
                            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Building2 className="h-8 w-8 text-[#EC6D0A] mb-3" />
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {edition.statistics.companiesParticipated}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Partner Companies</div>
                        </motion.div>

                        <motion.div
                            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <TrendingUp className="h-8 w-8 text-[#133D6F] mb-3" />
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {edition.statistics.internshipsOffered}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Internship Offers</div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Highlights */}
            {edition.highlights && edition.highlights.length > 0 && (
                <section className="py-12">
                    <div className="container-custom">
                        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Key Highlights</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {edition.highlights.map((highlight, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                                            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">{highlight}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Charte Graphique Downloads */}
            {edition.charteGraphique && edition.charteGraphique.length > 0 && (
                <section className="py-12 bg-white/50 dark:bg-gray-800/50">
                    <div className="container-custom">
                        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Charte Graphique</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {edition.charteGraphique.map((file, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                                <FileText className="h-6 w-6 text-red-600" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">{file.name}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">{formatFileSize(file.fileSize)}</div>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Gallery */}
            {edition.gallery && edition.gallery.length > 0 && (
                <section className="py-12">
                    <div className="container-custom">
                        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Photo Gallery</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {edition.gallery.map((photo, index) => (
                                <motion.div
                                    key={index}
                                    className="group relative aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <p className="text-white text-sm font-medium">{photo.caption}</p>
                                    </div>
                                    {/* Placeholder for actual images */}
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span className="text-sm">Image: {photo.caption}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
