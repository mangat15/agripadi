import { useState } from 'react';
import { router } from '@inertiajs/react';
import FarmerSidebarLayout from '@/layouts/app/farmer-sidebar-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BookOpen,
    Clock,
    CheckCircle,
    XCircle,
    Trophy,
    Play,
    Folder,
} from 'lucide-react';

interface Quiz {
    id: number;
    title: string;
    description: string | null;
    category: string;
    passing_score: number;
    time_limit: number | null;
    questions_count: number;
    learning_material: {
        id: number;
        title: string;
    } | null;
}

interface QuizAttempt {
    quiz_id: number;
    score: number;
    passed: boolean;
    completed_at: string;
}

interface Props {
    quizzes: Quiz[];
    categories: string[];
    attempts: Record<number, QuizAttempt>;
}

export default function FarmerQuiz({ quizzes, categories, attempts }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

    const filteredQuizzes = selectedCategory === 'Semua'
        ? quizzes
        : quizzes.filter(q => q.category === selectedCategory);

    const allCategories = ['Semua', ...categories];

    const getAttempt = (quizId: number): QuizAttempt | undefined => {
        return attempts[quizId];
    };

    const handleStartQuiz = (quizId: number) => {
        router.visit(`/farmer/quiz/${quizId}`);
    };

    return (
        <FarmerSidebarLayout
            breadcrumbs={[{ title: 'Kuiz Pembelajaran', href: '/farmer/quiz' }]}
        >
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Kuiz Pembelajaran
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Uji pengetahuan anda dengan kuiz interaktif
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Kuiz Tersedia
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
                                        Kuiz Selesai
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {Object.keys(attempts).length}
                                    </p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Kuiz Lulus
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {Object.values(attempts).filter(a => a.passed).length}
                                    </p>
                                </div>
                                <Trophy className="h-8 w-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Category Filter */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Folder className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700 mr-2">Kategori:</span>
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

                {/* Quizzes Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredQuizzes.map((quiz) => {
                        const attempt = getAttempt(quiz.id);

                        return (
                            <Card key={quiz.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className={`h-2 ${
                                    attempt
                                        ? attempt.passed
                                            ? 'bg-green-500'
                                            : 'bg-red-500'
                                        : 'bg-blue-500'
                                }`} />
                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {quiz.title}
                                            </h3>
                                            {attempt && (
                                                <div className="flex items-center gap-1">
                                                    {attempt.passed ? (
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <XCircle className="h-5 w-5 text-red-600" />
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {quiz.description && (
                                            <p className="text-sm text-gray-600 mb-3">
                                                {quiz.description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-2 mb-3">
                                            <Folder className="h-4 w-4 text-blue-600" />
                                            <span className="text-xs font-medium text-blue-600">
                                                {quiz.category}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4" />
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
                                        </div>

                                        {quiz.learning_material && (
                                            <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                                                Berkaitan: {quiz.learning_material.title}
                                            </div>
                                        )}
                                    </div>

                                    {attempt && (
                                        <div className={`p-3 rounded ${
                                            attempt.passed
                                                ? 'bg-green-50 border border-green-200'
                                                : 'bg-red-50 border border-red-200'
                                        }`}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
                                                    Percubaan Terakhir
                                                </span>
                                                <span className={`text-lg font-bold ${
                                                    attempt.passed ? 'text-green-700' : 'text-red-700'
                                                }`}>
                                                    {attempt.score}%
                                                </span>
                                            </div>
                                            <p className={`text-xs mt-1 ${
                                                attempt.passed ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {attempt.passed ? 'Tahniah! Anda lulus' : 'Cuba lagi untuk lulus'}
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        onClick={() => handleStartQuiz(quiz.id)}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                    >
                                        <Play className="h-4 w-4 mr-2" />
                                        {attempt ? 'Cuba Lagi' : 'Mula Kuiz'}
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {filteredQuizzes.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-600 text-center">
                                Tiada kuiz tersedia dalam kategori ini
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </FarmerSidebarLayout>
    );
}
