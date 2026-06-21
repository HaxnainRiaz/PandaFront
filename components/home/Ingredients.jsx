import { Container } from '@/components/ui/Container';

export default function Ingredients() {
    const ingredients = [
        {
            name: "Kojic Acid",
            benefit: "Melanin-inhibiting brightener",
            description: "Helps fade dark spots and even skin tone for a clearer complexion."
        },
        {
            name: "Aloe Vera",
            benefit: "Soothing & Hydrating",
            description: "A natural healer that helps calm skin and support a natural, healthy glow."
        },
        {
            name: "Kalonji (Black Seed)",
            benefit: "Antioxidant-rich repairer",
            description: "Helps strengthen skin and reduce inflammation with powerful nutrients."
        },
        {
            name: "Neem",
            benefit: "Purifying antibacterial",
            description: "Helps clear breakouts and balance skin for a refreshed feel."
        },
        {
            name: "Witch Hazel Oil",
            benefit: "Pore-tightening astringent",
            description: "Helps control oil and soothe skin while refining your skin's texture."
        },
        {
            name: "Licorice Root Extract",
            benefit: "Natural Radiance Powerhouse",
            description: "Brightens skin and reduces dullness to restore your natural glow."
        }
    ];

    return (
        <section className="section-padding bg-white">
            <Container>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#1a1a2e] mb-6">
                            Powered by Nature's Finest
                        </h2>
                        <p className="text-lg text-[#6b7280] mb-8">
                            We carefully select premium botanical ingredients backed by science to deliver visible results. Each formula is crafted with intention and care.
                        </p>

                        <div className="space-y-6">
                            {ingredients.map((ingredient) => (
                                <div key={ingredient.name} className="border-l-4 border-[#d3d3d3] pl-6">
                                    <h3 className="text-xl font-heading font-semibold text-[#1a1a2e] mb-1">
                                        {ingredient.name}
                                    </h3>
                                    <p className="text-[#f4a261] font-medium mb-2">
                                        {ingredient.benefit}
                                    </p>
                                    <p className="text-[#6b7280]">
                                        {ingredient.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square bg-[linear-gradient(135deg,#d3d3d31A_0%,#1a1a2e0D_100%)] rounded-3xl p-8 flex items-center justify-center">
                            <div className="text-center">
                                <div className="flex justify-center mb-6">
                                    <svg className="w-16 h-16 text-[#1a1a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
                                    </svg>
                                </div>
                                <p className="text-2xl font-heading font-semibold text-[#1a1a2e] mb-2">
                                    100% Natural Ingredients
                                </p>
                                <p className="text-[#6b7280]">
                                    Sustainably sourced from around the world
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
