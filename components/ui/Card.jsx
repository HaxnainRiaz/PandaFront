import { cn } from '@/lib/utils';

export function Card({ children, className, hover = false, ...props }) {
    return (
        <div
            className={cn(
                'bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.07)] overflow-hidden border border-gray-100/80',
                hover && 'transition-all duration-300 hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)] hover:-translate-y-1',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }) {
    return <div className={cn('p-5', className)}>{children}</div>;
}

export function CardBody({ children, className }) {
    return <div className={cn('p-5 pt-0', className)}>{children}</div>;
}

export function CardFooter({ children, className }) {
    return <div className={cn('p-5 pt-0', className)}>{children}</div>;
}
