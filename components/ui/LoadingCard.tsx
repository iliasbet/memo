interface LoadingCardProps {
    content?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ content }) => {
    return (
        <div className="relative w-full min-h-[400px]" role="status" aria-live="polite">
            <div className="absolute inset-0 rounded-2xl bg-[#1A1A1A] overflow-hidden">
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-24 h-5 bg-gradient-to-r from-gray-700/40 to-gray-600/40 rounded-full mb-12" />
                    <div className="space-y-4 w-2/3 max-w-md">
                        {content ? (
                            <div className="text-gray-400 text-center">{content}</div>
                        ) : (
                            <>
                                <div className="h-6 bg-gradient-to-r from-gray-700/40 to-gray-600/40 rounded-full" />
                                <div className="h-6 bg-gradient-to-r from-gray-700/40 to-gray-600/40 rounded-full w-4/5" />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};