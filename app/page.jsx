import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/home/FeaturedProducts';

const PromoBanner = dynamic(() => import('@/components/home/PromoBanner'));
const Bestsellers = dynamic(() => import('@/components/home/Bestsellers'));
const Benefits = dynamic(() => import('@/components/home/Benefits'));
const Testimonials = dynamic(() => import('@/components/home/Testimonials'));
const BrandStory = dynamic(() => import('@/components/home/BrandStory'));
const FAQ = dynamic(() => import('@/components/home/FAQ'));
const Newsletter = dynamic(() => import('@/components/home/Newsletter'));

export const metadata = {
    title: 'Panda E-Mart — Shop Smart, Live Better',
    description: 'Discover trending fashion, beauty, jewellery, handbags, and lifestyle products at unbeatable prices. Free shipping on orders over Rs. 4,999.',
};

export default function HomePage() {
    return (
        <>
            <Hero />
            <Categories />
            <FeaturedProducts />
            <PromoBanner />
            <Bestsellers />
            <Benefits />
            <Testimonials />
            <BrandStory />
            <FAQ />
            <Newsletter />
        </>
    );
}
