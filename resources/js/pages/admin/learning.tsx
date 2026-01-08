import { useState } from 'react';
import AdminSidebarLayout from '@/layouts/app/admin-sidebar-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    BookOpen,
    Video,
    FileText,
    Plus,
    Trash2,
    Upload,
    Youtube,
    Folder,
    GraduationCap,
    ChevronDown,
    ChevronRight,
    ExternalLink,
} from 'lucide-react';
import { useForm, router } from '@inertiajs/react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LearningMaterial {
    id: number;
    title: string;
    description: string | null;
    type: 'pdf' | 'video' | 'quiz';
    category: string;
    file_path: string | null;
    video_url: string | null;
    quiz_url: string | null;
    thumbnail: string | null;
    uploaded_by: number;
    created_at: string;
    uploader: {
        name: string;
    };
}

interface Props {
    materials: LearningMaterial[];
    categories: string[];
}

export default function AdminLearningMaterial({ materials, categories }: Props) {
    const { t } = useLanguage();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<'pdf' | 'video' | 'quiz'>('video');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [newCategory, setNewCategory] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categories));

    const { data, setData, processing, errors, reset } = useForm({
        title: '',
        description: '',
        type: 'video' as 'pdf' | 'video' | 'quiz',
        category: '',
        file: null as File | null,
        video_url: '',
        quiz_url: '',
        thumbnail: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('type', data.type);
        formData.append('category', newCategory || data.category);

        if (data.type === 'pdf' && data.file) {
            formData.append('file', data.file);
        }

        if (data.type === 'video') {
            formData.append('video_url', data.video_url);
        }

        if (data.type === 'quiz') {
            formData.append('quiz_url', data.quiz_url);
        }

        if (data.thumbnail) {
            formData.append('thumbnail', data.thumbnail);
        }

        router.post('/admin/learning', formData, {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                reset();
                setNewCategory('');
            },
        });
    };

    const filteredMaterials = selectedCategory === 'all'
        ? materials
        : materials.filter(m => m.category === selectedCategory);

    // Group materials by category
    const materialsByCategory = filteredMaterials.reduce((acc, material) => {
        if (!acc[material.category]) {
            acc[material.category] = [];
        }
        acc[material.category].push(material);
        return acc;
    }, {} as Record<string, LearningMaterial[]>);

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    const getIcon = (type: 'pdf' | 'video' | 'quiz') => {
        switch (type) {
            case 'video':
                return <Video className="w-5 h-5 text-purple-600" />;
            case 'pdf':
                return <FileText className="w-5 h-5 text-red-600" />;
            case 'quiz':
                return <GraduationCap className="w-5 h-5 text-orange-600" />;
        }
    };

    const getTypeLabel = (type: 'pdf' | 'video' | 'quiz') => {
        switch (type) {
            case 'video':
                return 'VIDEO';
            case 'pdf':
                return 'PDF';
            case 'quiz':
                return 'KUIZ';
        }
    };

    const handleDelete = (id: number) => {
        if (confirm(t('adminLearning.deleteConfirm'))) {
            router.delete(`/admin/learning/${id}`);
        }
    };

    return (
        <AdminSidebarLayout
            breadcrumbs={[{ title: t('adminLearning.title'), href: '/admin/learning' }]}
        >
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {t('adminLearning.title')}
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {t('adminLearning.subtitle')}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setIsCreateDialogOpen(true)}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('adminLearning.addMaterial')}
                        </Button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        {t('adminLearning.stats.total')}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {materials.length}
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
                                        {t('adminLearning.stats.categories')}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {categories.length}
                                    </p>
                                </div>
                                <Folder className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        {t('adminLearning.stats.videos')}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {materials.filter(m => m.type === 'video').length}
                                    </p>
                                </div>
                                <Video className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        {t('adminLearning.stats.pdfs')}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {materials.filter(m => m.type === 'pdf').length}
                                    </p>
                                </div>
                                <FileText className="h-8 w-8 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Kuiz
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {materials.filter(m => m.type === 'quiz').length}
                                    </p>
                                </div>
                                <GraduationCap className="h-8 w-8 text-orange-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap">
                    <Button
                        onClick={() => setSelectedCategory('all')}
                        variant={selectedCategory === 'all' ? 'default' : 'outline'}
                        size="sm"
                        className={selectedCategory === 'all' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                        Semua
                    </Button>
                    {categories.map((category) => (
                        <Button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            variant={selectedCategory === category ? 'default' : 'outline'}
                            size="sm"
                            className={selectedCategory === category ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                {/* Materials List */}
                {Object.keys(materialsByCategory).length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-600 text-center">
                                {t('adminLearning.noMaterials')}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {Object.entries(materialsByCategory).map(([category, categoryMaterials]) => (
                            <Card key={category} className="overflow-hidden">
                                {/* Category Header */}
                                <div
                                    className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200 cursor-pointer hover:from-green-100 hover:to-green-150 transition-colors"
                                    onClick={() => toggleCategory(category)}
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-green-900 flex items-center gap-2">
                                            {expandedCategories.has(category) ? (
                                                <ChevronDown className="w-5 h-5" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5" />
                                            )}
                                            {category}
                                        </h2>
                                        <span className="text-sm font-medium text-green-700">
                                            {categoryMaterials.length} bahan
                                        </span>
                                    </div>
                                </div>

                                {/* Materials List */}
                                {expandedCategories.has(category) && (
                                    <div className="divide-y divide-gray-200">
                                        {categoryMaterials.map((material) => (
                                            <div
                                                key={material.id}
                                                className="px-6 py-4 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    {/* Material Info */}
                                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                                        {/* Icon */}
                                                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            {getIcon(material.type)}
                                                        </div>

                                                        {/* Title and Type */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs font-bold text-gray-500 uppercase">
                                                                    {getTypeLabel(material.type)}
                                                                </span>
                                                            </div>
                                                            <h3 className="text-base font-medium text-gray-900 truncate">
                                                                {material.title}
                                                            </h3>
                                                            {material.description && (
                                                                <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                                                                    {material.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {material.type === 'pdf' && material.file_path && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                asChild
                                                            >
                                                                <a href={`/storage/${material.file_path}`} target="_blank" rel="noopener noreferrer">
                                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                                    Buka
                                                                </a>
                                                            </Button>
                                                        )}
                                                        {material.type === 'video' && material.video_url && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                asChild
                                                            >
                                                                <a href={material.video_url} target="_blank" rel="noopener noreferrer">
                                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                                    Tonton
                                                                </a>
                                                            </Button>
                                                        )}
                                                        {material.type === 'quiz' && material.quiz_url && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                asChild
                                                            >
                                                                <a href={material.quiz_url} target="_blank" rel="noopener noreferrer">
                                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                                    Buka Kuiz
                                                                </a>
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDelete(material.id)}
                                                            className="hover:bg-red-50 hover:text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{t('adminLearning.form.title')}</DialogTitle>
                        <DialogDescription>{t('adminLearning.form.description')}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t('adminLearning.form.titleLabel')}</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder={t('adminLearning.form.titlePlaceholder')}
                                required
                            />
                            {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">{t('adminLearning.form.descriptionLabel')}</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder={t('adminLearning.form.descriptionPlaceholder')}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">{t('adminLearning.form.categoryLabel')}</Label>
                            <div className="flex gap-2">
                                <Select
                                    value={data.category}
                                    onValueChange={(value) => {
                                        setData('category', value);
                                        setNewCategory('');
                                    }}
                                >
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder={t('adminLearning.form.selectCategory')} />
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
                                        placeholder={t('adminLearning.form.newCategory')}
                                        value={newCategory}
                                        onChange={(e) => {
                                            setNewCategory(e.target.value);
                                            setData('category', '');
                                        }}
                                    />
                                </div>
                            </div>
                            {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
                            <p className="text-xs text-gray-500">
                                {t('adminLearning.form.categoryExample')}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>{t('adminLearning.form.typeLabel')}</Label>
                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedType('video');
                                        setData('type', 'video');
                                    }}
                                    className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 ${
                                        selectedType === 'video'
                                            ? 'border-purple-600 bg-purple-50'
                                            : 'border-gray-200 hover:border-purple-300'
                                    }`}
                                >
                                    <Youtube className="h-5 w-5" />
                                    <span className="text-sm">{t('adminLearning.form.videoYoutube')}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedType('pdf');
                                        setData('type', 'pdf');
                                    }}
                                    className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 ${
                                        selectedType === 'pdf'
                                            ? 'border-red-600 bg-red-50'
                                            : 'border-gray-200 hover:border-red-300'
                                    }`}
                                >
                                    <FileText className="h-5 w-5" />
                                    <span className="text-sm">{t('adminLearning.form.pdfDocument')}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedType('quiz');
                                        setData('type', 'quiz');
                                    }}
                                    className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 ${
                                        selectedType === 'quiz'
                                            ? 'border-orange-600 bg-orange-50'
                                            : 'border-gray-200 hover:border-orange-300'
                                    }`}
                                >
                                    <GraduationCap className="h-5 w-5" />
                                    <span className="text-sm">Kuiz</span>
                                </button>
                            </div>
                        </div>

                        {selectedType === 'video' && (
                            <div className="space-y-2">
                                <Label htmlFor="video_url">{t('adminLearning.form.videoUrl')}</Label>
                                <Input
                                    id="video_url"
                                    value={data.video_url}
                                    onChange={(e) => setData('video_url', e.target.value)}
                                    placeholder={t('adminLearning.form.videoUrlPlaceholder')}
                                    required={selectedType === 'video'}
                                />
                                {errors.video_url && <p className="text-sm text-red-600">{errors.video_url}</p>}
                            </div>
                        )}

                        {selectedType === 'pdf' && (
                            <div className="space-y-2">
                                <Label htmlFor="file">{t('adminLearning.form.pdfFile')}</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
                                    <input
                                        type="file"
                                        id="file"
                                        accept=".pdf"
                                        onChange={(e) => setData('file', e.target.files?.[0] || null)}
                                        className="hidden"
                                        required={selectedType === 'pdf'}
                                    />
                                    <label htmlFor="file" className="cursor-pointer">
                                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">
                                            {data.file ? data.file.name : t('adminLearning.form.uploadPdf')}
                                        </p>
                                    </label>
                                </div>
                                {errors.file && <p className="text-sm text-red-600">{errors.file}</p>}
                            </div>
                        )}

                        {selectedType === 'quiz' && (
                            <div className="space-y-2">
                                <Label htmlFor="quiz_url">Pautan Kuiz (Google Form)</Label>
                                <Input
                                    id="quiz_url"
                                    value={data.quiz_url}
                                    onChange={(e) => setData('quiz_url', e.target.value)}
                                    placeholder="https://forms.gle/xxxxx atau https://docs.google.com/forms/..."
                                    required={selectedType === 'quiz'}
                                />
                                {errors.quiz_url && <p className="text-sm text-red-600">{errors.quiz_url}</p>}
                                <p className="text-xs text-gray-500">
                                    Masukkan pautan penuh ke Google Form atau kuiz luaran lain
                                </p>
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsCreateDialogOpen(false);
                                    reset();
                                }}
                            >
                                {t('adminLearning.form.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {processing ? t('adminLearning.form.uploading') : t('adminLearning.form.upload')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminSidebarLayout>
    );
}