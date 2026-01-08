import { cn, isSameUrl, resolveUrl } from '@/lib/utils';
import { edit } from '@/routes/profile';
import { edit as editPassword } from '@/routes/user-password';
import { type NavItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AppSidebarHeader } from '@/components/app-sidebar-header';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { t } = useLanguage();

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    const sidebarNavItems: NavItem[] = [
        {
            title: t('settings.tabs.profile'),
            href: edit(),
            icon: null,
        },
        {
            title: t('settings.tabs.password'),
            href: editPassword(),
            icon: null,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-green-100/50">
            {/* Header */}
            <AppSidebarHeader />

            {/* Content */}
            <div className="w-full px-6 py-6">
                {/* Back to Dashboard Button */}
                <div className="mb-6">
                    <button
                        onClick={() => router.visit('/dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t('settings.backToDashboard')}
                    </button>
                </div>

                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{t('settings.title')}</h1>
                    <p className="text-gray-600 mt-1">{t('settings.description')}</p>
                </div>

                {/* Settings Tabs */}
                <div className="mb-8">
                    <nav className="flex space-x-4 border-b">
                        {sidebarNavItems.map((item, index) => (
                            <Link
                                key={`${resolveUrl(item.href)}-${index}`}
                                href={item.href}
                                className={cn(
                                    'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                                    {
                                        'border-green-600 text-green-600': isSameUrl(
                                            currentPath,
                                            item.href,
                                        ),
                                        'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300': !isSameUrl(
                                            currentPath,
                                            item.href,
                                        ),
                                    }
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <section className="space-y-12">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
