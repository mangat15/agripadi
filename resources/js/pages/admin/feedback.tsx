import { useState } from 'react';
import AdminSidebarLayout from '@/layouts/app/admin-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Star, MessageCircle, User, Calendar } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useLanguage } from '@/contexts/LanguageContext';

interface User {
    id: number;
    name: string;
    email: string;
}

interface FeedbackItem {
    id: number;
    user_id: number;
    type: 'positive' | 'improvement';
    message: string;
    rating: number | null;
    feature: string | null;
    is_read: boolean;
    admin_notes: string | null;
    created_at: string;
    user: User;
}

interface FeatureSatisfaction {
    feature: string;
    avg_rating: number;
    count: number;
}

interface Props {
    feedback: FeedbackItem[];
    stats: {
        total: number;
        positive: number;
        improvement: number;
        unread: number;
        average_rating: number;
    };
    featureSatisfaction: FeatureSatisfaction[];
}

export default function AdminFeedback({ feedback, stats, featureSatisfaction }: Props) {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'all' | 'positive' | 'improvement'>('all');

    const filteredFeedback = feedback.filter((item) => {
        if (activeTab === 'all') return true;
        return item.type === activeTab;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language === 'ms' ? 'ms-MY' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getRatingStars = (rating: number | null) => {
        if (!rating) return null;
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${
                            star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    const handleMarkAsRead = (feedbackId: number) => {
        router.put(`/admin/feedback/${feedbackId}/read`);
    };

    const handleDelete = (feedbackId: number) => {
        if (confirm(t('adminFeedback.deleteConfirm'))) {
            router.delete(`/admin/feedback/${feedbackId}`);
        }
    };

    const getFeatureSatisfactionColor = (avgRating: number) => {
        if (avgRating >= 4.5) return 'bg-green-500';
        if (avgRating >= 4) return 'bg-blue-500';
        if (avgRating >= 3.5) return 'bg-yellow-500';
        if (avgRating >= 3) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <AdminSidebarLayout breadcrumbs={[{ title: t('adminFeedback.title'), href: '/admin/feedback' }]}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <MessageCircle className="h-8 w-8 text-green-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{t('adminFeedback.title')}</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {t('adminFeedback.subtitle')}
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{t('adminFeedback.stats.total')}</p>
                                    <p className="text-2xl font-bold mt-1">{stats.total}</p>
                                </div>
                                <MessageCircle className="h-8 w-8 text-gray-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{t('adminFeedback.stats.positive')}</p>
                                    <p className="text-2xl font-bold mt-1 text-green-600">{stats.positive}</p>
                                    <p className="text-xs text-gray-500">
                                        {stats.total > 0
                                            ? Math.round((stats.positive / stats.total) * 100)
                                            : 0}
                                        %
                                    </p>
                                </div>
                                <ThumbsUp className="h-8 w-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{t('adminFeedback.stats.improvement')}</p>
                                    <p className="text-2xl font-bold mt-1 text-red-600">{stats.improvement}</p>
                                    <p className="text-xs text-gray-500">
                                        {stats.total > 0
                                            ? Math.round((stats.improvement / stats.total) * 100)
                                            : 0}
                                        %
                                    </p>
                                </div>
                                <ThumbsDown className="h-8 w-8 text-red-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{t('adminFeedback.stats.averageRating')}</p>
                                    <p className="text-2xl font-bold mt-1">
                                        {stats.average_rating ? stats.average_rating.toFixed(1) : 'N/A'}
                                        <span className="text-sm text-gray-500">/5</span>
                                    </p>
                                </div>
                                <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Feature Satisfaction */}
                {featureSatisfaction.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('adminFeedback.featureSatisfaction')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {featureSatisfaction.map((item) => (
                                    <div key={item.feature}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium">{item.feature}</span>
                                            <span className="text-sm text-gray-600">
                                                {item.avg_rating.toFixed(1)}/5
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${getFeatureSatisfactionColor(
                                                    item.avg_rating,
                                                )}`}
                                                style={{ width: `${(item.avg_rating / 5) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                                activeTab === 'all'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {t('adminFeedback.filter.all')}
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs ${
                                    activeTab === 'all'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                {stats.total}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('positive')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                                activeTab === 'positive'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <ThumbsUp className="h-4 w-4" />
                            {t('adminFeedback.filter.positive')}
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs ${
                                    activeTab === 'positive'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                {stats.positive}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('improvement')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                                activeTab === 'improvement'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <ThumbsDown className="h-4 w-4" />
                            {t('adminFeedback.filter.improvement')}
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs ${
                                    activeTab === 'improvement'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                {stats.improvement}
                            </span>
                        </button>
                    </nav>
                </div>

                {/* Feedback Summary Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Feedback List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-lg font-semibold">{t('adminFeedback.recentFeedback')}</h2>

                        {filteredFeedback.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center text-gray-500">
                                    {t('adminFeedback.noFeedback')}
                                </CardContent>
                            </Card>
                        ) : (
                            filteredFeedback.map((item) => (
                                <Card
                                    key={item.id}
                                    className={`${!item.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''}`}
                                >
                                    <CardContent className="pt-6">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-gray-600" />
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-semibold">{item.user.name}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {item.type === 'positive' ? (
                                                                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                                                                    {t('adminFeedback.type.positive')}
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                                                                    {t('adminFeedback.type.improvement')}
                                                                </span>
                                                            )}
                                                            {item.feature && (
                                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                                                    {item.feature}
                                                                </span>
                                                            )}
                                                            {!item.is_read && (
                                                                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded">
                                                                    {t('adminFeedback.new')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {item.rating && getRatingStars(item.rating)}
                                                </div>

                                                <p className="text-sm text-gray-700">{item.message}</p>

                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(item.created_at)}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {!item.is_read && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleMarkAsRead(item.id)}
                                                            >
                                                                {t('adminFeedback.markAsRead')}
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(item.id)}
                                                            className="hover:bg-red-50 hover:text-red-600"
                                                        >
                                                            {t('adminFeedback.delete')}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Summary Stats Sidebar */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">{t('adminFeedback.summary')}</h2>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">{t('adminFeedback.readStatus')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">{t('adminFeedback.stats.unread')}</span>
                                        <span className="font-semibold text-blue-600">{stats.unread}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">{t('adminFeedback.read')}</span>
                                        <span className="font-semibold">{stats.total - stats.unread}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mb-3">
                                        <ThumbsUp className="h-6 w-6 text-white" />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{t('adminFeedback.satisfactionRate')}</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        {stats.total > 0
                                            ? Math.round((stats.positive / stats.total) * 100)
                                            : 0}
                                        %
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {t('adminFeedback.basedOn')} {stats.total} {t('adminFeedback.feedbackCount')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminSidebarLayout>
    );
}