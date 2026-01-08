import AdminSidebarLayout from '@/layouts/app/admin-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Users,
    FileText,
    MessageSquare,
    AlertCircle,
    CheckCircle,
    Clock,
    TrendingUp,
    Eye,
    ChevronRight,
    Bell,
    BookOpen,
    ArrowRight,
    ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface SystemStats {
    totalUsers: number;
    totalFarmers: number;
    totalAdmins: number;
    pendingReports: number;
    inReviewReports: number;
    resolvedReports: number;
    forumPosts: number;
    learningMaterials: number;
    pendingForumPosts: number;
    publishedAnnouncements: number;
}

interface PendingReport {
    id: number;
    title: string;
    farmer: string;
    priority: string;
    date: string;
}

interface RecentUser {
    name: string;
    role: string;
    date: string;
}

interface AdminDashboardProps extends SharedData {
    systemStats: SystemStats;
    pendingReports: PendingReport[];
    recentUsers: RecentUser[];
}

// Utility function to format dates based on language
function formatDate(dateString: string, _language: 'ms' | 'en'): string {
    const match = dateString.match(/(\d+)\s*(day|hour|minute|month)s?\s*ago/i);

    if (match) {
        const value = match[1];
        const unit = match[2].toLowerCase();

        if (_language === 'ms') {
            const unitMap: Record<string, string> = {
                'month': value === '1' ? 'bulan lalu' : `${value} bulan lalu`,
                'day': value === '1' ? 'hari lalu' : `${value} hari lalu`,
                'hour': value === '1' ? 'jam lalu' : `${value} jam lalu`,
                'minute': value === '1' ? 'minit lalu' : `${value} minit lalu`,
            };
            return unitMap[unit] || dateString;
        }
        // English - return as is
        return dateString;
    }

    return dateString;
}

// Utility function to format role names based on language
function formatRoleName(role: string, _language: 'ms' | 'en'): string {
    const roleKey = role.toLowerCase() === 'farmer' || role.toLowerCase() === 'petani'
        ? 'role.farmerShort'
        : 'role.adminShort';

    // This will be handled by translation context
    return roleKey;
}

export default function AdminDashboard() {
    const { systemStats, pendingReports, recentUsers } = usePage<AdminDashboardProps>().props;
    const { t } = useLanguage();

    // Calculate total action items requiring attention
    const hasUrgentItems = systemStats.pendingReports > 0;

    return (
        <AdminSidebarLayout
            breadcrumbs={[{ title: t('nav.dashboard'), href: '/admin/dashboard' }]}
        >
            <div className="mx-auto w-full max-w-7xl space-y-8 p-6 lg:p-8">
                {/* Page Header with Admin Context */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-8 w-8 text-green-600" />
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                {t('admin.dashboard.title')}
                            </h1>
                            <p className="text-gray-600 mt-1 text-base">
                                {t('admin.dashboard.subtitle')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Urgent Action Alert - Only shows when there are pending items */}
                {hasUrgentItems && (
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-5 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="bg-red-100 p-2.5 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-red-900 text-lg">
                                    {systemStats.pendingReports} {t('admin.dashboard.urgentAction')}
                                </h3>
                                <p className="text-red-700 text-sm mt-1">
                                    {t('admin.dashboard.urgentDescription')}
                                </p>
                            </div>
                            <Button
                                asChild
                                className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all"
                            >
                                <Link href="/admin/reports">
                                    {t('admin.dashboard.reviewNow')}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Priority Action Cards - Reordered to show urgent items first */}
                <div>
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {t('admin.dashboard.priorityActions')}
                        </h2>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {/* Pending Reports - PRIORITY 1 */}
                        <Link href="/admin/reports">
                            <Card className={cn(
                                "cursor-pointer transition-all duration-300 hover:shadow-xl border-2",
                                systemStats.pendingReports > 0
                                    ? "border-red-200 bg-gradient-to-br from-red-50 to-orange-50 hover:border-red-300"
                                    : "border-gray-200 hover:border-gray-300"
                            )}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-bold text-gray-700">
                                        {t('admin.dashboard.pendingReports')}
                                    </CardTitle>
                                    <div className={cn(
                                        "p-2.5 rounded-xl",
                                        systemStats.pendingReports > 0 ? "bg-red-100" : "bg-gray-100"
                                    )}>
                                        <Clock className={cn(
                                            "h-5 w-5",
                                            systemStats.pendingReports > 0 ? "text-red-600" : "text-gray-500"
                                        )} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-extrabold text-gray-900 mb-2">
                                        {systemStats.pendingReports}
                                    </div>
                                    {systemStats.pendingReports > 0 ? (
                                        <div className="flex items-center text-red-600 font-semibold text-sm">
                                            <span>{t('admin.dashboard.actionRequired')}</span>
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 text-sm font-medium">
                                            {t('admin.dashboard.allHandled')}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>

                        {/* In Review Reports - PRIORITY 2 */}
                        <Link href="/admin/reports">
                            <Card className={cn(
                                "cursor-pointer transition-all duration-300 hover:shadow-xl border-2",
                                systemStats.inReviewReports > 0
                                    ? "border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:border-blue-300"
                                    : "border-gray-200 hover:border-gray-300"
                            )}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-bold text-gray-700">
                                        {t('admin.dashboard.inReview')}
                                    </CardTitle>
                                    <div className={cn(
                                        "p-2.5 rounded-xl",
                                        systemStats.inReviewReports > 0 ? "bg-blue-100" : "bg-gray-100"
                                    )}>
                                        <AlertCircle className={cn(
                                            "h-5 w-5",
                                            systemStats.inReviewReports > 0 ? "text-blue-600" : "text-gray-500"
                                        )} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-extrabold text-gray-900 mb-2">
                                        {systemStats.inReviewReports}
                                    </div>
                                    {systemStats.inReviewReports > 0 ? (
                                        <div className="flex items-center text-blue-600 font-semibold text-sm">
                                            <span>{t('admin.dashboard.continueReview')}</span>
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 text-sm font-medium">
                                            {t('admin.dashboard.noInProcess')}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Resolved Reports - Lower Priority */}
                        <Card className="border-2 border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-bold text-gray-700">
                                    {t('admin.dashboard.resolved')}
                                </CardTitle>
                                <div className="bg-green-100 p-2.5 rounded-xl">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-extrabold text-gray-900 mb-2">
                                    {systemStats.resolvedReports}
                                </div>
                                <p className="text-gray-600 text-sm font-medium">
                                    {t('admin.dashboard.resolvedThisMonth')}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Total Users - Informational only */}
                        <Link href="/admin/users">
                            <Card className="cursor-pointer transition-all duration-300 hover:shadow-xl border-2 border-gray-200 hover:border-gray-300">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-bold text-gray-700">
                                        {t('admin.dashboard.totalUsers')}
                                    </CardTitle>
                                    <div className="bg-purple-100 p-2.5 rounded-xl">
                                        <Users className="h-5 w-5 text-purple-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-extrabold text-gray-900 mb-2">
                                        {systemStats.totalUsers}
                                    </div>
                                    <p className="text-gray-600 text-sm font-medium">
                                        {systemStats.totalFarmers} {t('role.farmerShort')} • {systemStats.totalAdmins} {t('role.adminShort')}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>

                {/* Visual Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Content Management Stats */}
                <div>
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {t('admin.dashboard.contentManagement')}
                        </h2>
                    </div>
                    <div className="grid gap-5 md:grid-cols-3">
                        <Link href="/admin/forum">
                            <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg border-2 border-gray-200 hover:border-gray-300">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-bold text-gray-700">
                                        {t('modules.forum')}
                                    </CardTitle>
                                    <div className="bg-green-100 p-2.5 rounded-xl">
                                        <MessageSquare className="h-5 w-5 text-green-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-extrabold text-gray-900 mb-2">
                                        {systemStats.forumPosts}
                                    </div>
                                    <div className="flex items-center text-green-600 font-semibold text-sm">
                                        <span>{t('admin.dashboard.manageForum')}</span>
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/admin/learning">
                            <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg border-2 border-gray-200 hover:border-gray-300">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-bold text-gray-700">
                                        {t('modules.learning')}
                                    </CardTitle>
                                    <div className="bg-blue-100 p-2.5 rounded-xl">
                                        <BookOpen className="h-5 w-5 text-blue-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-extrabold text-gray-900 mb-2">
                                        {systemStats.learningMaterials}
                                    </div>
                                    <div className="flex items-center text-blue-600 font-semibold text-sm">
                                        <span>{t('admin.dashboard.addContent')}</span>
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/admin/announcements">
                            <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg border-2 border-gray-200 hover:border-gray-300">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-bold text-gray-700">
                                        {t('modules.announcements')}
                                    </CardTitle>
                                    <div className="bg-yellow-100 p-2.5 rounded-xl">
                                        <Bell className="h-5 w-5 text-yellow-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-extrabold text-gray-900 mb-2">
                                        {systemStats.publishedAnnouncements}
                                    </div>
                                    <div className="flex items-center text-yellow-600 font-semibold text-sm">
                                        <span>{t('admin.dashboard.createAnnouncement')}</span>
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>

                {/* Visual Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Action Items Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Pending Reports List */}
                    <Card className="border-2 border-gray-200">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                    <FileText className="h-5 w-5 text-gray-700" />
                                    {t('admin.dashboard.reportsRequiringAction')}
                                </CardTitle>
                                <Button variant="ghost" size="sm" asChild className="text-green-600 hover:text-green-700 font-semibold">
                                    <Link href="/admin/reports">
                                        {t('actions.viewAllAlt')}
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {pendingReports.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl">
                                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                    <p className="font-semibold text-gray-900 mb-1">{t('admin.dashboard.noPendingReports')}</p>
                                    <p className="text-sm text-gray-600">{t('admin.dashboard.allProcessed')}</p>
                                </div>
                            ) : (
                                pendingReports.map((report) => (
                                    <Link
                                        key={report.id}
                                        href={`/admin/reports/${report.id}`}
                                        className="block group"
                                    >
                                        <div className="rounded-xl border-2 border-gray-200 p-4 hover:border-green-300 hover:shadow-md transition-all duration-200 bg-white">
                                            <div className="space-y-2">
                                                <div className="flex items-start justify-between gap-3">
                                                    <p className="font-bold text-gray-900 group-hover:text-green-700 transition-colors flex-1">
                                                        {report.title}
                                                    </p>
                                                    <Badge
                                                        className={cn(
                                                            'text-xs font-bold shrink-0',
                                                            report.priority === 'High'
                                                                ? 'bg-red-100 text-red-800 border-red-200'
                                                                : 'bg-orange-100 text-orange-800 border-orange-200',
                                                        )}
                                                    >
                                                        {report.priority === 'High' ? t('admin.dashboard.highPriority') : t('admin.dashboard.mediumPriority')}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-gray-600 font-medium">
                                                        📍 {report.farmer} • {formatDate(report.date, 'ms')}
                                                    </p>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Users */}
                    <Card className="border-2 border-gray-200">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                    <Users className="h-5 w-5 text-gray-700" />
                                    {t('admin.dashboard.recentRegistrations')}
                                </CardTitle>
                                <Button variant="ghost" size="sm" asChild className="text-green-600 hover:text-green-700 font-semibold">
                                    <Link href="/admin/users">
                                        {t('actions.viewAllAlt')}
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentUsers.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl">
                                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <p className="font-semibold text-gray-900 mb-1">{t('admin.dashboard.noNewRegistrations')}</p>
                                    <p className="text-sm text-gray-600">{t('admin.dashboard.checkBackForNew')}</p>
                                </div>
                            ) : (
                                recentUsers.map((user, index) => (
                                    <Link
                                        key={index}
                                        href="/admin/users"
                                        className="block group"
                                    >
                                        <div className="rounded-xl border-2 border-gray-200 p-4 hover:border-green-300 hover:shadow-md transition-all duration-200 bg-white">
                                            <div className="space-y-2">
                                                <p className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                                                    {user.name}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs font-semibold bg-purple-100 text-purple-800 border-purple-200"
                                                        >
                                                            {t(formatRoleName(user.role, 'ms'))}
                                                        </Badge>
                                                        <span className="text-sm text-gray-600 font-medium">
                                                            {formatDate(user.date, 'ms')}
                                                        </span>
                                                    </div>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Visual Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Quick Actions - Reordered by Priority */}
                <div>
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {t('admin.dashboard.quickActions')}
                        </h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Priority 1: Review Reports */}
                        <Button
                            variant="default"
                            className="justify-start h-auto py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
                            asChild
                        >
                            <Link href="/admin/reports">
                                <FileText className="mr-3 h-5 w-5" />
                                <div className="text-left">
                                    <div className="font-bold">{t('admin.dashboard.reviewReports')}</div>
                                    <div className="text-xs opacity-90">{t('admin.dashboard.mainAction')}</div>
                                </div>
                            </Link>
                        </Button>

                        {/* Priority 2: Create Announcement */}
                        <Button
                            variant="outline"
                            className="justify-start h-auto py-4 border-2 hover:border-green-300 hover:bg-green-50 transition-all"
                            asChild
                        >
                            <Link href="/admin/announcements">
                                <Bell className="mr-3 h-5 w-5 text-yellow-600" />
                                <div className="text-left">
                                    <div className="font-bold">{t('admin.dashboard.createAnnouncement')}</div>
                                    <div className="text-xs text-gray-600">{t('admin.dashboard.notifyFarmers')}</div>
                                </div>
                            </Link>
                        </Button>

                        {/* Priority 3: Manage Users */}
                        <Button
                            variant="outline"
                            className="justify-start h-auto py-4 border-2 hover:border-green-300 hover:bg-green-50 transition-all"
                            asChild
                        >
                            <Link href="/admin/users">
                                <Users className="mr-3 h-5 w-5 text-purple-600" />
                                <div className="text-left">
                                    <div className="font-bold">{t('actions.manageUsers')}</div>
                                    <div className="text-xs text-gray-600">{t('admin.dashboard.farmersAdmins')}</div>
                                </div>
                            </Link>
                        </Button>

                        {/* Priority 4: Upload Content */}
                        <Button
                            variant="outline"
                            className="justify-start h-auto py-4 border-2 hover:border-green-300 hover:bg-green-50 transition-all"
                            asChild
                        >
                            <Link href="/admin/learning">
                                <BookOpen className="mr-3 h-5 w-5 text-blue-600" />
                                <div className="text-left">
                                    <div className="font-bold">{t('actions.uploadContent')}</div>
                                    <div className="text-xs text-gray-600">{t('admin.dashboard.learningMaterials')}</div>
                                </div>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AdminSidebarLayout>
    );
}
