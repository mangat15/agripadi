import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageSwitcherHeader() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        const newLanguage = language === 'ms' ? 'en' : 'ms';
        setLanguage(newLanguage);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-700 hover:bg-green-800 transition-all duration-200 shadow-sm hover:shadow-md"
            title={language === 'ms' ? 'Switch to English' : 'Tukar ke Bahasa Melayu'}
        >
            <Globe className="h-5 w-5 text-white" />
            <div className="flex items-center gap-1.5 bg-white/20 rounded-md px-2 py-0.5">
                <span className={cn(
                    'text-xs font-bold transition-all duration-200',
                    language === 'ms' ? 'text-white scale-110' : 'text-white/60 scale-95'
                )}>
                    BM
                </span>
                <span className="text-xs text-white/40">|</span>
                <span className={cn(
                    'text-xs font-bold transition-all duration-200',
                    language === 'en' ? 'text-white scale-110' : 'text-white/60 scale-95'
                )}>
                    EN
                </span>
            </div>
        </button>
    );
}
