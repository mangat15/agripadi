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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

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

export default function AdminDashboard() {
    const { systemStats, pendingReports, recentUsers } = usePage<AdminDashboardProps>().props;

    return (
        <AdminSidebarLayout
            breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }]}
        >
            <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Papan Pemuka Pentadbir
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Gambaran keseluruhan dan pengurusan sistem
                    </p>
                </div>

                {/* Key Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Jumlah Pengguna
                            </CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {systemStats.totalUsers}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                {systemStats.totalFarmers} Petani,{' '}
                                {systemStats.totalAdmins} admin
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Laporan Tertunda
                            </CardTitle>
                            <Clock className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {systemStats.pendingReports}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Memerlukan Perhatian
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Dalam Semakan
                            </CardTitle>
                            <AlertCircle className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {systemStats.inReviewReports}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Sedang Diproses
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Telah Diselesaikan
                            </CardTitle>
                            <CheckCircle className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {systemStats.resolvedReports}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Laporan Diselesaikan
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Forum 
                            </CardTitle>
                            <MessageSquare className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {systemStats.forumPosts}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Jumlah Forum
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Bahan Pembelajaran
                            </CardTitle>
                            <Eye className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {systemStats.learningMaterials}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Sudah Diterbitkan
                            </p>
                        </CardContent>
                    </Card>
                    {/* <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                System Health
                            </CardTitle>
                            <TrendingUp className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                Excellent
                            </div>
                            <p className="text-muted-foreground text-xs">
                                All systems operational
                            </p>
                        </CardContent>
                    </Card> */}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Pending Reports */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Laporan Tertunda
                                </CardTitle>
                                <Button variant="ghost" size="sm" asChild>
                                    <a href="/admin/reports">View All</a>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {pendingReports.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">Tiada Laporan Tertunda</p>
                                </div>
                            ) : (
                                pendingReports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="rounded-lg border p-3"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-medium">
                                                    {report.title}
                                                </p>
                                                <Badge
                                                    className={cn(
                                                        'text-xs',
                                                        report.priority === 'High'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-orange-100 text-orange-800',
                                                    )}
                                                >
                                                    {report.priority}
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground text-sm">
                                                By {report.farmer} • {report.date}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Users */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Petani Baru
                                </CardTitle>
                                <Button variant="ghost" size="sm" asChild>
                                    <a href="/admin/users">View All</a>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentUsers.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">No recent registrations</p>
                                </div>
                            ) : (
                                recentUsers.map((user, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border p-3"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium">
                                                {user.name}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {user.role}
                                                </Badge>
                                                <span className="text-muted-foreground text-xs">
                                                    {user.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <Button variant="outline" className="justify-start" asChild>
                            <a href="/admin/announcements">
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Create Announcement
                            </a>
                        </Button>
                        <Button variant="outline" className="justify-start" asChild>
                            <a href="/admin/users">
                                <Users className="mr-2 h-4 w-4" />
                                Manage Users
                            </a>
                        </Button>
                        <Button variant="outline" className="justify-start" asChild>
                            <a href="/admin/reports">
                                <FileText className="mr-2 h-4 w-4" />
                                Review Reports
                            </a>
                        </Button>
                        <Button variant="outline" className="justify-start" asChild>
                            <a href="/admin/learning">
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Upload Content
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AdminSidebarLayout>
    );
}
