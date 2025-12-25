import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminSidebarLayout from '@/layouts/app/admin-sidebar-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BookOpen,
    Plus,
    Edit,
    Trash2,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    Folder,
} from 'lucide-react';

interface Quiz {
    id: number;
    title: string;
    description: string | null;
    category: string;
    passing_score: number;
    time_limit: number | null;
    is_active: boolean;
    questions_count: number;
    attempts_count: number;
    learning_material: {
        id: number;
        title: string;
    } | null;
    creator: {
        name: string;
    };
    created_at: string;
}

interface Props {
    quizzes: Quiz[];
    categories: string[];
}

export default function AdminQuiz({ quizzes, categories }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

    const filteredQuizzes = selectedCategory === 'Semua'
        ? quizzes
        : quizzes.filter(q => q.category === selectedCategory);

    const allCategories = ['Semua', ...categories];

    const handleDelete = (id: number) => {
        if (confirm('Adakah anda pasti mahu memadam kuiz ini? Semua percubaan pengguna akan turut dipadam.')) {
            router.delete(`/admin/quiz/${id}`);
        }
    };

    return (
        <AdminSidebarLayout
            breadcrumbs={[{ title: 'Kuiz Pembelajaran', href: '/admin/quiz' }]}
        >
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Urus Kuiz Pembelajaran
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Cipta dan urus kuiz untuk menguji pengetahuan petani
                        </p>
                    </div>
                    <Button
                        onClick={() => router.visit('/admin/quiz/create')}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Kuiz
                    </Button>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Jumlah Kuiz
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {quizzes.length}
                                    </p>
                                </div>
                                <BookOpen className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Kuiz Aktif
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {quizzes.filter(q => q.is_active).length}
                                    </p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Kuiz Tidak Aktif
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {quizzes.filter(q => !q.is_active).length}
                                    </p>
                                </div>
                                <XCircle className="h-8 w-8 text-gray-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Jumlah Percubaan
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {quizzes.reduce((sum, q) => sum + q.attempts_count, 0)}
                                    </p>
                                </div>
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Category Filter */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 flex-wrap">
                            {allCategories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                    className={selectedCategory === category ? 'bg-green-600 hover:bg-green-700' : ''}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quizzes List */}
                <div className="space-y-4">
                    {filteredQuizzes.map((quiz) => (
                        <Card key={quiz.id} className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {quiz.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                quiz.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {quiz.is_active ? 'Aktif' : 'Tidak Aktif'}
                                            </span>
                                        </div>

                                        {quiz.description && (
                                            <p className="text-sm text-gray-600 mb-3">
                                                {quiz.description}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Folder className="h-4 w-4 text-blue-600" />
                                                <span>{quiz.category}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-purple-600" />
                                                <span>{quiz.questions_count} soalan</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <span>Markah lulus: {quiz.passing_score}%</span>
                                            </div>
                                            {quiz.time_limit && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-orange-600" />
                                                    <span>{quiz.time_limit} minit</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-blue-600" />
                                                <span>{quiz.attempts_count} percubaan</span>
                                            </div>
                                        </div>

                                        {quiz.learning_material && (
                                            <div className="mt-3 text-sm text-gray-500">
                                                Berkaitan: {quiz.learning_material.title}
                                            </div>
                                        )}

                                        <div className="mt-2 text-xs text-gray-500">
                                            Dicipta oleh {quiz.creator.name}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.visit(`/admin/quiz/${quiz.id}/edit`)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(quiz.id)}
                                            className="hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredQuizzes.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-600 text-center">
                                Tiada kuiz dijumpai. Klik butang "Tambah Kuiz" untuk mula.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminSidebarLayout>
    );
}
