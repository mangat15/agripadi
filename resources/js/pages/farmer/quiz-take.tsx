import { useState, useEffect, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import FarmerSidebarLayout from '@/layouts/app/farmer-sidebar-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    Send,
    AlertCircle,
} from 'lucide-react';

interface QuizQuestion {
    id: number;
    question: string;
    options: [string, string, string, string];
    order: number;
}

interface Quiz {
    id: number;
    title: string;
    description: string | null;
    category: string;
    passing_score: number;
    time_limit: number | null;
    questions: QuizQuestion[];
}

interface Props {
    quiz: Quiz;
}

export default function QuizTake({ quiz }: Props) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(
        quiz.time_limit ? quiz.time_limit * 60 : null
    );
    const [startedAt] = useState(new Date().toISOString());

    const { post, processing } = useForm();

    const handleAutoSubmit = useCallback(() => {
        if (processing) return;

        post(`/farmer/quiz/${quiz.id}/submit`, {
            data: {
                answers: answers,
                started_at: startedAt,
            },
        });
    }, [post, processing, quiz.id, answers, startedAt]);

    // Timer countdown
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null || prev <= 1) {
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, handleAutoSubmit]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (questionId: number, optionIndex: number) => {
        setAnswers({
            ...answers,
            [questionId]: optionIndex,
        });
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handleSubmit = () => {
        const unanswered = quiz.questions.filter(q => answers[q.id] === undefined);

        if (unanswered.length > 0) {
            if (!confirm(`Anda masih ada ${unanswered.length} soalan yang belum dijawab. Adakah anda pasti mahu menghantar?`)) {
                return;
            }
        }

        post(`/farmer/quiz/${quiz.id}/submit`, {
            data: {
                answers: answers,
                started_at: startedAt,
            },
        });
    };

    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    return (
        <FarmerSidebarLayout
            breadcrumbs={[
                { title: 'Kuiz Pembelajaran', href: '/farmer/quiz' },
                { title: quiz.title, href: `/farmer/quiz/${quiz.id}` }
            ]}
        >
            <div className="p-6 space-y-6 max-w-4xl mx-auto">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {quiz.title}
                    </h1>
                    {quiz.description && (
                        <p className="text-sm text-gray-600 mt-1">
                            {quiz.description}
                        </p>
                    )}
                </div>

                {/* Timer and Progress */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Soalan {currentQuestion + 1} / {quiz.questions.length}
                                </div>
                                {timeLeft !== null && (
                                    <div className={`flex items-center gap-2 ${
                                        timeLeft < 60 ? 'text-red-600' : 'text-gray-900'
                                    }`}>
                                        <Clock className="h-5 w-5" />
                                        <span className="font-mono font-bold text-lg">
                                            {formatTime(timeLeft)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="text-xs text-gray-500">
                                {answeredCount} / {quiz.questions.length} soalan dijawab
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Question Card */}
                <Card>
                    <CardContent className="pt-6 space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold">
                                    {currentQuestion + 1}
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 flex-1">
                                    {question.question}
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {question.options.map((option, index) => {
                                const isSelected = answers[question.id] === index;
                                const optionLabel = String.fromCharCode(65 + index);

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleAnswerSelect(question.id, index)}
                                        className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-4 ${
                                            isSelected
                                                ? 'border-green-600 bg-green-50'
                                                : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                                            isSelected
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {optionLabel}
                                        </div>
                                        <span className={`flex-1 ${
                                            isSelected ? 'font-medium text-gray-900' : 'text-gray-700'
                                        }`}>
                                            {option}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Sebelumnya
                    </Button>

                    <div className="flex gap-2">
                        {quiz.questions.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setCurrentQuestion(index)}
                                className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                                    index === currentQuestion
                                        ? 'bg-green-600 text-white scale-110'
                                        : answers[quiz.questions[index].id] !== undefined
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    {currentQuestion < quiz.questions.length - 1 ? (
                        <Button
                            type="button"
                            onClick={handleNext}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Seterusnya
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            {processing ? 'Menghantar...' : 'Hantar Jawapan'}
                        </Button>
                    )}
                </div>

                {/* Warning if time is running out */}
                {timeLeft !== null && timeLeft < 120 && timeLeft > 0 && (
                    <Card className="border-orange-200 bg-orange-50">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 text-orange-800">
                                <AlertCircle className="h-5 w-5" />
                                <p className="text-sm font-medium">
                                    Amaran: Masa anda hampir tamat! Jawab soalan yang tinggal dengan cepat.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </FarmerSidebarLayout>
    );
}
