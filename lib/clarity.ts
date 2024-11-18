export function initClarity() {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_CLARITY_ID) {
        const clarity = window.clarity || function (...args: any[]) {
            (window.clarity.q = window.clarity.q || []).push(args);
        };
        window.clarity = clarity;

        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.clarity.ms/tag/' + process.env.NEXT_PUBLIC_CLARITY_ID;

        const firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(script, firstScript);
        }
    }
}

// Ajout du type pour window
declare global {
    interface Window {
        clarity: {
            q?: any[];
            (...args: any[]): void;
        };
    }
}
