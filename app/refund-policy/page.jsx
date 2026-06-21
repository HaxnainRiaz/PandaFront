import { Container } from '@/components/ui/Container';

export const metadata = {
    title: 'Refund Policy - Panda E-Mart',
};

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="bg-[#1a1a2e] text-white py-16">
                <Container>
                    <h1 className="text-4xl text-white md:text-5xl font-heading font-bold">Refund Policy</h1>
                </Container>
            </div>

            <Container className="py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mb-4">Exchanges & Refunds</h2>
                    <p className="text-[#6b7280] mb-8">
                        We offer a 3-day exchange window from the date of delivery. Refunds or exchanges are only eligible for damaged, defective, or incorrect products.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mb-4">Eligibility Conditions</h2>
                    <p className="text-[#6b7280] mb-4">To be eligible for an exchange or refund:</p>
                    <ul className="list-disc list-inside text-[#6b7280] mb-8 space-y-2">
                        <li>Products must be reported within 3 days of delivery</li>
                        <li>Items must be damaged, defective, or incorrect upon arrival</li>
                        <li>Proof of purchase and photos of the issue are required</li>
                    </ul>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mb-4">How to Request</h2>
                    <p className="text-[#6b7280] mb-4">To initiate a request:</p>
                    <ol className="list-decimal list-inside text-[#6b7280] mb-8 space-y-2">
                        <li>Contact us via email at riazmaria458@gmail.com or WhatsApp at 03174120567</li>
                        <li>Provide your order number and clear photos of the damage/defect</li>
                        <li>Our team will review your request and get back to you within 24–48 hours</li>
                    </ol>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mb-4">Refund Processing</h2>
                    <p className="text-[#6b7280] mb-8">
                        Once we receive your return, we'll inspect the items and process your refund within 5-7 business days. Refunds will be issued to the original payment method.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mb-4">Exchanges</h2>
                    <p className="text-[#6b7280] mb-8">
                        We currently don't offer direct exchanges. If you'd like a different product, please return your original item for a refund and place a new order.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mb-4">Questions?</h2>
                    <p className="text-[#6b7280]">
                        If you have any questions about our policies, please contact us at riazmaria458@gmail.com or WhatsApp: 03174120567
                    </p>
                </div>
            </Container>
        </div>
    );
}
