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
} from 'lucide-react';
import { useForm, router } from '@inertiajs/react';

interface LearningMaterial {
    id: number;
    title: string;
    description: string | null;
    type: 'pdf' | 'video';
    category: string;
    file_path: string | null;
    video_url: string | null;
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
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<'pdf' | 'video'>('video');
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
    const [newCategory, setNewCategory] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        type: 'video' as 'pdf' | 'video',
        category: '',
        file: null as File | null,
        video_url: '',
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

    const filteredMaterials = selectedCategory === 'Semua'
        ? materials
        : materials.filter(m => m.category === selectedCategory);

    const allCategories = ['Semua', ...categories];

    const handleDelete = (id: number) => {
        if (confirm('Adakah anda pasti mahu memadam bahan pembelajaran ini?')) {
            router.delete(`/admin/learning/${id}`);
        }
    };

    const getYouTubeEmbedUrl = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : null;
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    return (
        <AdminSidebarLayout
            breadcrumbs={[{ title: 'Bahan Pembelajaran', href: '/admin/learning' }]}
        >
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Urus Bahan Pembelajaran
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Muat naik dan urus sumber pendidikan untuk petani
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => router.visit('/admin/quiz')}
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                            <GraduationCap className="h-4 w-4 mr-2" />
                            Urus Kuiz
                        </Button>
                        <Button
                            onClick={() => setIsCreateDialogOpen(true)}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Bahan
                        </Button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Jumlah Bahan
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
                                        Kategori
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
                                        Video YouTube
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
                                        Dokumen PDF
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {materials.filter(m => m.type === 'pdf').length}
                                    </p>
                                </div>
                                <FileText className="h-8 w-8 text-red-600" />
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

                {/* Materials Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredMaterials.map((material) => (
                        <Card key={material.id} className="overflow-hidden">
                            <div className="relative">
                                {material.type === 'video' && material.video_url ? (
                                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                        <Youtube className="h-12 w-12 text-red-600" />
                                    </div>
                                ) : material.type === 'pdf' ? (
                                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                        <FileText className="h-12 w-12 text-red-600" />
                                    </div>
                                ) : null}
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        material.type === 'video'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {material.type === 'video' ? 'Video' : 'PDF'}
                                    </span>
                                </div>
                            </div>
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Folder className="h-4 w-4 text-blue-600" />
                                    <span className="text-xs font-medium text-blue-600">
                                        {material.category}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-gray-900 line-clamp-2">
                                    {material.title}
                                </h3>
                                {material.description && (
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {material.description}
                                    </p>
                                )}
                                <div className="text-xs text-gray-500">
                                    Dimuat naik oleh {material.uploader.name}
                                </div>
                                <div className="flex gap-2">
                                    {material.type === 'pdf' && material.file_path && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            asChild
                                        >
                                            <a href={`/storage/${material.file_path}`} target="_blank" rel="noopener noreferrer">
                                                Lihat PDF
                                            </a>
                                        </Button>
                                    )}
                                    {material.type === 'video' && material.video_url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            asChild
                                        >
                                            <a href={material.video_url} target="_blank" rel="noopener noreferrer">
                                                Tonton Video
                                            </a>
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(material.id)}
                                        className="hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {materials.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-600 text-center">
                                Tiada bahan pembelajaran. Klik butang "Tambah Bahan" untuk mula.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Tambah Bahan Pembelajaran</DialogTitle>
                        <DialogDescription>Muat naik video YouTube atau dokumen PDF untuk petani</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Tajuk *</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Masukkan tajuk bahan pembelajaran"
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
                                placeholder="Terangkan kandungan bahan pembelajaran..."
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
                            <p className="text-xs text-gray-500">
                                Contoh: Serangga Perosak, Pengurusan Tanaman, Baja & Racun, dll.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Jenis Bahan *</Label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedType('video');
                                        setData('type', 'video');
                                    }}
                                    className={`flex-1 p-4 border-2 rounded-lg flex items-center justify-center gap-2 ${
                                        selectedType === 'video'
                                            ? 'border-purple-600 bg-purple-50'
                                            : 'border-gray-200 hover:border-purple-300'
                                    }`}
                                >
                                    <Youtube className="h-5 w-5" />
                                    <span>Video YouTube</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedType('pdf');
                                        setData('type', 'pdf');
                                    }}
                                    className={`flex-1 p-4 border-2 rounded-lg flex items-center justify-center gap-2 ${
                                        selectedType === 'pdf'
                                            ? 'border-red-600 bg-red-50'
                                            : 'border-gray-200 hover:border-red-300'
                                    }`}
                                >
                                    <FileText className="h-5 w-5" />
                                    <span>Dokumen PDF</span>
                                </button>
                            </div>
                        </div>

                        {selectedType === 'video' && (
                            <div className="space-y-2">
                                <Label htmlFor="video_url">URL Video YouTube *</Label>
                                <Input
                                    id="video_url"
                                    value={data.video_url}
                                    onChange={(e) => setData('video_url', e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    required={selectedType === 'video'}
                                />
                                {errors.video_url && <p className="text-sm text-red-600">{errors.video_url}</p>}
                            </div>
                        )}

                        {selectedType === 'pdf' && (
                            <div className="space-y-2">
                                <Label htmlFor="file">Fail PDF *</Label>
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
                                            {data.file ? data.file.name : 'Klik untuk muat naik PDF (Max: 50MB)'}
                                        </p>
                                    </label>
                                </div>
                                {errors.file && <p className="text-sm text-red-600">{errors.file}</p>}
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
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {processing ? 'Memuat naik...' : 'Muat Naik'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminSidebarLayout>
    );
}