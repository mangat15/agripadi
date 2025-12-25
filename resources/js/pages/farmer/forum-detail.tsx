import { useState } from 'react';
import FarmerSidebarLayout from '@/layouts/app/farmer-sidebar-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThumbsUp, MessageCircle, User, Clock, ArrowLeft, Trash2 } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface ForumComment {
    id: number;
    forum_id: number;
    user_id: number;
    content: string;
    image: string | null;
    created_at: string;
    user: User;
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
    comments: ForumComment[];
}

interface Props {
    forum: Forum;
    auth: {
        user: User;
    };
}

export default function ForumDetail({ forum, auth }: Props) {
    const [showCommentForm, setShowCommentForm] = useState(false);

    const { data, setData, processing, reset } = useForm<{
        content: string;
        image: File | null;
    }>({
        content: '',
        image: null,
    });

    const handleLike = () => {
        router.post(`/farmer/forum/${forum.id}/like`, {}, {
            preserveScroll: true,
        });
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(`/farmer/forum/${forum.id}/comment`, data, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowCommentForm(false);
            },
        });
    };

    const handleDeleteComment = (commentId: number) => {
        if (confirm('Adakah anda pasti mahu memadam komen ini?')) {
            router.delete(`/farmer/forum/comment/${commentId}`, {
                preserveScroll: true,
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ms-MY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Baru sahaja';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minit yang lalu`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
        return formatDate(dateString);
    };

    return (
        <FarmerSidebarLayout
            breadcrumbs={[
                { title: 'Forum Komuniti', href: '/farmer/forum' },
                { title: forum.title, href: `/farmer/forum/${forum.id}` },
            ]}
        >
            <div className="p-6 space-y-6">
                {/* Back Button */}
                <Button
                    variant="outline"
                    onClick={() => router.get('/farmer/forum')}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Forum
                </Button>

                {/* Forum Post */}
                <Card>
                    <CardContent className="pt-6">
                        {/* Forum Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <h1 className="text-2xl font-bold text-gray-900">{forum.title}</h1>
                                {forum.category && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                                        {forum.category}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">{forum.user.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatDate(forum.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Forum Content */}
                        <div className="mb-6 space-y-4">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {forum.content}
                            </p>

                            {/* Forum Image */}
                            {forum.image && (
                                <div className="rounded-lg overflow-hidden">
                                    <img
                                        src={`/storage/${forum.image}`}
                                        alt={forum.title}
                                        className="w-full max-h-96 object-contain bg-gray-100"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Forum Actions */}
                        <div className="flex items-center gap-6 pt-4 border-t">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 ${
                                    forum.is_liked
                                        ? 'text-green-600 font-medium'
                                        : 'text-gray-600 hover:text-green-600'
                                } transition-colors`}
                            >
                                <ThumbsUp
                                    className={`h-5 w-5 ${forum.is_liked ? 'fill-green-600' : ''}`}
                                />
                                <span>{forum.likes_count} Suka</span>
                            </button>

                            <div className="flex items-center gap-2 text-gray-600">
                                <MessageCircle className="h-5 w-5" />
                                <span>{forum.comments_count} Komen</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Comments Section */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">
                                Komen ({forum.comments.length})
                            </h2>
                            {!showCommentForm && (
                                <Button
                                    onClick={() => setShowCommentForm(true)}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    Tambah Komen
                                </Button>
                            )}
                        </div>

                        {/* Comment Form */}
                        {showCommentForm && (
                            <form onSubmit={handleCommentSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
                                <div>
                                    <Textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder="Tulis komen anda di sini..."
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="comment-image" className="text-sm text-gray-600">
                                        Gambar (Pilihan)
                                    </Label>
                                    <Input
                                        id="comment-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                        className="cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Maksimum 5MB</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {processing ? 'Menghantar...' : 'Hantar Komen'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowCommentForm(false);
                                            reset();
                                        }}
                                    >
                                        Batal
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Comments List */}
                        <div className="space-y-4">
                            {forum.comments.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                                    <p>Tiada komen lagi. Jadilah yang pertama untuk berkomen!</p>
                                </div>
                            ) : (
                                forum.comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <User className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {comment.user.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatRelativeTime(comment.created_at)}
                                                    </p>
                                                </div>
                                            </div>

                                            {comment.user_id === auth.user.id && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="ml-10 space-y-2">
                                            <p className="text-gray-700 text-sm whitespace-pre-wrap">
                                                {comment.content}
                                            </p>

                                            {/* Comment Image */}
                                            {comment.image && (
                                                <div className="rounded-lg overflow-hidden max-w-md">
                                                    <img
                                                        src={`/storage/${comment.image}`}
                                                        alt="Comment image"
                                                        className="w-full max-h-64 object-contain bg-gray-100"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </FarmerSidebarLayout>
    );
}