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
} from 'lucide-react';
import { SharedData } from '@/types';

interface Stats {
    learning_materials: number;
    active_farmers: number;
    forum_topics: number;
}

interface RecentActivity {
    title: string;
    time: string;
    type: 'learning' | 'forum' | 'announcement';
}

interface DashboardProps extends SharedData {
    stats: Stats;
    recentActivities: RecentActivity[];
}

interface ModuleTileProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    bgColor: string;
}

function ModuleTile({ title, description, icon, href, bgColor }: ModuleTileProps) {
    return (
        <Link
            href={href}
            className={`${bgColor} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer block`}
        >
            <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 flex items-center justify-center bg-white/50 rounded-lg">
                    {icon}
                </div>
                <div>
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">
                        {title}
                    </h3>
                    <p className="text-xs text-gray-700">
                        {description}
                    </p>
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
}

function StatCard({ title, count, description, icon, bgColor }: StatCardProps) {
    return (
        <div className={`${bgColor} rounded-lg p-6 shadow-sm`}>
            <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-white text-lg">{title}</h3>
                <div className="bg-white/20 p-2 rounded-lg">
                    {icon}
                </div>
            </div>
            <div className="text-5xl font-bold text-white mb-2">{count}</div>
            <p className="text-white/90 text-sm">{description}</p>
        </div>
    );
}

interface RecentActivityProps {
    title: string;
    time: string;
    icon: React.ReactNode;
    bgColor: string;
    borderColor: string;
}

function RecentActivity({ title, time, icon, bgColor, borderColor }: RecentActivityProps) {
    return (
        <div className={`${bgColor} ${borderColor} border-l-4 rounded-lg p-4 flex items-start gap-3`}>
            <div className="mt-1">
                {icon}
            </div>
            <div>
                <p className="font-medium text-gray-900">{title}</p>
                <p className="text-sm text-gray-600">{time}</p>
            </div>
        </div>
    );
}

export default function FarmerDashboard() {
    const { auth, stats, recentActivities } = usePage<DashboardProps>().props;
    const userName = auth.user.name;

    const modules = [
        {
            title: 'Bahan Pembelajaran',
            description: 'Akses sumber pendidikan dan video',
            icon: <BookOpen className="h-8 w-8 text-blue-600" />,
            href: '/farmer/learning',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Lawatan Maya Ladang',
            description: 'Jelajah ladang melalui lawatan maya 360°',
            icon: <Camera className="h-8 w-8 text-purple-600" />,
            href: '/farmer/virtual-tour',
            bgColor: 'bg-purple-100',
        },
        {
            title: 'Pengumuman',
            description: 'Lihat berita dan kemas kini terkini',
            icon: <Bell className="h-8 w-8 text-yellow-600" />,
            href: '/farmer/announcements',
            bgColor: 'bg-yellow-100',
        },
        {
            title: 'Pelaporan',
            description: 'Hantar laporan ladang dengan gambar',
            icon: <FileText className="h-8 w-8 text-red-600" />,
            href: '/farmer/reports',
            bgColor: 'bg-red-100',
        },
        {
            title: 'Forum Komuniti',
            description: 'Berbincang dan berkongsi dengan petani lain',
            icon: <MessageSquare className="h-8 w-8 text-green-600" />,
            href: '/farmer/forum',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Maklum Balas',
            description: 'Hantar maklum balas untuk memperbaiki sistem',
            icon: <ThumbsUp className="h-8 w-8 text-blue-600" />,
            href: '/farmer/feedback',
            bgColor: 'bg-blue-100',
        },
    ];

    const statsCards = [
        {
            title: 'Bahan Tersedia',
            count: stats.learning_materials,
            description: 'Video & Dokumen',
            icon: <BookOpen className="h-6 w-6 text-white" />,
            bgColor: 'bg-blue-500',
        },
        {
            title: 'Ahli Komuniti',
            count: stats.active_farmers,
            description: 'Petani Aktif',
            icon: <Users className="h-6 w-6 text-white" />,
            bgColor: 'bg-purple-500',
        },
        {
            title: 'Topik Forum',
            count: stats.forum_topics,
            description: 'Perbincangan',
            icon: <TrendingUp className="h-6 w-6 text-white" />,
            bgColor: 'bg-green-500',
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
                return { bgColor: 'bg-yellow-50', borderColor: 'border-yellow-400' };
            case 'forum':
                return { bgColor: 'bg-green-50', borderColor: 'border-green-400' };
            case 'announcement':
                return { bgColor: 'bg-blue-50', borderColor: 'border-blue-400' };
        }
    };

    const activitiesWithStyles = recentActivities.map(activity => ({
        ...activity,
        icon: getActivityIcon(activity.type),
        ...getActivityColors(activity.type),
    }));

    return (
        <FarmerSidebarLayout
            breadcrumbs={[{ title: 'Papan Pemuka', href: '/farmer/dashboard' }]}
        >
            <div className="p-6 space-y-6">
                {/* Page Title */}
                <h1 className="text-2xl font-bold text-gray-900">
                    Papan Pemuka Petani
                </h1>

                {/* Welcome Message */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 shadow-md text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">
                                Selamat datang, {userName}!
                            </h2>
                            <p className="text-green-50">
                                Akses semua ciri AgriPadi dari papan pemuka ini
                            </p>
                        </div>
                        <div className="bg-white/20 p-3 rounded-lg">
                            <TrendingUp className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </div>

                {/* Module Tiles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {modules.map((module) => (
                        <ModuleTile
                            key={module.title}
                            title={module.title}
                            description={module.description}
                            icon={module.icon}
                            href={module.href}
                            bgColor={module.bgColor}
                        />
                    ))}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {statsCards.map((stat) => (
                        <StatCard
                            key={stat.title}
                            title={stat.title}
                            count={stat.count}
                            description={stat.description}
                            icon={stat.icon}
                            bgColor={stat.bgColor}
                        />
                    ))}
                </div>

                {/* Recent Activities */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Kemas Kini Terkini
                    </h2>
                    <div className="space-y-3">
                        {activitiesWithStyles.map((activity, index) => (
                            <RecentActivity
                                key={index}
                                title={activity.title}
                                time={activity.time}
                                icon={activity.icon}
                                bgColor={activity.bgColor}
                                borderColor={activity.borderColor}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </FarmerSidebarLayout>
    );
}