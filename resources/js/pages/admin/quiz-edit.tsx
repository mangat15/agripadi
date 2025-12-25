import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminSidebarLayout from '@/layouts/app/admin-sidebar-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, CheckCircle } from 'lucide-react';

interface LearningMaterial {
    id: number;
    title: string;
    category: string;
}

interface QuizQuestion {
    id: number;
    question: string;
    options: [string, string, string, string];
    correct_answer: number;
    explanation: string | null;
    order: number;
}

interface Quiz {
    id: number;
    title: string;
    description: string | null;
    category: string;
    learning_material_id: number | null;
    passing_score: number;
    time_limit: number | null;
    is_active: boolean;
    questions: QuizQuestion[];
}

interface Props {
    quiz: Quiz;
    categories: string[];
    learningMaterials: LearningMaterial[];
}

interface Question {
    question: string;
    options: [string, string, string, string];
    correct_answer: number;
    explanation: string;
}

export default function QuizEdit({ quiz, categories, learningMaterials }: Props) {
    const [newCategory, setNewCategory] = useState('');
    const [questions, setQuestions] = useState<Question[]>(
        quiz.questions.map(q => ({
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation || ''
        }))
    );

    const { data, setData, put, processing, errors } = useForm({
        title: quiz.title,
        description: quiz.description || '',
        category: quiz.category,
        learning_material_id: quiz.learning_material_id?.toString() || '',
        passing_score: quiz.passing_score,
        time_limit: quiz.time_limit?.toString() || '',
        is_active: quiz.is_active,
        questions: questions,
    });

    useEffect(() => {
        setData('questions', questions);
    }, [questions]);

    const addQuestion = () => {
        const newQuestion: Question = {
            question: '',
            options: ['', '', '', ''],
            correct_answer: 0,
            explanation: ''
        };
        setQuestions([...questions, newQuestion]);
    };

    const removeQuestion = (index: number) => {
        if (questions.length > 1) {
            const updated = questions.filter((_, i) => i !== index);
            setQuestions(updated);
        }
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };
        setQuestions(updated);
    };

    const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
        const updated = [...questions];
        const options = [...updated[questionIndex].options] as [string, string, string, string];
        options[optionIndex] = value;
        updated[questionIndex] = { ...updated[questionIndex], options };
        setQuestions(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = {
            ...data,
            category: newCategory || data.category,
            learning_material_id: data.learning_material_id || null,
            time_limit: data.time_limit ? parseInt(data.time_limit) : null,
            questions: questions,
        };

        put(`/admin/quiz/${quiz.id}`, {
            data: formData,
            onSuccess: () => {
                router.visit('/admin/quiz');
            },
        });
    };

    return (
        <AdminSidebarLayout
            breadcrumbs={[
                { title: 'Kuiz Pembelajaran', href: '/admin/quiz' },
                { title: 'Edit Kuiz', href: `/admin/quiz/${quiz.id}/edit` }
            ]}
        >
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Edit Kuiz
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Kemaskini butiran kuiz dan soalan
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Maklumat Asas
                            </h2>

                            <div className="space-y-2">
                                <Label htmlFor="title">Tajuk Kuiz *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="cth: Kuiz Pengurusan Serangga Perosak"
                                    required
                                />
                                {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Penerangan</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Terangkan tentang kuiz ini..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Kategori *</Label>
                                <div className="flex gap-2">
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) => {
                                            setData('category', value);
                                            setNewCategory('');
                                        }}
                                    >
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Atau masukkan kategori baharu"
                                            value={newCategory}
                                            onChange={(e) => {
                                                setNewCategory(e.target.value);
                                                setData('category', '');
                                            }}
                                        />
                                    </div>
                                </div>
                                {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="learning_material_id">
                                    Bahan Pembelajaran Berkaitan (Pilihan)
                                </Label>
                                <Select
                                    value={data.learning_material_id}
                                    onValueChange={(value) => setData('learning_material_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih bahan pembelajaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Tiada</SelectItem>
                                        {learningMaterials.map((material) => (
                                            <SelectItem key={material.id} value={material.id.toString()}>
                                                [{material.category}] {material.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="passing_score">Markah Lulus (%) *</Label>
                                    <Input
                                        id="passing_score"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={data.passing_score}
                                        onChange={(e) => setData('passing_score', parseInt(e.target.value))}
                                        required
                                    />
                                    {errors.passing_score && <p className="text-sm text-red-600">{errors.passing_score}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="time_limit">Had Masa (Minit)</Label>
                                    <Input
                                        id="time_limit"
                                        type="number"
                                        min="1"
                                        value={data.time_limit}
                                        onChange={(e) => setData('time_limit', e.target.value)}
                                        placeholder="Kosongkan untuk tiada had masa"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">
                                    Aktifkan kuiz ini (petani boleh mengambil kuiz)
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Questions */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Soalan ({questions.length})
                            </h2>
                            <Button
                                type="button"
                                onClick={addQuestion}
                                variant="outline"
                                size="sm"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Soalan
                            </Button>
                        </div>

                        {questions.map((question, qIndex) => (
                            <Card key={qIndex}>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-medium text-gray-900">
                                            Soalan {qIndex + 1}
                                        </h3>
                                        {questions.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeQuestion(qIndex)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Soalan *</Label>
                                        <Textarea
                                            value={question.question}
                                            onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                            placeholder="Masukkan soalan..."
                                            rows={2}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Pilihan Jawapan *</Label>
                                        {question.options.map((option, oIndex) => (
                                            <div key={oIndex} className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                                                    {String.fromCharCode(65 + oIndex)}
                                                </div>
                                                <Input
                                                    value={option}
                                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                    placeholder={`Pilihan ${String.fromCharCode(65 + oIndex)}`}
                                                    required
                                                    className="flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    variant={question.correct_answer === oIndex ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => updateQuestion(qIndex, 'correct_answer', oIndex)}
                                                    className={question.correct_answer === oIndex ? 'bg-green-600 hover:bg-green-700' : ''}
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <p className="text-xs text-gray-500">
                                            Klik butang ✓ untuk tandakan jawapan yang betul
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Penjelasan (Pilihan)</Label>
                                        <Textarea
                                            value={question.explanation}
                                            onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                                            placeholder="Jelaskan kenapa jawapan ini betul..."
                                            rows={2}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Penjelasan akan ditunjukkan kepada petani selepas mereka selesai kuiz
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/admin/quiz')}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminSidebarLayout>
    );
}
