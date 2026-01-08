import { useState } from 'react';
import AdminSidebarLayout from '@/layouts/app/admin-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Camera,
    Plus,
    Edit,
    Trash2,
    Calendar,
    User,
    Eye,
    EyeOff,
    ExternalLink,
} from 'lucide-react';
import { useForm, router } from '@inertiajs/react';

interface VirtualTour {
    id: number;
    title: string;
    description: string | null;
    thumbnail: string | null;
    tour_url: string;
    tour_type: 'iframe' | 'redirect';
    published_at: string | null;
    created_at: string;
    user: {
        name: string;
    };
}

interface Stats {
    total: number;
    published: number;
    draft: number;
}

interface Props {
    tours: VirtualTour[];
    stats: Stats;
}

export default function AdminVirtualTour({ tours, stats }: Props) {
    const { t, language } = useLanguage();
    const [selectedTour, setSelectedTour] = useState<VirtualTour | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { data: createData, setData: setCreateData, post: createPost, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm<{
        title: string;
        description: string;
        thumbnail: File | null;
        tour_url: string;
        tour_type: 'iframe' | 'redirect';
        publish_now: boolean;
    }>({
        title: '',
        description: '',
        thumbnail: null,
        tour_url: '',
        tour_type: 'iframe',
        publish_now: true,
    });

    const { data: editData, setData: setEditData, post: editPost, processing: editProcessing, errors: editErrors } = useForm<{
        title: string;
        description: string;
        thumbnail: File | null;
        tour_url: string;
        tour_type: 'iframe' | 'redirect';
        publish_now: boolean;
        _method: string;
    }>({
        title: '',
        description: '',
        thumbnail: null,
        tour_url: '',
        tour_type: 'iframe',
        publish_now: true,
        _method: 'PUT',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createPost('/admin/virtual-tour', {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                resetCreate();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTour) {
            editPost(`/admin/virtual-tour/${selectedTour.id}`, {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    setSelectedTour(null);
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedTour) {
            router.delete(`/admin/virtual-tour/${selectedTour.id}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedTour(null);
                },
            });
        }
    };

    const handleTogglePublish = (tour: VirtualTour) => {
        router.post(`/admin/virtual-tour/${tour.id}/toggle-publish`);
    };

    const openEditDialog = (tour: VirtualTour) => {
        setSelectedTour(tour);
        setEditData({
            title: tour.title,
            description: tour.description || '',
            thumbnail: null,
            tour_url: tour.tour_url,
            tour_type: tour.tour_type,
            publish_now: !!tour.published_at,
            _method: 'PUT',
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (tour: VirtualTour) => {
        setSelectedTour(tour);
        setIsDeleteDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language === 'ms' ? 'ms-MY' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AdminSidebarLayout breadcrumbs={[{ title: t('adminVirtualTour.title'), href: '/admin/virtual-tour' }]}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{t('adminVirtualTour.title')}</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {t('adminVirtualTour.subtitle')}
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        {t('adminVirtualTour.createNew')}
                    </Button>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">{t('adminVirtualTour.stats.total')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">{t('adminVirtualTour.stats.published')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">{t('adminVirtualTour.stats.draft')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tours Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tours.length === 0 ? (
                        <Card className="col-span-full">
                            <CardContent className="py-12 text-center text-gray-500">
                                <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p>{t('adminVirtualTour.noTours')}</p>
                            </CardContent>
                        </Card>
                    ) : (
                        tours.map((tour) => (
                            <Card key={tour.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="pt-6 space-y-3">
                                    {/* Tour Type Badge */}
                                    <div className="flex items-center justify-between">
                                        <Badge className={tour.tour_type === 'iframe' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 'bg-purple-100 text-purple-800 hover:bg-purple-100'}>
                                            {tour.tour_type === 'iframe' ? t('adminVirtualTour.form.iframe') : t('adminVirtualTour.form.redirect')}
                                        </Badge>
                                        {tour.published_at ? (
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                <Eye className="h-3 w-3 mr-1" />
                                                {t('adminVirtualTour.status.published')}
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                                                <EyeOff className="h-3 w-3 mr-1" />
                                                {t('adminVirtualTour.status.draft')}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-semibold leading-tight line-clamp-2">
                                        {tour.title}
                                    </h3>

                                    {/* Thumbnail */}
                                    {tour.thumbnail && (
                                        <div className="rounded-lg overflow-hidden">
                                            <img
                                                src={`/storage/${tour.thumbnail}`}
                                                alt={tour.title}
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Description Preview */}
                                    {tour.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {tour.description}
                                        </p>
                                    )}

                                    {/* Meta Info */}
                                    <div className="flex flex-col gap-2 pt-2 text-xs text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formatDate(tour.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User className="h-4 w-4" />
                                            <span>{t('adminVirtualTour.by')}: {tour.user.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ExternalLink className="h-4 w-4" />
                                            <a
                                                href={tour.tour_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline truncate"
                                            >
                                                {tour.tour_url}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleTogglePublish(tour)}
                                        >
                                            {tour.published_at ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                                            {tour.published_at ? t('adminVirtualTour.unpublish') : t('adminVirtualTour.publish')}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditDialog(tour)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openDeleteDialog(tour)}
                                            className="text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{t('adminVirtualTour.form.createTitle')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-title">{t('adminVirtualTour.form.title')} *</Label>
                            <Input
                                id="create-title"
                                value={createData.title}
                                onChange={(e) => setCreateData('title', e.target.value)}
                                placeholder={t('adminVirtualTour.form.titlePlaceholder')}
                                required
                            />
                            {createErrors.title && <p className="text-sm text-red-600">{createErrors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-description">{t('adminVirtualTour.form.description')}</Label>
                            <Textarea
                                id="create-description"
                                value={createData.description}
                                onChange={(e) => setCreateData('description', e.target.value)}
                                placeholder={t('adminVirtualTour.form.descriptionPlaceholder')}
                                rows={4}
                            />
                            {createErrors.description && <p className="text-sm text-red-600">{createErrors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-tour_url">{t('adminVirtualTour.form.url')} *</Label>
                            <Input
                                id="create-tour_url"
                                value={createData.tour_url}
                                onChange={(e) => setCreateData('tour_url', e.target.value)}
                                placeholder="https://..."
                                required
                            />
                            <p className="text-xs text-gray-500">{t('adminVirtualTour.form.urlHint')}</p>
                            {createErrors.tour_url && <p className="text-sm text-red-600">{createErrors.tour_url}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-tour_type">{t('adminVirtualTour.form.displayType')} *</Label>
                            <Select
                                value={createData.tour_type}
                                onValueChange={(value) => setCreateData('tour_type', value as 'iframe' | 'redirect')}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="iframe">{t('adminVirtualTour.form.iframe')}</SelectItem>
                                    <SelectItem value="redirect">{t('adminVirtualTour.form.redirect')}</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500">
                                {t('adminVirtualTour.form.displayTypeHint')}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-thumbnail">{t('adminVirtualTour.form.thumbnail')}</Label>
                            <Input
                                id="create-thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setCreateData('thumbnail', e.target.files?.[0] || null)}
                            />
                            {createErrors.thumbnail && <p className="text-sm text-red-600">{createErrors.thumbnail}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="create-publish_now"
                                checked={createData.publish_now}
                                onChange={(e) => setCreateData('publish_now', e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="create-publish_now" className="cursor-pointer">
                                {t('adminVirtualTour.form.publishNow')}
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
                                {t('adminVirtualTour.cancel')}
                            </Button>
                            <Button type="submit" disabled={createProcessing}>
                                {createProcessing ? t('adminVirtualTour.saving') : t('adminVirtualTour.save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{t('adminVirtualTour.form.editTitle')}</DialogTitle>
                    </DialogHeader>
                    {selectedTour && (
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-title">{t('adminVirtualTour.form.title')} *</Label>
                                <Input
                                    id="edit-title"
                                    value={editData.title}
                                    onChange={(e) => setEditData('title', e.target.value)}
                                    required
                                />
                                {editErrors.title && <p className="text-sm text-red-600">{editErrors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-description">{t('adminVirtualTour.form.description')}</Label>
                                <Textarea
                                    id="edit-description"
                                    value={editData.description}
                                    onChange={(e) => setEditData('description', e.target.value)}
                                    rows={4}
                                />
                                {editErrors.description && <p className="text-sm text-red-600">{editErrors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-tour_url">{t('adminVirtualTour.form.url')} *</Label>
                                <Input
                                    id="edit-tour_url"
                                    value={editData.tour_url}
                                    onChange={(e) => setEditData('tour_url', e.target.value)}
                                    required
                                />
                                {editErrors.tour_url && <p className="text-sm text-red-600">{editErrors.tour_url}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-tour_type">{t('adminVirtualTour.form.displayType')} *</Label>
                                <Select
                                    value={editData.tour_type}
                                    onValueChange={(value) => setEditData('tour_type', value as 'iframe' | 'redirect')}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="iframe">{t('adminVirtualTour.form.iframe')}</SelectItem>
                                        <SelectItem value="redirect">{t('adminVirtualTour.form.redirect')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-thumbnail">{t('adminVirtualTour.form.thumbnailNew')}</Label>
                                <Input
                                    id="edit-thumbnail"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditData('thumbnail', e.target.files?.[0] || null)}
                                />
                                {selectedTour.thumbnail && (
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-500 mb-1">{t('adminVirtualTour.form.currentThumbnail')}:</p>
                                        <img
                                            src={`/storage/${selectedTour.thumbnail}`}
                                            alt="Current thumbnail"
                                            className="h-20 w-20 object-cover rounded"
                                        />
                                    </div>
                                )}
                                {editErrors.thumbnail && <p className="text-sm text-red-600">{editErrors.thumbnail}</p>}
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
                                    {t('adminVirtualTour.form.publishNow')}
                                </Label>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditDialogOpen(false);
                                        setSelectedTour(null);
                                    }}
                                >
                                    {t('adminVirtualTour.cancel')}
                                </Button>
                                <Button type="submit" disabled={editProcessing}>
                                    {editProcessing ? t('adminVirtualTour.saving') : t('adminVirtualTour.saveChanges')}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('adminVirtualTour.deleteTitle')}</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                        {t('adminVirtualTour.deleteConfirm')}
                    </p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setSelectedTour(null);
                            }}
                        >
                            {t('adminVirtualTour.cancel')}
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            {t('adminVirtualTour.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminSidebarLayout>
    );
}