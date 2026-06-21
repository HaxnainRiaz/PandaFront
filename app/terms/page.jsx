import { Container } from '@/components/ui/Container';

export const metadata = {
    title: 'Terms of Service - Panda E-Mart',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="bg-[#1a1a2e] text-white py-16">
                <Container>
                    <h1 className="text-4xl text-white md:text-5xl font-heading font-bold">Terms of Service</h1>
                </Container>
            </div>

            <Container className="py-16">
                <div className="max-w-4xl mx-auto prose prose-lg">
                    <p className="text-[#6b7280] mb-6">Last updated: January 2026</p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mt-8 mb-4">1. Agreement to Terms</h2>
                    <p className="text-[#6b7280] mb-6">
                        By accessing and using Panda E-Mart's website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mt-8 mb-4">2. Use License</h2>
                    <p className="text-[#6b7280] mb-6">
                        Permission is granted to temporarily download one copy of the materials on Panda E-Mart's website for personal, non-commercial transitory viewing only.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mt-8 mb-4">3. Product Information</h2>
                    <p className="text-[#6b7280] mb-6">
                        We strive to provide accurate product information. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mt-8 mb-4">4. Pricing</h2>
                    <p className="text-[#6b7280] mb-6">
                        All prices are in USD and are subject to change without notice. We reserve the right to modify or discontinue products without prior notice.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mt-8 mb-4">5. Account Terms</h2>
                    <p className="text-[#6b7280] mb-6">
                        You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mt-8 mb-4">6. Prohibited Uses</h2>
                    <p className="text-[#6b7280] mb-6">
                        You may not use our website for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction when using our service.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mt-8 mb-4">7. Limitation of Liability</h2>
                    <p className="text-[#6b7280] mb-6">
                        Panda E-Mart shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mt-8 mb-4">8. Contact Information</h2>
                    <p className="text-[#6b7280]">
                        For questions about these Terms of Service, please contact us at riazmaria458@gmail.com
                    </p>
                </div>
            </Container>
        </div>
    );
}
