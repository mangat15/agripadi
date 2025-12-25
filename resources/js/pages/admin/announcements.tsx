import { useState } from 'react';
import AdminSidebarLayout from '@/layouts/app/admin-sidebar-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Bell,
    Plus,
    Edit,
    Trash2,
    Calendar,
    User,
    Eye,
    EyeOff,
} from 'lucide-react';
import { useForm, router } from '@inertiajs/react';

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

interface Stats {
    total: number;
    published: number;
    draft: number;
}

interface Props {
    announcements: Announcement[];
    stats: Stats;
}

export default function AdminAnnouncements({ announcements, stats }: Props) {
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    const { data: createData, setData: setCreateData, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm<{
        title: string;
        content: string;
        category: string;
        image: File | null;
        publish_now: boolean;
    }>({
        title: '',
        content: '',
        category: '',
        image: null,
        publish_now: true,
    });

    const { data: editData, setData: setEditData, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm<{
        title: string;
        content: string;
        category: string;
        image: File | null;
        publish_now: boolean;
    }>({
        title: '',
        content: '',
        category: '',
        image: null,
        publish_now: true,
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/announcements', createData, {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                resetCreate();
            },
        });
    };

    const handleEditClick = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setEditData({
            title: announcement.title,
            content: announcement.content,
            category: announcement.category || '',
            image: null,
            publish_now: !!announcement.published_at,
        });
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedAnnouncement) {
            router.post(`/admin/announcements/${selectedAnnouncement.id}`, {
                ...editData,
                _method: 'PUT',
            }, {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    resetEdit();
                    setSelectedAnnouncement(null);
                },
            });
        }
    };

    const handleDelete = (announcementId: number) => {
        if (confirm('Adakah anda pasti mahu memadam pengumuman ini?')) {
            router.delete(`/admin/announcements/${announcementId}`);
        }
    };

    const handleTogglePublish = (announcementId: number) => {
        router.post(`/admin/announcements/${announcementId}/toggle-publish`);
    };

    const handleViewDetails = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsViewDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ms-MY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AdminSidebarLayout breadcrumbs={[{ title: 'Pengumuman', href: '/admin/announcements' }]}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pengurusan Pengumuman</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Cipta dan urus pengumuman untuk petani
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Cipta Pengumuman
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Jumlah Pengumuman</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                                <Bell className="h-8 w-8 text-gray-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Diterbitkan</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                                </div>
                                <Eye className="h-8 w-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Draf</p>
                                    <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
                                </div>
                                <EyeOff className="h-8 w-8 text-gray-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Announcements List */}
                <div className="space-y-4">
                    {announcements.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-gray-500">
                                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p>Tiada pengumuman dijumpai</p>
                            </CardContent>
                        </Card>
                    ) : (
                        announcements.map((announcement) => (
                            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* Header */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {announcement.title}
                                                </h3>
                                                {announcement.category && (
                                                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                                        {announcement.category}
                                                    </Badge>
                                                )}
                                                <Badge className={announcement.published_at ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}>
                                                    {announcement.published_at ? 'Diterbitkan' : 'Draf'}
                                                </Badge>
                                            </div>

                                            {/* Content Preview */}
                                            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                                {announcement.content}
                                            </p>

                                            {/* Image Preview */}
                                            {announcement.image && (
                                                <div className="mb-3">
                                                    <img
                                                        src={`/storage/${announcement.image}`}
                                                        alt={announcement.title}
                                                        className="rounded-lg max-h-32 object-cover"
                                                    />
                                                </div>
                                            )}

                                            {/* Meta */}
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-4 w-4" />
                                                    <span>{announcement.user.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{formatDate(announcement.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-2 ml-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetails(announcement)}
                                            >
                                                Lihat
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleTogglePublish(announcement.id)}
                                                className={announcement.published_at ? "text-gray-600" : "text-green-600 hover:text-green-700"}
                                            >
                                                {announcement.published_at ? (
                                                    <>
                                                        <EyeOff className="h-4 w-4 mr-1" />
                                                        Nyahterbit
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Terbitkan
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditClick(announcement)}
                                            >
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(announcement.id)}
                                                className="border-red-300 text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Padam
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Create Announcement Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Cipta Pengumuman Baru</DialogTitle>
                        <DialogDescription>
                            Cipta pengumuman untuk dipaparkan kepada petani
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Tajuk *</Label>
                            <Input
                                id="title"
                                value={createData.title}
                                onChange={(e) => setCreateData('title', e.target.value)}
                                placeholder="Contoh: Workshop Kawalan Perosak"
                                required
                            />
                            {createErrors.title && (
                                <p className="text-sm text-red-600">{createErrors.title}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori (Pilihan)</Label>
                            <select
                                id="category"
                                value={createData.category}
                                onChange={(e) => setCreateData('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Pilih kategori (pilihan)</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Program">Program</option>
                                <option value="Berita">Berita</option>
                                <option value="Amaran">Amaran</option>
                                <option value="Lain-lain">Lain-lain</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Kandungan *</Label>
                            <Textarea
                                id="content"
                                value={createData.content}
                                onChange={(e) => setCreateData('content', e.target.value)}
                                placeholder="Masukkan kandungan pengumuman..."
                                rows={6}
                                required
                            />
                            {createErrors.content && (
                                <p className="text-sm text-red-600">{createErrors.content}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Poster/Gambar (Pilihan)</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setCreateData('image', e.target.files?.[0] || null)}
                                className="cursor-pointer"
                            />
                            {createErrors.image && (
                                <p className="text-sm text-red-600">{createErrors.image}</p>
                            )}
                            <p className="text-xs text-gray-500">Maksimum 5MB. Format: JPG, PNG, GIF</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="publish_now"
                                checked={createData.publish_now}
                                onChange={(e) => setCreateData('publish_now', e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="publish_now" className="cursor-pointer">
                                Terbitkan sekarang
                            </Label>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsCreateDialogOpen(false);
                                    resetCreate();
                                }}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={createProcessing}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {createProcessing ? 'Mencipta...' : 'Cipta Pengumuman'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Announcement Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Pengumuman</DialogTitle>
                        <DialogDescription>
                            Kemaskini butiran pengumuman
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Tajuk *</Label>
                            <Input
                                id="edit-title"
                                value={editData.title}
                                onChange={(e) => setEditData('title', e.target.value)}
                                required
                            />
                            {editErrors.title && (
                                <p className="text-sm text-red-600">{editErrors.title}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-category">Kategori (Pilihan)</Label>
                            <select
                                id="edit-category"
                                value={editData.category}
                                onChange={(e) => setEditData('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Pilih kategori (pilihan)</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Program">Program</option>
                                <option value="Berita">Berita</option>
                                <option value="Amaran">Amaran</option>
                                <option value="Lain-lain">Lain-lain</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-content">Kandungan *</Label>
                            <Textarea
                                id="edit-content"
                                value={editData.content}
                                onChange={(e) => setEditData('content', e.target.value)}
                                rows={6}
                                required
                            />
                            {editErrors.content && (
                                <p className="text-sm text-red-600">{editErrors.content}</p>
                            )}
                        </div>

                        {selectedAnnouncement?.image && (
                            <div className="space-y-2">
                                <Label>Gambar Semasa</Label>
                                <img
                                    src={`/storage/${selectedAnnouncement.image}`}
                                    alt={selectedAnnouncement.title}
                                    className="rounded-lg max-h-32 object-cover"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="edit-image">Gambar Baru (Pilihan)</Label>
                            <Input
                                id="edit-image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setEditData('image', e.target.files?.[0] || null)}
                                className="cursor-pointer"
                            />
                            <p className="text-xs text-gray-500">Maksimum 5MB</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="edit-publish_now"
                                checked={editData.publish_now}
                                onChange={(e) => setEditData('publish_now', e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="edit-publish_now" className="cursor-pointer">
                                Terbitkan sekarang
                            </Label>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditDialogOpen(false);
                                    resetEdit();
                                    setSelectedAnnouncement(null);
                                }}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={editProcessing}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {editProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Announcement Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
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
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>Oleh: {selectedAnnouncement.user.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(selectedAnnouncement.created_at)}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {selectedAnnouncement.content}
                                </p>
                            </div>

                            {selectedAnnouncement.image && (
                                <div className="rounded-lg overflow-hidden">
                                    <img
                                        src={`/storage/${selectedAnnouncement.image}`}
                                        alt={selectedAnnouncement.title}
                                        className="w-full max-h-96 object-contain bg-gray-100"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminSidebarLayout>
    );
}