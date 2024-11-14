import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ProModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
}

export const ProModal = ({ isOpen, onCloseAction }: ProModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <DialogOverlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                            />
                        </DialogOverlay>

                        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[500px] translate-x-[-50%] translate-y-[-50%] border-none bg-transparent p-0 shadow-lg">
                            <DialogTitle className="sr-only">Passer à Pro</DialogTitle>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative overflow-hidden rounded-2xl bg-[#1A1A1A] shadow-xl">
                                    <div className="relative h-[180px]">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                                            <div className="absolute inset-0 opacity-[0.15] noise-bg" />
                                            <div className="relative h-full flex items-center justify-center">
                                                <Sparkles className="w-12 h-12 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 pb-6 space-y-6">
                                        <div className="text-center space-y-2 mt-4">
                                            <h3 className="text-2xl font-semibold text-white">Passez à Pro</h3>
                                            <p className="text-gray-400 font-normal">Débloquez toutes les fonctionnalités premium</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                                <span className="text-gray-200 font-normal">Génération illimitée de mémos</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                                <span className="text-gray-200 font-normal">Accès prioritaire</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                                <span className="text-gray-200 font-normal">Support premium</span>
                                            </div>
                                        </div>

                                        <button
                                            className="w-full p-3 rounded-2xl bg-blue-600 text-white font-normal hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Commencer maintenant
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </DialogContent>
                    </>
                )}
            </AnimatePresence>
        </Dialog>
    );
}; 