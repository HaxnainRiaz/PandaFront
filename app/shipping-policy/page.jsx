import { Container } from '@/components/ui/Container';

export const metadata = {
    title: 'Shipping Policy - Panda E-Mart',
};

export default function ShippingPolicyPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="bg-[#1a1a2e] text-white py-16">
                <Container>
                    <h1 className="text-4xl text-white md:text-5xl font-heading font-bold">Shipping Policy</h1>
                </Container>
            </div>

            <Container className="py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mb-4">Shipping Methods & Costs</h2>
                    <ul className="list-disc list-inside text-[#6b7280] mb-8 space-y-2">
                        <li><strong>Standard Delivery:</strong> 3–7 business days</li>
                        <li><strong>Processing Time:</strong> 1–2 business days</li>
                        <li><strong>Shipping Charges:</strong> Calculated at checkout</li>
                    </ul>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mb-4">Delivery Timeline</h2>
                    <p className="text-[#6b7280] mb-8">
                        Once your order is processed (1–2 business days), delivery typicaly takes 3–7 business days depending on your location.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mb-4">International Shipping</h2>
                    <p className="text-[#6b7280] mb-8">
                        We currently ship to the United States and Canada. International shipping rates and delivery times vary by location.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mb-4">Order Tracking</h2>
                    <p className="text-[#6b7280] mb-8">
                        Once your order ships, you'll receive a confirmation email with tracking information. You can track your package using the provided tracking number.
                    </p>

                    <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] mb-4">Delivery Issues</h2>
                    <p className="text-[#6b7280]">
                        If your order hasn't arrived within the estimated delivery time, please contact us at riazmaria458@gmail.com and we'll help resolve the issue.
                    </p>
                </div>
            </Container>
        </div>
    );
}
