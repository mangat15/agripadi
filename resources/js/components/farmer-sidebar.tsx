import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    BookOpen,
    Camera,
    Bell,
    FileText,
    MessageSquare,
    ThumbsUp,
    Settings,
    LogOut,
    X,
    User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { useLanguage } from '@/contexts/LanguageContext';

const farmerNavItems = [
    {
        titleKey: 'nav.dashboard',
        href: '/farmer/dashboard',
        icon: LayoutGrid,
        section: 'main',
    },
    {
        titleKey: 'nav.learning',
        href: '/farmer/learning',
        icon: BookOpen,
        section: 'learning',
    },
    {
        titleKey: 'nav.virtualTour',
        href: '/farmer/virtual-tour',
        icon: Camera,
        section: 'learning',
    },
    {
        titleKey: 'nav.announcements',
        href: '/farmer/announcements',
        icon: Bell,
        section: 'communication',
    },
    {
        titleKey: 'nav.reports',
        href: '/farmer/reports',
        icon: FileText,
        section: 'communication',
    },
    {
        titleKey: 'nav.forum',
        href: '/farmer/forum',
        icon: MessageSquare,
        section: 'communication',
    },
    {
        titleKey: 'nav.feedback',
        href: '/farmer/feedback',
        icon: ThumbsUp,
        section: 'communication',
    },
];

interface FarmerSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function FarmerSidebar({ isOpen = true, onClose }: FarmerSidebarProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const currentPath = page.url as string;
    const getInitials = useInitials();
    const { t } = useLanguage();

    // Group navigation items by section
    const mainItems = farmerNavItems.filter(item => item.section === 'main');
    const learningItems = farmerNavItems.filter(item => item.section === 'learning');
    const communicationItems = farmerNavItems.filter(item => item.section === 'communication');

    const renderNavItem = (item: typeof farmerNavItems[0]) => {
        const Icon = item.icon;
        const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');

        return (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                        ? 'bg-green-100 text-green-800 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
            >
                <Icon className={cn(
                    'h-5 w-5 transition-transform duration-200',
                    isActive && 'scale-110'
                )} />
                <span className="flex-1">{t(item.titleKey)}</span>
                {isActive && (
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
                )}
            </Link>
        );
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "w-72 bg-gradient-to-b from-emerald-50/80 via-green-50/50 to-white border-r border-green-200/50 flex flex-col shadow-lg",
                "fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* Close button for mobile */}
                <div className="lg:hidden p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="font-bold text-gray-900">{t('menu')}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label={t('closeMenu')}
                    >
                        <X className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                {/* User Info - Improved with role badge */}
                <div className="p-5 border-b border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-green-200 ring-offset-2">
                            <AvatarImage
                                src={auth.user.profile_picture ? `/storage/${auth.user.profile_picture}` : undefined}
                                alt={auth.user.name}
                            />
                            <AvatarFallback className="rounded-full bg-green-600 text-white text-base font-bold">
                                {getInitials(auth.user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-gray-900 truncate">{auth.user.name}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <User className="h-3.5 w-3.5 text-green-600" />
                                <span className="text-xs font-semibold text-green-700">{t('role.farmer')}</span>
                            </div>
                        </div>
                    </div>
                    {auth.user.location && (
                        <div className="bg-white/60 rounded-lg px-3 py-1.5 text-xs text-gray-700 truncate border border-green-100">
                            📍 {auth.user.location}
                        </div>
                    )}
                </div>

                {/* Navigation - Grouped with clear sections */}
                <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                    {/* Main Section */}
                    <div className="space-y-1">
                        {mainItems.map(renderNavItem)}
                    </div>

                    {/* Learning Section */}
                    <div className="space-y-2">
                        <div className="px-4 py-2">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {t('nav.learningSection')}
                            </h3>
                        </div>
                        <div className="space-y-1">
                            {learningItems.map(renderNavItem)}
                        </div>
                    </div>

                    {/* Communication Section */}
                    <div className="space-y-2">
                        <div className="px-4 py-2">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {t('nav.communicationSection')}
                            </h3>
                        </div>
                        <div className="space-y-1">
                            {communicationItems.map(renderNavItem)}
                        </div>
                    </div>
                </nav>

                {/* Bottom Actions - Improved with better visual hierarchy */}
                <div className="p-4 border-t border-gray-200 space-y-2 bg-gray-50">
                    <Link
                        href="/settings/profile"
                        className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                            currentPath.startsWith('/settings')
                                ? 'bg-green-100 text-green-800 shadow-sm'
                                : 'text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                        )}
                    >
                        <Settings className="h-5 w-5" />
                        <span>{t('nav.settings')}</span>
                    </Link>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 hover:shadow-sm group"
                    >
                        <LogOut className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                        <span className="flex-1 text-left">{t('logout')}</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
