'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, Calendar, Users, Briefcase, Award, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EditionsPage() {
    const editions = [
        {
            year: '2026',
            title: "ENET'Com Forum 2026",
            status: 'Current',
            date: 'March 15-17, 2026',
            location: 'ENET\'Com Campus, Sfax',
            participants: '500+ Students',
            companies: '120+ Companies',
            description: 'The largest career fair in ENET\'Com history, featuring AI-powered matching, virtual booths, and exclusive networking sessions.',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
            highlights: [
                'AI-Powered Job Matching',
                'Virtual & In-Person Booths',
                'Executive Keynotes',
                'Technical Workshops',
            ],
        },
        {
            year: '2025',
            title: "ENET'Com Forum 2025",
            status: 'Past',
            date: 'March 20-22, 2025',
            location: 'ENET\'Com Campus, Sfax',
            participants: '450+ Students',
            companies: '95+ Companies',
            description: 'A landmark edition that introduced our revolutionary CV builder and interview preparation tools.',
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
            highlights: [
                'Launch of AI CV Builder',
                'Record Placement Rate',
                'Industry Panel Discussions',
                'Startup Pitch Competition',
            ],
        },
        {
            year: '2024',
            title: "ENET'Com Forum 2024",
            status: 'Past',
            date: 'March 18-20, 2024',
            location: 'ENET\'Com Campus, Sfax',
            participants: '400+ Students',
            companies: '80+ Companies',
            description: 'The digital transformation edition, where we pioneered virtual career fairs for remote opportunities.',
            image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
            highlights: [
                'First Hybrid Format',
                'International Companies',
                'Remote Work Opportunities',
                'Career Mentorship Program',
            ],
        },
        {
            year: '2023',
            title: "ENET'Com Forum 2023",
            status: 'Past',
            date: 'March 15-17, 2023',
            location: 'ENET\'Com Campus, Sfax',
            participants: '350+ Students',
            companies: '65+ Companies',
            description: 'Celebrating a decade of connecting talent with opportunity, featuring our largest alumni network gathering.',
            image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
            highlights: [
                '10th Anniversary Edition',
                'Alumni Success Stories',
                'Expanded Tech Track',
                'Diversity & Inclusion Focus',
            ],
        },
    ];

    const successMetrics = [
        { value: '2000+', label: 'Total Graduates Placed', icon: Users },
        { value: '300+', label: 'Partner Companies', icon: Briefcase },
        { value: '92%', label: 'Average Success Rate', icon: Award },
        { value: '10+', label: 'Years of Excellence', icon: Calendar },
    ];

    return (
        <div className="flex flex-col bg-white">
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=2000&q=80"
                        alt="Forum Event"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/70" />
                </div>

                <div className="container-custom relative z-10 py-24">
                    <motion.div
                        className="max-w-3xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-sm font-bold text-brand-orange uppercase tracking-[0.3em] mb-6 block">/Past Editions</span>
                        <h1 className="text-6xl lg:text-7xl font-light text-white mb-8 leading-tight">
                            A Decade of<br />
                            <span className="font-bold text-brand-orange">Career Success</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-10 font-light leading-relaxed">
                            Explore the history of ENET'Com Forum and discover how we&apos;ve been shaping careers and building futures since 2013.
                        </p>
                        <Link href="/auth/register">
                            <Button size="lg" className="h-14 px-10 text-base bg-brand-orange text-white hover:bg-[#d66209] font-semibold">
                                Join 2026 Edition
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Success Metrics */}
            <section className="py-20 bg-gray-50 border-b border-gray-200">
                <div className="container-custom">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {successMetrics.map((metric, index) => (
                            <motion.div
                                key={metric.label}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <metric.icon className="h-10 w-10 text-brand-orange mx-auto mb-4" />
                                <div className="text-5xl font-bold text-brand-blue mb-2">{metric.value}</div>
                                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{metric.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Editions Timeline */}
            <section className="py-32 bg-white">
                <div className="container-custom">
                    <div className="space-y-24">
                        {editions.map((edition, index) => (
                            <motion.div
                                key={edition.year}
                                className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                {/* Image */}
                                <div className={`relative h-[500px] rounded-3xl overflow-hidden ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                                    <img
                                        src={edition.image}
                                        alt={edition.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {edition.status === 'Current' && (
                                        <div className="absolute top-6 left-6 bg-brand-orange text-white px-6 py-2 rounded-full font-bold text-sm">
                                            Current Edition
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                                    <div className="relative mb-8 isolate select-none flex items-end">
                                        <span
                                            className="text-[130px] leading-none font-black text-transparent absolute -bottom-5 -left-4 -z-10"
                                            style={{ WebkitTextStroke: '2px #d1d5db' }}
                                        >
                                            {edition.year}
                                        </span>
                                        <h2 className="text-4xl font-bold text-brand-blue relative z-10">
                                            {edition.title}
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="flex items-start gap-3">
                                            <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</div>
                                                <div className="text-sm font-semibold text-gray-900">{edition.date}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Location</div>
                                                <div className="text-sm font-semibold text-gray-900">{edition.location}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Users className="h-5 w-5 text-gray-400 mt-1" />
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Participants</div>
                                                <div className="text-sm font-semibold text-gray-900">{edition.participants}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Briefcase className="h-5 w-5 text-gray-400 mt-1" />
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Companies</div>
                                                <div className="text-sm font-semibold text-gray-900">{edition.companies}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-lg text-gray-600 mb-8 font-light leading-relaxed">
                                        {edition.description}
                                    </p>

                                    <div className="space-y-3 mb-8">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Highlights</div>
                                        {edition.highlights.map((highlight, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                                                <span className="text-sm text-gray-700 font-medium">{highlight}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {edition.status === 'Current' && (
                                        <Link href="/auth/register">
                                            <Button className="h-12 px-8 bg-brand-orange hover:bg-[#d66209] text-white rounded-xl font-semibold">
                                                Register Now
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=2000&q=80"
                        alt="Networking"
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>

                <div className="container-custom relative z-10">
                    <motion.div
                        className="max-w-3xl mx-auto text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-5xl font-light text-white mb-6">
                            Be Part of <span className="font-bold text-brand-orange">ENET'Com Forum 2026</span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-10 font-light leading-relaxed">
                            Join the next generation of ENET&apos;Com talent. Register now and take the first step toward your dream career.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/auth/register">
                                <Button size="lg" className="h-14 px-10 text-base bg-brand-orange text-white hover:bg-[#d66209] font-semibold">
                                    Register as Student
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
