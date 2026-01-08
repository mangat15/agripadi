import { useState } from 'react';
import FarmerSidebarLayout from '@/layouts/app/farmer-sidebar-layout';
import { Card, CardContent } from '@/components/ui/card';
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
    MessageSquare,
    Plus,
    ThumbsUp,
    MessageCircle,
    User,
    Clock,
} from 'lucide-react';
import { useForm, router } from '@inertiajs/react';
import { useLanguage } from '@/contexts/LanguageContext';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Forum {
    id: number;
    user_id: number;
    title: string;
    content: string;
    image: string | null;
    category: string | null;
    status: 'pending' | 'approved' | 'rejected';
    likes_count: number;
    comments_count: number;
    created_at: string;
    updated_at: string;
    user: User;
    is_liked: boolean;
}

interface Props {
    forums: Forum[];
}

export default function FarmerForum({ forums }: Props) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const { t, language } = useLanguage();

    const { data, setData, processing, errors, reset } = useForm<{
        title: string;
        content: string;
        category: string;
        image: File | null;
    }>({
        title: '',
        content: '',
        category: '',
        image: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post('/farmer/forum', data, {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                reset();
            },
        });
    };

    const handleLike = (forumId: number) => {
        router.post(`/farmer/forum/${forumId}/like`);
    };

    const handleViewDetails = (forumId: number) => {
        router.get(`/farmer/forum/${forumId}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language === 'ms' ? 'ms-MY' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return t('forum.justNow');
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} ${t('forum.minutesAgo')}`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ${t('forum.hoursAgo')}`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ${t('forum.daysAgo')}`;
        return formatDate(dateString);
    };

    return (
        <FarmerSidebarLayout breadcrumbs={[{ title: t('forum.title'), href: '/farmer/forum' }]}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{t('forum.title')}</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {t('forum.subtitle')}
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        {t('forum.createNew')}
                    </Button>
                </div>

                {/* Forum Posts List */}
                <div className="space-y-4">
                    {forums.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-gray-500">
                                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p>{t('forum.noForums')}</p>
                            </CardContent>
                        </Card>
                    ) : (
                        forums.map((forum) => (
                            <Card
                                key={forum.id}
                                className="hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => handleViewDetails(forum.id)}
                            >
                                <CardContent className="pt-6">
                                    {/* Forum Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {forum.title}
                                                </h3>
                                                {forum.category && (
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                                        {forum.category}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-4 w-4" />
                                                    <span>{forum.user.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{formatRelativeTime(forum.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Preview */}
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {forum.content}
                                    </p>

                                    {/* Forum Image Preview */}
                                    {forum.image && (
                                        <div className="mb-3">
                                            <img
                                                src={`/storage/${forum.image}`}
                                                alt={forum.title}
                                                className="rounded-lg max-h-48 object-cover w-full"
                                            />
                                        </div>
                                    )}

                                    {/* Forum Actions */}
                                    <div className="flex items-center gap-4 pt-3 border-t">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLike(forum.id);
                                            }}
                                            className={`flex items-center gap-1 text-sm ${
                                                forum.is_liked
                                                    ? 'text-green-600 font-medium'
                                                    : 'text-gray-600 hover:text-green-600'
                                            } transition-colors`}
                                        >
                                            <ThumbsUp
                                                className={`h-4 w-4 ${forum.is_liked ? 'fill-green-600' : ''}`}
                                            />
                                            <span>{forum.likes_count}</span>
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewDetails(forum.id);
                                            }}
                                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            <span>{forum.comments_count} {t('forum.comments')}</span>
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Create Forum Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{t('forum.form.createTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('forum.form.createDescription')}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t('forum.form.title')}</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder={t('forum.form.titlePlaceholder')}
                                required
                            />
                            {errors.title && (
                                <p className="text-sm text-red-600">{errors.title}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">{t('forum.form.category')}</Label>
                            <select
                                id="category"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">{t('forum.form.selectCategory')}</option>
                                <option value={t('forum.form.category.pestControl')}>{t('forum.form.category.pestControl')}</option>
                                <option value={t('forum.form.category.irrigation')}>{t('forum.form.category.irrigation')}</option>
                                <option value={t('forum.form.category.fertilizer')}>{t('forum.form.category.fertilizer')}</option>
                                <option value={t('forum.form.category.harvesting')}>{t('forum.form.category.harvesting')}</option>
                                <option value={t('forum.form.category.marketing')}>{t('forum.form.category.marketing')}</option>
                                <option value={t('forum.form.category.other')}>{t('forum.form.category.other')}</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">{t('forum.form.content')}</Label>
                            <Textarea
                                id="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder={t('forum.form.contentPlaceholder')}
                                rows={8}
                                required
                            />
                            {errors.content && (
                                <p className="text-sm text-red-600">{errors.content}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">{t('forum.form.image')}</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                className="cursor-pointer"
                            />
                            {errors.image && (
                                <p className="text-sm text-red-600">{errors.image}</p>
                            )}
                            <p className="text-xs text-gray-500">{t('forum.form.imageFormat')}</p>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsCreateDialogOpen(false);
                                    reset();
                                }}
                            >
                                {t('forum.form.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {processing ? t('forum.form.submitting') : t('forum.form.submit')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </FarmerSidebarLayout>
    );
}