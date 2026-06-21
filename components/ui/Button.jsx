import { cn } from '@/lib/utils';

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    disabled,
    icon: Icon,
    ...props
}) {
    const base = 'inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e63946] focus-visible:ring-offset-2';

    const variants = {
        primary:  'bg-[#e63946] text-white hover:bg-[#c1121f] shadow-md hover:shadow-lg',
        secondary:'bg-[#1a1a2e] text-white hover:bg-[#16213e] shadow-sm hover:shadow-md',
        outline:  'border-2 border-[#e63946] text-[#e63946] hover:bg-[#e63946] hover:text-white',
        ghost:    'text-[#e63946] hover:bg-[#e63946]/8',
        white:    'bg-white text-[#1a1a2e] hover:bg-gray-50 shadow-sm hover:shadow-md',
        link:     'text-[#e63946] underline-offset-4 hover:underline tracking-normal',
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs rounded-[8px] tracking-wide',
        md: 'px-6 py-2.5 text-sm rounded-[10px] tracking-wide',
        lg: 'px-8 py-3.5 text-sm rounded-[10px] tracking-wide',
    };

    return (
        <button
            className={cn(base, variants[variant], sizes[size], className)}
            disabled={disabled}
            {...props}
        >
            {Icon && <Icon className="mr-2 w-4 h-4" />}
            {children}
        </button>
    );
}
