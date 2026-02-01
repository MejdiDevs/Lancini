'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, Play, CheckCircle2, Briefcase, Users, TrendingUp, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const stats = [
    { value: '500+', label: 'Students Placed' },
    { value: '120+', label: 'Partner Companies' },
    { value: '95%', label: 'Success Rate' },
  ];

  const featuredCompanies = [
    { name: 'Vermeg', logo: '/logos/logo1.png' },
    { name: 'Orange Tunisia', logo: '/logos/logo2.png' },
    { name: 'Tunisie Telecom', logo: '/logos/logo3.png' },
  ];

  const testimonials = [
    {
      name: 'Amira Ben Salem',
      role: 'Software Engineering Student',
      company: 'Now at Vermeg',
      quote: 'The platform transformed my job search from overwhelming to exciting. The AI interview prep gave me the confidence I needed, and I received multiple offers within weeks.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    },
    {
      name: 'Mohamed Khiari',
      role: 'Networks Engineering Student',
      company: 'Now at Orange Tunisia',
      quote: 'I was amazed by how easy it was to connect with top companies. The CV builder helped me stand out, and the direct messaging feature made the whole process seamless.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    },
  ];

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-900">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
            alt="City Skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/60" />
        </div>

        {/* Content */}
        <div className="container-custom relative z-10 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl lg:text-7xl font-light text-white mb-8 leading-tight">
                Begin Your Career<br />
                with <span className="font-bold text-brand-orange">ENET'Com Forum</span><br />
                Where <span className="italic font-serif text-brand-orange">Talent Meets</span><br />
                Opportunity
              </h1>
              <p className="text-xl text-gray-300 mb-10 max-w-xl font-light leading-relaxed">
                ENET&apos;Com&apos;s premier platform connecting exceptional engineering students with Tunisia&apos;s leading enterprises. Build your future, one connection at a time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="h-14 px-10 text-base bg-brand-orange text-white hover:bg-[#d66209] font-semibold">
                    Explore Opportunities
                  </Button>
                </Link>
                <Link href="#about">
                  <button className="h-14 px-10 text-base text-white hover:text-gray-300 font-light transition-colors flex items-center gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Right - Featured Companies Preview */}
            <motion.div
              className="hidden lg:flex flex-col gap-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {featuredCompanies.map((company, index) => (
                <motion.div
                  key={company.name}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all cursor-pointer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-gray-900" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">{company.name}</h4>
                      <p className="text-gray-300 text-sm">Now Hiring</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 bg-white" id="about">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-bold text-brand-orange uppercase tracking-[0.3em] mb-6 block">/About</span>
              <h2 className="text-5xl font-light text-brand-blue mb-8">ENET'Com Forum</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed font-light">
                For over a decade, ENET'Com Forum has been the bridge between ENET&apos;Com&apos;s brightest minds and Tunisia&apos;s most innovative companies. Our platform combines cutting-edge technology with personalized career guidance, ensuring every student finds their perfect match.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                We believe that finding the right opportunity is about more than just skills—it&apos;s about discovering a role that challenges you, aligns with your values, and propels your career forward.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col gap-10 pl-10 lg:pl-0"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="border-l-[3px] border-gray-900 pl-6 py-2">
                  <div className="text-6xl font-black text-gray-900 mb-2 leading-none">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Team/Student Photos Strip */}
          <motion.div
            className="grid grid-cols-5 gap-4 mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            ].map((img, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden">
                <img src={img} alt="Student" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video/Feature Section */}
      <section className="py-0 bg-gray-50">
        <div className="relative h-[70vh] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
            alt="Students Working"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
            <button className="w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all hover:scale-110">
              <Play className="h-8 w-8 text-gray-900 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Features/Portfolio Section */}
      <section className="py-32 bg-white">
        <div className="container-custom">
          <span className="text-sm font-bold text-brand-orange uppercase tracking-[0.3em] mb-12 block">/Our Platform</span>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Featured Feature */}
            <motion.div
              className="relative h-[600px] rounded-3xl overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="AI Interview Prep"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent flex flex-col justify-end p-10">
                <h3 className="text-4xl font-light text-white mb-3">AI Interview Preparation</h3>
                <p className="text-gray-200 text-lg font-light">Practice with our intelligent interviewer</p>
                <div className="mt-6 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Supporting Features */}
            <div className="grid grid-rows-2 gap-8">
              {[
                {
                  title: 'Smart CV Builder',
                  subtitle: 'ATS-Optimized Resumes',
                  image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80',
                },
                {
                  title: 'Direct Messaging',
                  subtitle: 'Connect with Recruiters',
                  image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="relative h-full rounded-3xl overflow-hidden group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent flex flex-col justify-end p-8">
                    <h4 className="text-2xl font-light text-white mb-1">{feature.title}</h4>
                    <p className="text-gray-300 text-sm font-light">{feature.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-5xl font-light text-gray-900 mb-20 text-center">
            Real Stories / True Success / Career Journeys
          </h2>

          <div className="max-w-5xl mx-auto">
            <motion.div
              className="grid lg:grid-cols-2 gap-12 items-center"
              key={activeTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Left - Client Info */}
              <div className="flex items-center gap-6">
                <img
                  src={testimonials[activeTestimonial].avatar}
                  alt={testimonials[activeTestimonial].name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-2xl font-semibold text-gray-900 mb-1">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-gray-600 mb-1">{testimonials[activeTestimonial].role}</p>
                  <p className="text-brand-orange font-semibold">{testimonials[activeTestimonial].company}</p>
                </div>
              </div>

              {/* Right - Quote */}
              <div>
                <p className="text-xl text-gray-700 leading-relaxed font-light italic">
                  &quot;{testimonials[activeTestimonial].quote}&quot;
                </p>
              </div>
            </motion.div>

            {/* Slider Dots */}
            <div className="flex justify-center gap-3 mt-12">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${activeTestimonial === index ? 'bg-brand-orange w-8' : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section className="py-32 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <motion.div
              className="relative h-[600px] rounded-3xl overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80"
                alt="Students Collaborating"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Right - Form */}
            <motion.div
              className="bg-gray-50 rounded-3xl p-12"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl font-light text-brand-blue mb-4">Let&apos;s Begin Your Career Journey</h2>
              <p className="text-gray-600 mb-8 font-light">Join the next generation of ENET&apos;Com talent</p>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Student ID"
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none transition-colors"
                />
                <textarea
                  placeholder="Tell us about your career goals"
                  rows={4}
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none transition-colors resize-none"
                />
                <Link href="/auth/register" className="block">
                  <Button className="w-full h-14 bg-brand-orange hover:bg-[#d66209] text-white rounded-xl text-base font-semibold">
                    Create Your Account
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Brand Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
          alt="City"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
          <h2 className="text-7xl font-light text-white tracking-wide">ENET'Com Forum</h2>
        </div>
      </section>
    </div>
  );
}
