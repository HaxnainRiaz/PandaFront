'use client';

import { useState, useEffect } from 'react';
import PageHero from '@/components/ui/PageHero';
import { Container, Button, Input } from '@/components/ui';
import { useStoreAuth } from '@/context/StoreAuthContext';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export default function ContactPage() {
    const { user } = useStoreAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_URL}/support-tickets`, {
                method: 'POST',
                headers,
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                setStatus('success');
                setFormData({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
                setTimeout(() => setStatus(''), 5000);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const contactItems = [
        {
            title: 'Email',
            value: 'pandaemart03@gmail.com',
            href: 'mailto:pandaemart03@gmail.com',
            icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        },
        {
            title: 'Phone / WhatsApp',
            value: '0343-5718296',
            href: 'tel:03435718296',
            sub: 'Available 9am – 9pm',
            icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
        },
        {
            title: 'Location',
            value: 'Pakistan',
            sub: 'Nationwide delivery available',
            icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
        },
    ];

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <PageHero
                badge="Get in Touch"
                title="Contact Us"
                subtitle="Have a question about your order or a product? We're here to help."
            />

            <Container className="py-12 md:py-16">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
                    <div>
                        <h2 className="text-2xl font-extrabold text-[#1a1a2e] mb-4" style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}>
                            We&apos;d Love to Hear From You
                        </h2>
                        <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">
                            Whether you need help with an order, have a product inquiry, or want to share feedback — our team responds quickly and professionally.
                        </p>

                        <div className="space-y-5">
                            {contactItems.map((item) => (
                                <div key={item.title} className="flex items-start gap-4 p-4 bg-white rounded-[12px] border border-gray-100 shadow-sm">
                                    <div className="w-11 h-11 bg-[#e63946]/10 rounded-[10px] flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-[#e63946]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#1a1a2e] text-[14px] mb-0.5">{item.title}</h3>
                                        {item.href ? (
                                            <a href={item.href} className="text-[14px] text-[#e63946] hover:underline font-medium">{item.value}</a>
                                        ) : (
                                            <p className="text-[14px] text-gray-500">{item.value}</p>
                                        )}
                                        {item.sub && <p className="text-[12px] text-gray-400 mt-0.5">{item.sub}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 md:p-8 rounded-[14px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                        <h2 className="text-xl font-extrabold text-[#1a1a2e] mb-6">Send a Message</h2>

                        {status === 'success' && (
                            <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-[10px] border border-green-100 flex items-center gap-2 animate-fadeIn text-sm">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Message sent! We&apos;ll get back to you shortly.
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-[10px] border border-red-100 flex items-center gap-2 animate-fadeIn text-sm">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                Failed to send message. Please try again.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input label="Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" />
                            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                            <Input label="Subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="How can we help?" />
                            <div>
                                <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    placeholder="Tell us more about your inquiry..."
                                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[10px] text-sm text-[#1a1a2e] placeholder-gray-400 focus:border-[#e63946] focus:ring-2 focus:ring-[#e63946]/15 outline-none transition-all resize-none"
                                />
                            </div>
                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </div>
                </div>
            </Container>
        </div>
    );
}
