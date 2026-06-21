export function Skeleton({ className = "", ...props }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-neutral-200/60 ${className}`}
            {...props}
        />
    );
}

export function ProductSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-sm">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-3/4" />
                <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-9 w-24 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export function BlogSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}

export function ProductDetailSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-24" />
            </div>
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
                <Skeleton className="aspect-square w-full rounded-[16px]" />
                <div className="space-y-5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full max-w-md" />
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-12 w-48" />
                    <Skeleton className="h-20 w-full" />
                    <div className="grid grid-cols-2 gap-3">
                        <Skeleton className="h-14 rounded-[10px]" />
                        <Skeleton className="h-14 rounded-[10px]" />
                    </div>
                    <div className="hidden md:flex gap-3">
                        <Skeleton className="h-12 w-32 rounded-[12px]" />
                        <Skeleton className="h-12 flex-1 rounded-[12px]" />
                        <Skeleton className="h-12 flex-1 rounded-[12px]" />
                    </div>
                </div>
            </div>
        </div>
    );
}


