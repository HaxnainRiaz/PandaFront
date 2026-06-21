import { Container } from '@/components/ui/Container';

export const metadata = {
    title: 'Privacy Policy - Panda E-Mart',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="bg-[#1a1a2e] text-white py-16">
                <Container>
                    <h1 className="text-4xl text-white md:text-5xl font-heading font-bold">Privacy Policy</h1>
                </Container>
            </div>

            <Container className="py-16">
                <div className="max-w-4xl mx-auto">
                    <p className="text-[#6b7280] mb-6">Last updated: January 2026</p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mt-8 mb-4">Information We Collect</h2>
                    <p className="text-[#6b7280] mb-6">
                        We collect information you provide directly to us, including name, email address, shipping address, payment information, and any other information you choose to provide.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mt-8 mb-4">How We Use Your Information</h2>
                    <p className="text-[#6b7280] mb-4">We use the information we collect to:</p>
                    <ul className="list-disc list-inside text-[#6b7280] mb-6 space-y-2">
                        <li>Process and fulfill your orders</li>
                        <li>Send you order confirmations and updates</li>
                        <li>Respond to your comments and questions</li>
                        <li>Send you marketing communications (with your consent)</li>
                        <li>Improve our products and services</li>
                    </ul>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mt-8 mb-4">Information Sharing</h2>
                    <p className="text-[#6b7280] mb-6">
                        We do not sell or rent your personal information to third parties. We may share your information with service providers who assist us in operating our website and conducting our business.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mt-8 mb-4">Data Security</h2>
                    <p className="text-[#6b7280] mb-6">
                        We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mt-8 mb-4">Your Rights</h2>
                    <p className="text-[#6b7280] mb-6">
                        You have the right to access, update, or delete your personal information. You may also opt out of marketing communications at any time.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mt-8 mb-4">Contact Us</h2>
                    <p className="text-[#6b7280]">
                        If you have questions about this Privacy Policy, please contact us at riazmaria458@gmail.com
                    </p>
                </div>
            </Container>
        </div>
    );
}
