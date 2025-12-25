import { router } from '@inertiajs/react';
import FarmerSidebarLayout from '@/layouts/app/farmer-sidebar-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Trophy,
    XCircle,
    CheckCircle,
    RotateCcw,
    ArrowLeft,
    BookOpen,
    Target,
} from 'lucide-react';

interface QuestionResult {
    id: number;
    question: string;
    options: [string, string, string, string];
    correct_answer: number;
    user_answer: number | null;
    is_correct: boolean;
    explanation: string | null;
}

interface QuizAttempt {
    id: number;
    score: number;
    passed: boolean;
    started_at: string;
    completed_at: string;
    quiz: {
        id: number;
        title: string;
        description: string | null;
        passing_score: number;
    };
}

interface Props {
    attempt: QuizAttempt;
    questions: QuestionResult[];
}

export default function QuizResult({ attempt, questions }: Props) {
    const correctCount = questions.filter(q => q.is_correct).length;
    const totalQuestions = questions.length;

    const handleRetry = () => {
        router.visit(`/farmer/quiz/${attempt.quiz.id}`);
    };

    const handleBackToQuizzes = () => {
        router.visit('/farmer/quiz');
    };

    return (
        <FarmerSidebarLayout
            breadcrumbs={[
                { title: 'Kuiz Pembelajaran', href: '/farmer/quiz' },
                { title: attempt.quiz.title, href: `/farmer/quiz/${attempt.quiz.id}` },
                { title: 'Keputusan', href: `/farmer/quiz-result/${attempt.id}` }
            ]}
        >
            <div className="p-6 space-y-6 max-w-4xl mx-auto">
                {/* Result Header */}
                <Card className={`overflow-hidden ${
                    attempt.passed
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-white'
                        : 'border-red-500 bg-gradient-to-br from-red-50 to-white'
                }`}>
                    <CardContent className="pt-8 pb-8 text-center">
                        <div className="mb-4">
                            {attempt.passed ? (
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                                    <Trophy className="h-10 w-10 text-green-600" />
                                </div>
                            ) : (
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
                                    <XCircle className="h-10 w-10 text-red-600" />
                                </div>
                            )}
                        </div>

                        <h1 className={`text-3xl font-bold mb-2 ${
                            attempt.passed ? 'text-green-700' : 'text-red-700'
                        }`}>
                            {attempt.passed ? 'Tahniah! Anda Lulus!' : 'Cuba Lagi'}
                        </h1>

                        <p className="text-gray-600 mb-6">
                            {attempt.quiz.title}
                        </p>

                        <div className="flex items-center justify-center gap-8 mb-6">
                            <div className="text-center">
                                <div className={`text-5xl font-bold ${
                                    attempt.passed ? 'text-green-700' : 'text-red-700'
                                }`}>
                                    {attempt.score}%
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Markah Anda
                                </div>
                            </div>

                            <div className="h-16 w-px bg-gray-300" />

                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    {correctCount}/{totalQuestions}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Jawapan Betul
                                </div>
                            </div>

                            <div className="h-16 w-px bg-gray-300" />

                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    {attempt.quiz.passing_score}%
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Markah Lulus
                                </div>
                            </div>
                        </div>

                        {!attempt.passed && (
                            <p className="text-red-600 font-medium">
                                Anda memerlukan {attempt.quiz.passing_score}% untuk lulus. Cuba lagi!
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3 justify-center">
                    <Button
                        variant="outline"
                        onClick={handleBackToQuizzes}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Senarai Kuiz
                    </Button>
                    <Button
                        onClick={handleRetry}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Cuba Lagi
                    </Button>
                </div>

                {/* Question Review */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-900">
                            Semakan Jawapan
                        </h2>
                    </div>

                    {questions.map((question, index) => (
                        <Card key={question.id} className={`border-2 ${
                            question.is_correct
                                ? 'border-green-200 bg-green-50/30'
                                : 'border-red-200 bg-red-50/30'
                        }`}>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                                        question.is_correct
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-3">
                                            {question.question}
                                        </h3>

                                        <div className="space-y-2">
                                            {question.options.map((option, oIndex) => {
                                                const isCorrect = oIndex === question.correct_answer;
                                                const isUserAnswer = oIndex === question.user_answer;
                                                const optionLabel = String.fromCharCode(65 + oIndex);

                                                return (
                                                    <div
                                                        key={oIndex}
                                                        className={`p-3 rounded-lg border-2 flex items-center gap-3 ${
                                                            isCorrect
                                                                ? 'border-green-500 bg-green-50'
                                                                : isUserAnswer
                                                                ? 'border-red-500 bg-red-50'
                                                                : 'border-gray-200 bg-white'
                                                        }`}
                                                    >
                                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                                                            isCorrect
                                                                ? 'bg-green-500 text-white'
                                                                : isUserAnswer
                                                                ? 'bg-red-500 text-white'
                                                                : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            {optionLabel}
                                                        </div>
                                                        <span className={`flex-1 ${
                                                            isCorrect || isUserAnswer
                                                                ? 'font-medium'
                                                                : ''
                                                        }`}>
                                                            {option}
                                                        </span>
                                                        {isCorrect && (
                                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                                        )}
                                                        {isUserAnswer && !isCorrect && (
                                                            <XCircle className="h-5 w-5 text-red-600" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {question.explanation && (
                                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <div className="flex items-start gap-2">
                                                    <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium text-blue-900 mb-1">
                                                            Penjelasan:
                                                        </p>
                                                        <p className="text-sm text-blue-800">
                                                            {question.explanation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {question.user_answer === null && (
                                            <div className="mt-3 text-sm text-orange-600 flex items-center gap-2">
                                                <XCircle className="h-4 w-4" />
                                                <span>Soalan ini tidak dijawab</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Bottom Actions */}
                <div className="flex gap-3 justify-center pb-6">
                    <Button
                        variant="outline"
                        onClick={handleBackToQuizzes}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Senarai Kuiz
                    </Button>
                    <Button
                        onClick={handleRetry}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Cuba Lagi
                    </Button>
                </div>
            </div>
        </FarmerSidebarLayout>
    );
}
