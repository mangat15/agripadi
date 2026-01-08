import FarmerSidebarLayout from '@/layouts/app/farmer-sidebar-layout';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Camera,
    Bell,
    FileText,
    MessageSquare,
    ThumbsUp,
    Users,
    TrendingUp,
    ChevronRight,
    ArrowRight,
} from 'lucide-react';
import { SharedData } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Stats {
    learning_materials: number;
    active_farmers: number;
    forum_topics: number;
}

interface RecentActivity {
    title: string;
    time: string;
    type: 'learning' | 'forum' | 'announcement';
    href?: string;
}

interface DashboardProps extends SharedData {
    stats: Stats;
    recentActivities: RecentActivity[];
    pendingReports?: number;
    unreadAnnouncements?: number;
}

interface ModuleTileProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    bgColor: string;
    iconColor: string;
}

function ModuleTile({ title, description, icon, href, bgColor, iconColor }: ModuleTileProps) {
    const { t } = useLanguage();

    return (
        <Link
            href={href}
            className={`${bgColor} rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer block group transform hover:-translate-y-1 border border-transparent hover:border-gray-200`}
        >
            <div className="flex flex-col items-start text-left space-y-4">
                <div className={`w-14 h-14 flex items-center justify-center ${iconColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-base text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {description}
                    </p>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium mt-2 group-hover:translate-x-1 transition-transform">
                    <span>{t('actions.accessNow')}</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                </div>
            </div>
        </Link>
    );
}

interface StatCardProps {
    title: string;
    count: number;
    description: string;
    icon: React.ReactNode;
    bgColor: string;
    href?: string;
}

function StatCard({ title, count, description, icon, bgColor, href }: StatCardProps) {
    const { t } = useLanguage();

    const content = (
        <>
            <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-white text-base">{title}</h3>
                <div className="bg-white/30 p-2.5 rounded-xl backdrop-blur-sm">
                    {icon}
                </div>
            </div>
            <div className="text-5xl font-extrabold text-white mb-2 tracking-tight">{count}</div>
            <p className="text-white/95 text-sm font-medium">{description}</p>
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                className={`${bgColor} rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer block group transform hover:-translate-y-1`}
            >
                {content}
                <div className="flex items-center text-white/90 text-sm font-medium mt-4 group-hover:translate-x-1 transition-transform">
                    <span>{t('actions.viewAll')}</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                </div>
            </Link>
        );
    }

    return (
        <div className={`${bgColor} rounded-xl p-6 shadow-md`}>
            {content}
        </div>
    );
}

interface RecentActivityProps {
    title: string;
    time: string;
    icon: React.ReactNode;
    bgColor: string;
    borderColor: string;
    href?: string;
}

function RecentActivity({ title, time, icon, bgColor, borderColor, href }: RecentActivityProps) {
    const content = (
        <div className={`${bgColor} ${borderColor} border-l-4 rounded-xl p-5 flex items-start gap-4 group-hover:shadow-md transition-all duration-200`}>
            <div className="mt-0.5 flex-shrink-0">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 mb-1 line-clamp-2">{title}</p>
                <p className="text-sm text-gray-600 font-medium">{time}</p>
            </div>
            {href && (
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
            )}
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block group">
                {content}
            </Link>
        );
    }

    return content;
}

// Utility function to format time based on current language
function formatTime(timeString: string, language: 'ms' | 'en'): string {
    const match = timeString.match(/(\d+)\s*(month|day|hour|minute)s?\s*ago/i);

    if (match) {
        const value = match[1];
        const unit = match[2].toLowerCase();

        if (language === 'ms') {
            const unitMap: Record<string, string> = {
                'month': value === '1' ? 'bulan lalu' : `${value} bulan lalu`,
                'day': value === '1' ? 'hari lalu' : `${value} hari lalu`,
                'hour': value === '1' ? 'jam lalu' : `${value} jam lalu`,
                'minute': value === '1' ? 'minit lalu' : `${value} minit lalu`,
            };
            return unitMap[unit] || timeString;
        }
        // English - return as is
        return timeString;
    }

    return timeString;
}

export default function FarmerDashboard() {
    const { auth, stats, recentActivities, pendingReports = 0, unreadAnnouncements = 0 } = usePage<DashboardProps>().props;
    const userName = auth.user.name;
    const { t, language } = useLanguage();

    const modules = [
        {
            title: t('modules.learning'),
            description: t('modules.learning.desc'),
            icon: <BookOpen className="h-7 w-7 text-white" />,
            href: '/farmer/learning',
            bgColor: 'bg-blue-50',
            iconColor: 'bg-blue-500',
        },
        {
            title: t('modules.virtualTour'),
            description: t('modules.virtualTour.desc'),
            icon: <Camera className="h-7 w-7 text-white" />,
            href: '/farmer/virtual-tour',
            bgColor: 'bg-purple-50',
            iconColor: 'bg-purple-500',
        },
        {
            title: t('modules.announcements'),
            description: t('modules.announcements.desc'),
            icon: <Bell className="h-7 w-7 text-white" />,
            href: '/farmer/announcements',
            bgColor: 'bg-yellow-50',
            iconColor: 'bg-yellow-500',
        },
        {
            title: t('modules.reports'),
            description: t('modules.reports.desc'),
            icon: <FileText className="h-7 w-7 text-white" />,
            href: '/farmer/reports',
            bgColor: 'bg-red-50',
            iconColor: 'bg-red-500',
        },
        {
            title: t('modules.forum'),
            description: t('modules.forum.desc'),
            icon: <MessageSquare className="h-7 w-7 text-white" />,
            href: '/farmer/forum',
            bgColor: 'bg-green-50',
            iconColor: 'bg-green-500',
        },
        {
            title: t('modules.feedback'),
            description: t('modules.feedback.desc'),
            icon: <ThumbsUp className="h-7 w-7 text-white" />,
            href: '/farmer/feedback',
            bgColor: 'bg-blue-50',
            iconColor: 'bg-blue-600',
        },
    ];

    const statsCards = [
        {
            title: t('stats.materialsAvailable'),
            count: stats.learning_materials,
            description: t('stats.videosDocuments'),
            icon: <BookOpen className="h-7 w-7 text-white" />,
            bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
            href: '/farmer/learning',
        },
        {
            title: t('stats.communityMembers'),
            count: stats.active_farmers,
            description: t('stats.activeFarmers'),
            icon: <Users className="h-7 w-7 text-white" />,
            bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
            href: '/farmer/forum',
        },
        {
            title: t('stats.forumTopics'),
            count: stats.forum_topics,
            description: t('stats.discussions'),
            icon: <TrendingUp className="h-7 w-7 text-white" />,
            bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
            href: '/farmer/forum',
        },
    ];

    const getActivityIcon = (type: 'learning' | 'forum' | 'announcement') => {
        switch (type) {
            case 'learning':
                return <BookOpen className="h-5 w-5 text-yellow-600" />;
            case 'forum':
                return <MessageSquare className="h-5 w-5 text-green-600" />;
            case 'announcement':
                return <Bell className="h-5 w-5 text-blue-600" />;
        }
    };

    const getActivityColors = (type: 'learning' | 'forum' | 'announcement') => {
        switch (type) {
            case 'learning':
                return { bgColor: 'bg-yellow-50/80', borderColor: 'border-yellow-400' };
            case 'forum':
                return { bgColor: 'bg-green-50/80', borderColor: 'border-green-400' };
            case 'announcement':
                return { bgColor: 'bg-blue-50/80', borderColor: 'border-blue-400' };
        }
    };

    const getActivityHref = (type: 'learning' | 'forum' | 'announcement') => {
        switch (type) {
            case 'learning':
                return '/farmer/learning';
            case 'forum':
                return '/farmer/forum';
            case 'announcement':
                return '/farmer/announcements';
        }
    };

    const activitiesWithStyles = recentActivities.map(activity => ({
        ...activity,
        time: formatTime(activity.time, language),
        icon: getActivityIcon(activity.type),
        ...getActivityColors(activity.type),
        href: activity.href || getActivityHref(activity.type),
    }));

    return (
        <FarmerSidebarLayout
            breadcrumbs={[{ title: t('nav.dashboard'), href: '/farmer/dashboard' }]}
        >
            <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
                {/* Page Title - Improved hierarchy */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        {t('farmer.dashboard.title')}
                    </h1>
                </div>
                {/* Welcome Banner - Improved with clear CTA and summary */}
                <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 rounded-2xl p-6 lg:p-8 shadow-lg text-white relative overflow-hidden">
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white rounded-full"></div>
                        <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-white rounded-full"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex-1">
                                <h2 className="text-2xl lg:text-3xl font-bold mb-3">
                                    {t('farmer.dashboard.welcome').replace('{name}', userName)}
                                </h2>
                                <p className="text-green-50 text-base lg:text-lg mb-6 leading-relaxed">
                                    {t('farmer.dashboard.description')}
                                </p>

                                {/* Quick Summary - Improved CTA replacement */}
                                <div className="flex flex-wrap gap-4 lg:gap-6">
                                    {pendingReports > 0 && (
                                        <Link
                                            href="/farmer/reports"
                                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2.5 rounded-xl transition-all duration-200 border border-white/30"
                                        >
                                            <FileText className="h-5 w-5" />
                                            <span className="font-semibold text-sm">
                                                {pendingReports} {t('farmer.dashboard.pendingReports')}
                                            </span>
                                        </Link>
                                    )}
                                    {unreadAnnouncements > 0 && (
                                        <Link
                                            href="/farmer/announcements"
                                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2.5 rounded-xl transition-all duration-200 border border-white/30"
                                        >
                                            <Bell className="h-5 w-5" />
                                            <span className="font-semibold text-sm">
                                                {unreadAnnouncements} {t('farmer.dashboard.unreadAnnouncements')}
                                            </span>
                                        </Link>
                                    )}
                                    <Link
                                        href="/farmer/learning"
                                        className="flex items-center gap-2 bg-white hover:bg-white/95 text-green-700 px-5 py-2.5 rounded-xl transition-all duration-200 font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <BookOpen className="h-5 w-5" />
                                        <span>{t('farmer.dashboard.startLearning')}</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden lg:block">
                                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30">
                                    <TrendingUp className="h-16 w-16 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Stats Cards - Improved with better accessibility */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                        <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                        {t('farmer.dashboard.statistics')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
                        {statsCards.map((stat) => (
                            <StatCard
                                key={stat.title}
                                title={stat.title}
                                count={stat.count}
                                description={stat.description}
                                icon={stat.icon}
                                bgColor={stat.bgColor}
                                href={stat.href}
                            />
                        ))}
                    </div>
                </div>

                {/* Visual Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Module Tiles Grid - Improved spacing and hierarchy */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                        <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                        {t('farmer.dashboard.quickAccess')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                        {modules.map((module) => (
                            <ModuleTile
                                key={module.title}
                                title={module.title}
                                description={module.description}
                                icon={module.icon}
                                href={module.href}
                                bgColor={module.bgColor}
                                iconColor={module.iconColor}
                            />
                        ))}
                    </div>
                </div>

                {/* Visual Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Recent Activities - Improved with BM time and better interaction */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                            {t('farmer.dashboard.recentUpdates')}
                        </h2>
                        <Link
                            href="/farmer/announcements"
                            className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-1 transition-colors"
                        >
                            {t('farmer.dashboard.viewAll')}
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {activitiesWithStyles.length > 0 ? (
                        <div className="space-y-3">
                            {activitiesWithStyles.map((activity, index) => (
                                <RecentActivity
                                    key={index}
                                    title={activity.title}
                                    time={activity.time}
                                    icon={activity.icon}
                                    bgColor={activity.bgColor}
                                    borderColor={activity.borderColor}
                                    href={activity.href}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl p-8 text-center">
                            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium">{t('farmer.dashboard.noUpdates')}</p>
                            <p className="text-gray-500 text-sm mt-1">{t('farmer.dashboard.checkLater')}</p>
                        </div>
                    )}
                </div>
            </div>
        </FarmerSidebarLayout>
    );
}
