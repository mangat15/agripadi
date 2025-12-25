import { usePage, Link } from '@inertiajs/react';
import { Bell } from 'lucide-react';

export function AppSidebarHeader() {
    const { unreadAnnouncementsCount, auth } = usePage().props as unknown as {
        unreadAnnouncementsCount: number;
        auth: { user: { role: number } };
    };
    const isFarmer = auth?.user?.role === 0; // 0 = farmer, 1 = admin

    const notificationLink = isFarmer ? '/farmer/announcements' : '/admin/announcements';

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 bg-green-600 text-white px-6">
            <div className="flex items-center gap-3">
                <img
                    src="/logo1.png"
                    alt="AgriPadi Logo"
                    className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                    <h1 className="font-bold text-xl">AgriPadi</h1>
                    <p className="text-xs text-green-100">Empowering Farmers Through Technology 🌾</p>
                </div>
            </div>

            {/* Notification Bell */}
            <Link
                href={notificationLink}
                className="relative hover:bg-green-700 p-2 rounded-lg transition-colors"
            >
                <Bell className="h-6 w-6" />
                {unreadAnnouncementsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadAnnouncementsCount > 9 ? '9+' : unreadAnnouncementsCount}
                    </span>
                )}
            </Link>
        </header>
    );
}