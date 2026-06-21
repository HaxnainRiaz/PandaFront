import { Container } from '@/components/ui/Container';

export default function PageHero({ title, subtitle, badge, children }) {
    return (
        <div className="relative overflow-hidden bg-[#1a1a2e] text-white py-12 md:py-16">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#e63946]/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#2d3561]/50 rounded-full blur-[100px]" />
            </div>
            <Container className="relative z-10">
                {badge && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider text-[#f4a261] border border-[#f4a261]/25 bg-[#f4a261]/10 mb-4">
                        {badge}
                    </span>
                )}
                <h1
                    className="text-3xl md:text-5xl font-extrabold text-white leading-tight"
                    style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}
                >
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-base md:text-lg text-white/75 mt-3 max-w-2xl leading-relaxed">
                        {subtitle}
                    </p>
                )}
                {children}
            </Container>
        </div>
    );
}
