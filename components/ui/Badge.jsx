import { cn } from '@/lib/utils';

export function Badge({ children, variant = 'default', className }) {
    const variants = {
        default:   'bg-[#1a1a2e] text-white',
        primary:   'bg-[#e63946] text-white',
        secondary: 'bg-[#f4a261] text-white',
        success:   'bg-[#10b981] text-white',
        warning:   'bg-[#f59e0b] text-white',
        danger:    'bg-[#dc2626] text-white',
        sale:      'bg-[#e63946] text-white',
        new:       'bg-[#2d3561] text-white',
        outline:   'border border-[#e63946] text-[#e63946] bg-transparent',
    };

    return (
        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-[11px] font-bold tracking-wide', variants[variant], className)}>
            {children}
        </span>
    );
}
