export const LoadingCard = () => {
    return (
        <div className="relative w-full h-full min-h-[400px]" role="status" aria-live="polite">
            <div className="absolute inset-0 rounded-2xl bg-[#1A1A1A] overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-[2px] flex flex-col items-center justify-center">
                    <div className="w-24 h-5 bg-gradient-to-r from-gray-700/40 via-gray-600/40 to-gray-700/40 rounded-full mb-12" />
                    <div className="space-y-4 w-2/3 max-w-md">
                        <div className="h-6 bg-gradient-to-r from-gray-700/40 via-gray-600/40 to-gray-700/40 rounded-full" />
                        <div className="h-6 bg-gradient-to-r from-gray-700/40 via-gray-600/40 to-gray-700/40 rounded-full w-4/5" />
                        <div className="h-6 bg-gradient-to-r from-gray-700/40 via-gray-600/40 to-gray-700/40 rounded-full w-2/3" />
                    </div>
                </div>
            </div>
        </div>
    );
};