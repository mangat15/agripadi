import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
    const [language, setLanguage] = useState<'ms' | 'en'>('ms');

    // Load language preference from localStorage on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem('agripadi_language') as 'ms' | 'en' | null;
        if (savedLanguage) {
            setLanguage(savedLanguage);
            document.documentElement.lang = savedLanguage === 'ms' ? 'ms-MY' : 'en-US';
        }
    }, []);

    const toggleLanguage = () => {
        const newLanguage = language === 'ms' ? 'en' : 'ms';
        setLanguage(newLanguage);
        localStorage.setItem('agripadi_language', newLanguage);
        document.documentElement.lang = newLanguage === 'ms' ? 'ms-MY' : 'en-US';

        // Reload page to apply language changes
        window.location.reload();
    };

    return (
        <button
            onClick={toggleLanguage}
            className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-2 border-gray-200 hover:border-gray-300'
            )}
            title={language === 'ms' ? 'Tukar ke English' : 'Switch to Bahasa Melayu'}
        >
            <Globe className="h-5 w-5 text-blue-600" />
            <div className="flex items-center gap-2 flex-1">
                <span className="font-semibold">
                    {language === 'ms' ? 'Bahasa' : 'Language'}
                </span>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
                    <span className={cn(
                        'text-xs font-bold transition-colors',
                        language === 'ms' ? 'text-green-700' : 'text-gray-500'
                    )}>
                        BM
                    </span>
                    <span className="text-xs text-gray-400">|</span>
                    <span className={cn(
                        'text-xs font-bold transition-colors',
                        language === 'en' ? 'text-blue-700' : 'text-gray-500'
                    )}>
                        EN
                    </span>
                </div>
            </div>
        </button>
    );
}
