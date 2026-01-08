import { useState } from 'react';
import AdminSidebarLayout from '@/layouts/app/admin-sidebar-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    MessageSquare,
    CheckCircle,
    XCircle,
    Clock,
    Trash2,
    ThumbsUp,
    MessageCircle,
    User,
} from 'lucide-react';
import { router } from '@inertiajs/react';
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
    category: string | null;
    status: 'pending' | 'approved' | 'rejected';
    likes_count: number;
    comments_count: number;
    created_at: string;
    updated_at: string;
    user: User;
    rejection_reason?: string | null;
}

interface Stats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

interface Props {
    forums: Forum[];
    stats: Stats;
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdminForum({ forums, stats }: Props) {
    const { t, language } = useLanguage();
    const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
    const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const filteredForums = forums.filter((forum) => {
        if (activeFilter === 'all') return true;
        return forum.status === activeFilter;
    });

    const handleApprove = (forumId: number) => {
        if (confirm(t('adminForum.approveConfirm'))) {
            router.post(`/admin/forum/${forumId}/approve`);
        }
    };

    const handleRejectClick = (forum: Forum) => {
        setSelectedForum(forum);
        setIsRejectDialogOpen(true);
    };

    const handleRejectSubmit = () => {
        if (selectedForum) {
            router.post(`/admin/forum/${selectedForum.id}/reject`, {
                rejection_reason: rejectionReason,
            }, {
                onSuccess: () => {
                    setIsRejectDialogOpen(false);
                    setRejectionReason('');
                    setSelectedForum(null);
                },
            });
        }
    };

    const handleDelete = (forumId: number) => {
        if (confirm(t('adminForum.deleteConfirm'))) {
            router.delete(`/admin/forum/${forumId}`);
        }
    };

    const handleViewDetails = (forum: Forum) => {
        setSelectedForum(forum);
        setIsViewDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language === 'ms' ? 'ms-MY' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{t('adminForum.status.pending')}</Badge>;
            case 'approved':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t('adminForum.status.approved')}</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{t('adminForum.status.rejected')}</Badge>;
            default:
                return null;
        }
    };

    return (
        <AdminSidebarLayout breadcrumbs={[{ title: t('adminForum.title'), href: '/admin/forum' }]}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('adminForum.title')}</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {t('adminForum.subtitle')}
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{t('adminForum.stats.total')}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                                <MessageSquare className="h-8 w-8 text-gray-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{t('adminForum.stats.pending')}</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{t('adminForum.stats.approved')}</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{t('adminForum.stats.rejected')}</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                                </div>
                                <XCircle className="h-8 w-8 text-red-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 border-b">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeFilter === 'all'
                                ? 'border-b-2 border-green-600 text-green-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        {t('adminForum.filter.all')} ({stats.total})
                    </button>
                    <button
                        onClick={() => setActiveFilter('pending')}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeFilter === 'pending'
                                ? 'border-b-2 border-yellow-600 text-yellow-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        {t('adminForum.filter.pending')} ({stats.pending})
                    </button>
                    <button
                        onClick={() => setActiveFilter('approved')}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeFilter === 'approved'
                                ? 'border-b-2 border-green-600 text-green-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        {t('adminForum.filter.approved')} ({stats.approved})
                    </button>
                    <button
                        onClick={() => setActiveFilter('rejected')}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeFilter === 'rejected'
                                ? 'border-b-2 border-red-600 text-red-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        {t('adminForum.filter.rejected')} ({stats.rejected})
                    </button>
                </div>

                {/* Forums List */}
                <div className="space-y-4">
                    {filteredForums.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-gray-500">
                                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p>{t('adminForum.noForums')}</p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredForums.map((forum) => (
                            <Card key={forum.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* Forum Header */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {forum.title}
                                                </h3>
                                                {forum.category && (
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                                        {forum.category}
                                                    </span>
                                                )}
                                                {getStatusBadge(forum.status)}
                                            </div>

                                            {/* Forum Meta */}
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-4 w-4" />
                                                    <span>{forum.user.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{formatDate(forum.created_at)}</span>
                                                </div>
                                            </div>

                                            {/* Content Preview */}
                                            <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                                                {forum.content}
                                            </p>

                                            {/* Rejection Reason */}
                                            {forum.status === 'rejected' && forum.rejection_reason && (
                                                <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                                                    <p className="text-sm font-medium text-red-800 mb-1">
                                                        {t('adminForum.rejectionReason')}
                                                    </p>
                                                    <p className="text-sm text-red-700">
                                                        {forum.rejection_reason}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Forum Stats */}
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <ThumbsUp className="h-4 w-4" />
                                                    <span>{forum.likes_count} {t('adminForum.likes')}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MessageCircle className="h-4 w-4" />
                                                    <span>{forum.comments_count} {t('adminForum.comments')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-2 ml-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetails(forum)}
                                            >
                                                {t('adminForum.viewFull')}
                                            </Button>

                                            {forum.status === 'pending' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApprove(forum.id)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        {t('adminForum.approve')}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleRejectClick(forum)}
                                                        className="border-red-300 text-red-600 hover:bg-red-50"
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        {t('adminForum.reject')}
                                                    </Button>
                                                </>
                                            )}

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDelete(forum.id)}
                                                className="border-red-300 text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                {t('adminForum.delete')}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* View Forum Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedForum?.title}
                            {selectedForum?.category && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                    {selectedForum.category}
                                </span>
                            )}
                            {selectedForum && getStatusBadge(selectedForum.status)}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedForum && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">{selectedForum.user.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatDate(selectedForum.created_at)}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {selectedForum.content}
                                </p>
                            </div>

                            {selectedForum.status === 'rejected' && selectedForum.rejection_reason && (
                                <div className="bg-red-50 border border-red-200 rounded p-3">
                                    <p className="text-sm font-medium text-red-800 mb-1">
                                        {t('adminForum.rejectionReason')}
                                    </p>
                                    <p className="text-sm text-red-700">
                                        {selectedForum.rejection_reason}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center gap-6 pt-4 border-t">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <ThumbsUp className="h-5 w-5" />
                                    <span>{selectedForum.likes_count} {t('adminForum.likes')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MessageCircle className="h-5 w-5" />
                                    <span>{selectedForum.comments_count} {t('adminForum.comments')}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Reject Forum Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('adminForum.form.rejectTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('adminForum.form.rejectDescription')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="rejection_reason">{t('adminForum.form.rejectionReasonLabel')}</Label>
                            <Textarea
                                id="rejection_reason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder={t('adminForum.form.rejectionReasonPlaceholder')}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsRejectDialogOpen(false);
                                setRejectionReason('');
                            }}
                        >
                            {t('adminForum.form.cancel')}
                        </Button>
                        <Button
                            onClick={handleRejectSubmit}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {t('adminForum.form.rejectButton')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminSidebarLayout>
    );
}