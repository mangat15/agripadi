import { usePage, Link } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { LanguageSwitcherHeader } from '@/components/language-switcher-header';

export function AppSidebarHeader() {
    const { unreadAnnouncementsCount, auth } = usePage().props as unknown as {
        unreadAnnouncementsCount: number;
        auth: { user: { role: number } };
    };
    const isFarmer = auth?.user?.role === 0; // 0 = farmer, 1 = admin

    const notificationLink = isFarmer ? '/farmer/announcements' : '/admin/announcements';

    return (
        <header className="relative shrink-0 bg-green-600 text-white pb-2 sm:pb-0">
            <div className="flex h-14 sm:h-16 items-center justify-between gap-2 px-3 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <img
                        src="/logo1.png"
                        alt="AgriPadi Logo"
                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs text-green-100 leading-tight">
                            Empowering Farmers<br className="sm:hidden" /> Through Technology 🌾
                        </p>
                    </div>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    {/* Language Switcher */}
                    <LanguageSwitcherHeader />

                    {/* Notification Bell */}
                    <Link
                        href={notificationLink}
                        className="relative hover:bg-green-700 p-1.5 sm:p-2 rounded-lg transition-colors"
                    >
                        <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                        {unreadAnnouncementsCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {unreadAnnouncementsCount > 9 ? '9+' : unreadAnnouncementsCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Curved bottom edge - only on mobile */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none sm:hidden">
                <svg className="relative block w-full h-3" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0 C300,80 900,80 1200,0 L1200,120 L0,120 Z" className="fill-white"></path>
                </svg>
            </div>
        </header>
    );
}
