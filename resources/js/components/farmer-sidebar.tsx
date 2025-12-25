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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

const farmerNavItems = [
    {
        title: 'Papan Pemuka',
        href: '/farmer/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Bahan Pembelajaran',
        href: '/farmer/learning',
        icon: BookOpen,
    },
    {
        title: 'Lawatan Maya Ladang',
        href: '/farmer/virtual-tour',
        icon: Camera,
    },
    {
        title: 'Pengumuman',
        href: '/farmer/announcements',
        icon: Bell,
    },
    {
        title: 'Pelaporan',
        href: '/farmer/reports',
        icon: FileText,
    },
    {
        title: 'Forum Komuniti',
        href: '/farmer/forum',
        icon: MessageSquare,
    },
    {
        title: 'Maklum Balas',
        href: '/farmer/feedback',
        icon: ThumbsUp,
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

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "w-64 bg-white border-r border-gray-200 flex flex-col",
                "fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* Close button for mobile */}
                <div className="lg:hidden p-4 border-b border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-600" />
                    </button>
                </div>

                {/* User Info */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 overflow-hidden rounded-full">
                        <AvatarImage
                            src={auth.user.profile_picture ? `/storage/${auth.user.profile_picture}` : undefined}
                            alt={auth.user.name}
                        />
                        <AvatarFallback className="rounded-full bg-green-600 text-white">
                            {getInitials(auth.user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm text-gray-900">{auth.user.name}</p>
                        <p className="text-xs text-gray-600">Petani</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {farmerNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'text-gray-700 hover:bg-gray-100'
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-200 space-y-1">
                <Link
                    href="/settings/profile"
                    className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        currentPath.startsWith('/settings')
                            ? 'bg-green-100 text-green-800'
                            : 'text-gray-700 hover:bg-gray-100'
                    )}
                >
                    <Settings className="h-5 w-5" />
                    <span>Tetapan</span>
                </Link>
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Log Keluar</span>
                </Link>
            </div>
            </aside>
        </>
    );
}