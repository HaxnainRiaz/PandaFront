'use client';
//testing
import { useState } from 'react';
import { useStoreAuth } from '@/context/StoreAuthContext';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function StoreLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useStoreAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="bg-[#e5e7eb]/30 flex items-center">
            <Container className="py-3 md:py-6 max-w-[500px] w-full mx-auto lg:py-8">
                <div className="bg-white p-4 rounded-[2rem] shadow-[0_4px_20px_rgba(11,47,38,0.08)] border border-[#e5e7eb] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#1a1a2e]/20" />

                    <div className="text-center">
                        <h1 className="text-3xl font-heading font-bold text-[#1a1a2e]">Welcome Back</h1>
                        <p className="text-sm text-[#6b7280]">Sign in to your Panda E-Mart account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold text-center">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            icon={Mail}
                        />

                        <Input
                            label="Password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            icon={Lock}
                        />
                        <div className="flex justify-end">
                            <button type="button" className="text-xs text-[#5e5e5d] font-medium hover:underline">Forgot password?</button>
                        </div>

                        <Button type="submit" className="w-full rounded-2xl py-3 text-base font-bold shadow-lg shadow-[#1a1a2e]/10">
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-[#e5e7eb] text-center">
                        <p className="text-sm text-[#6b7280] mb-4">Don't have an account?</p>
                        <Link href="/account/register">
                            <button className="flex items-center gap-2 mx-auto text-[#1a1a2e] font-bold hover:gap-3 transition-all">
                                Create Account <ArrowRight size={16} />
                            </button>
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
}
