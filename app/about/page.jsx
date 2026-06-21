import PageHero from '@/components/ui/PageHero';
import { Container } from '@/components/ui/Container';

export const metadata = {
    title: 'About Us - Panda E-Mart',
    description: 'Learn about Panda E-Mart — Pakistan trusted online store for fashion, beauty, jewellery, and lifestyle products.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <PageHero
                badge="Our Story"
                title="Who We Are"
                subtitle="Pakistan's trusted destination for quality fashion, beauty, and lifestyle products."
            />

            <Container className="py-12 md:py-16">
                <div className="max-w-4xl mx-auto space-y-12">
                    <section className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="relative aspect-[4/3] rounded-[16px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                            <img
                                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800"
                                alt="Panda E-Mart"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-extrabold text-[#1a1a2e]" style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}>
                                Buy Quality Products
                            </h2>
                            <p className="text-[15px] text-gray-500 leading-relaxed">
                                Panda E-Mart was built with one mission: make online shopping in Pakistan simple, affordable, and trustworthy. We curate trending products across fashion, beauty, jewellery, handbags, and home essentials.
                            </p>
                            <p className="text-[15px] text-gray-500 leading-relaxed">
                                Every product is quality-checked before listing. We partner with reliable suppliers to ensure you receive exactly what you ordered — beautifully packaged and delivered on time.
                            </p>
                        </div>
                    </section>

                    <section className="grid sm:grid-cols-3 gap-6">
                        {[
                            { val: '50K+', label: 'Happy Customers' },
                            { val: '500+', label: 'Products Listed' },
                            { val: '100+', label: 'Cities Covered' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center p-6 bg-white rounded-[14px] border border-gray-100 shadow-sm">
                                <p className="text-3xl font-black text-[#e63946]">{stat.val}</p>
                                <p className="text-[12px] text-gray-500 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </section>

                    <section className="space-y-4 text-[15px] text-gray-500 leading-relaxed">
                        <h2 className="text-xl font-extrabold text-[#1a1a2e]" style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}>
                            Our Promise to You
                        </h2>
                        <p>
                            We believe every customer deserves a premium shopping experience — without premium prices. That means fast nationwide delivery, cash on delivery, easy returns, and responsive customer support available around the clock.
                        </p>
                        <p>
                            Whether you are looking for the latest handbag, a stunning jewellery set, or everyday beauty essentials, Panda E-Mart is here to help you shop smart and live better.
                        </p>
                    </section>
                </div>
            </Container>
        </div>
    );
}
