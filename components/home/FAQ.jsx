'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { ChevronDown, Phone } from 'lucide-react';

const FAQS = [
    {
        q: 'How long does delivery take?',
        a: 'Orders are typically delivered within 2–5 business days across major cities in Pakistan. Remote areas may take slightly longer.',
    },
    {
        q: 'Do you offer Cash on Delivery?',
        a: 'Yes! We offer Cash on Delivery (COD) nationwide so you can pay securely when your order arrives at your doorstep.',
    },
    {
        q: 'What is your return policy?',
        a: 'We offer a 7-day hassle-free return policy on eligible items. Contact our support team and we will guide you through the process.',
    },
    {
        q: 'Is free shipping available?',
        a: 'Free shipping is available on orders above Rs. 4,999. Check the announcement bar for current promotional thresholds.',
    },
    {
        q: 'Are your products authentic?',
        a: 'Absolutely. Every product listed on Panda E-Mart is quality-checked. What you see is what you receive — no surprises.',
    },
    {
        q: 'How can I track my order?',
        a: 'Create an account or log in to view real-time order status updates. You can also contact us via WhatsApp at 0343-5718296.',
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-12 md:py-16 bg-white">
            <Container>
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                    <div>
                        <span className="section-badge mb-3">FAQ</span>
                        <h2
                            className="text-2xl md:text-3xl font-extrabold text-[#1a1a2e] mt-2"
                            style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}
                        >
                            Frequently Asked Questions
                        </h2>
                        <p className="text-[14px] text-gray-500 mt-3 leading-relaxed max-w-md">
                            Got questions? We have answers. Everything you need to know about shopping with Panda E-Mart.
                        </p>
                        <div className="mt-8 p-5 rounded-[14px] bg-[#f8f9fa] border border-gray-100">
                            <p className="text-[13px] font-bold text-[#1a1a2e] mb-1">Still need help?</p>
                            <p className="text-[13px] text-gray-500 mb-3">Our team is available 24/7 to assist you.</p>
                            <a
                                href="tel:03435718296"
                                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#e63946] hover:underline"
                            >
                                <Phone className="w-4 h-4" />
                                0343-5718296
                            </a>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {FAQS.map((faq, i) => {
                            const isOpen = openIndex === i;
                            return (
                                <div
                                    key={faq.q}
                                    className={`rounded-[12px] border transition-all duration-300 ${
                                        isOpen ? 'border-[#e63946]/30 bg-[#e63946]/5' : 'border-gray-100 bg-[#f8f9fa]'
                                    }`}
                                >
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? -1 : i)}
                                        className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left"
                                        aria-expanded={isOpen}
                                    >
                                        <span className="text-[14px] font-bold text-[#1a1a2e]">{faq.q}</span>
                                        <ChevronDown
                                            size={18}
                                            className={`flex-shrink-0 text-[#e63946] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${
                                            isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        <p className="px-4 md:px-5 pb-4 md:pb-5 text-[13px] text-gray-500 leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Container>
        </section>
    );
}
