import { useState } from 'react';
import FarmerSidebarLayout from '@/layouts/app/farmer-sidebar-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Calendar, User } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Announcement {
    id: number;
    user_id: number;
    title: string;
    content: string;
    category: string | null;
    image: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    user: User;
}

interface Props {
    announcements: Announcement[];
}

export default function FarmerAnnouncements({ announcements }: Props) {
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAnnouncementClick = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ms-MY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <FarmerSidebarLayout breadcrumbs={[{ title: 'Pengumuman', href: '/farmer/announcements' }]}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pengumuman</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Kekal dikemaskini dengan berita dan pengumuman terkini
                        </p>
                    </div>
                </div>

                {/* Announcements Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {announcements.length === 0 ? (
                        <Card className="col-span-full">
                            <CardContent className="py-12 text-center text-gray-500">
                                <p>Tiada pengumuman pada masa ini</p>
                            </CardContent>
                        </Card>
                    ) : (
                        announcements.map((announcement) => (
                            <Card
                                key={announcement.id}
                                className="hover:shadow-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                                onClick={() => handleAnnouncementClick(announcement)}
                            >
                                <CardContent className="pt-6 space-y-3">
                                    {/* Category Badge */}
                                    {announcement.category && (
                                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                            {announcement.category}
                                        </Badge>
                                    )}

                                    {/* Title */}
                                    <h3 className="text-xl font-semibold leading-tight line-clamp-2">
                                        {announcement.title}
                                    </h3>

                                    {/* Image */}
                                    {announcement.image && (
                                        <div className="rounded-lg overflow-hidden">
                                            <img
                                                src={`/storage/${announcement.image}`}
                                                alt={announcement.title}
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Content Preview */}
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {announcement.content}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="flex flex-col gap-2 pt-2 text-xs text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{announcement.published_at && formatDate(announcement.published_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User className="h-4 w-4" />
                                            <span>Oleh: {announcement.user.name}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* View Announcement Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 flex-wrap">
                            {selectedAnnouncement?.title}
                            {selectedAnnouncement?.category && (
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                    {selectedAnnouncement.category}
                                </Badge>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedAnnouncement && (
                        <div className="space-y-4">
                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{selectedAnnouncement.published_at && formatDate(selectedAnnouncement.published_at)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>Oleh: {selectedAnnouncement.user.name}</span>
                                </div>
                            </div>

                            {/* Image */}
                            {selectedAnnouncement.image && (
                                <div className="rounded-lg overflow-hidden">
                                    <img
                                        src={`/storage/${selectedAnnouncement.image}`}
                                        alt={selectedAnnouncement.title}
                                        className="w-full max-h-96 object-contain bg-gray-100"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {selectedAnnouncement.content}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </FarmerSidebarLayout>
    );
}