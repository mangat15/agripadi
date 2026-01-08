import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { FarmerSidebar } from '@/components/farmer-sidebar';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren, useState } from 'react';
import { Menu } from 'lucide-react';

export default function FarmerSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-100 via-green-100/60 to-amber-100/70">
            {/* Header at the top */}
            <AppSidebarHeader breadcrumbs={breadcrumbs} />

            {/* Sidebar and content below header */}
            <div className="flex flex-1 relative">
                {/* Mobile menu button */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden fixed bottom-6 right-6 z-30 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <FarmerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}