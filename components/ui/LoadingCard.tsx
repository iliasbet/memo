export const LoadingCard = () => {
    return (
        <div className="relative w-full h-full" role="status" aria-live="polite">
            <div className="absolute inset-0 rounded-2xl bg-[#1A1A1A] overflow-hidden">
                {/* Effet de pulse pour le type */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-700 rounded animate-pulse" />

                {/* Effet de loading pour le contenu */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4">
                    <div className="h-4 bg-gray-700 rounded mb-3 animate-pulse" />
                    <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse" />
                </div>

                {/* Effet de shine */}
                <div className="absolute inset-0 loading-shine" />
            </div>
        </div>
    );
}; 