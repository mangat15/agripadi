import { useState } from 'react';
import FarmerSidebarLayout from '@/layouts/app/farmer-sidebar-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    BookOpen,
    Search,
    Video,
    FileText,
    Play,
    Folder,
} from 'lucide-react';

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

export default function FarmerLearningMaterial({ materials, categories }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

    const filteredMaterials = materials.filter((material) => {
        const matchesSearch =
            material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (material.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Semua' || material.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const allCategories = ['Semua', ...categories];

    const getYouTubeEmbedUrl = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : null;
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    const handleViewMaterial = (material: LearningMaterial) => {
        setSelectedMaterial(material);
        setIsViewDialogOpen(true);
    };

    return (
        <FarmerSidebarLayout
            breadcrumbs={[{ title: 'Bahan Pembelajaran', href: '/farmer/learning' }]}
        >
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Bahan Pembelajaran
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Akses video dan dokumen pembelajaran pertanian
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-3">
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

                {/* Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Cari bahan pembelajaran..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

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

                {/* Materials Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredMaterials.map((material) => (
                        <Card
                            key={material.id}
                            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleViewMaterial(material)}
                        >
                            <div className="relative">
                                {material.type === 'video' && material.video_url ? (
                                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                                        <div className="text-center">
                                            <Play className="h-16 w-16 text-purple-600 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-purple-800">Video YouTube</p>
                                        </div>
                                    </div>
                                ) : material.type === 'pdf' ? (
                                    <div className="aspect-video bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                                        <div className="text-center">
                                            <FileText className="h-16 w-16 text-red-600 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-red-800">Dokumen PDF</p>
                                        </div>
                                    </div>
                                ) : null}
                                <div className="absolute top-2 right-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        material.type === 'video'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-red-600 text-white'
                                    }`}>
                                        {material.type === 'video' ? 'Video' : 'PDF'}
                                    </span>
                                </div>
                            </div>
                            <CardContent className="p-4 space-y-2">
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
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredMaterials.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-600 text-center">
                                {searchQuery
                                    ? 'Tiada bahan pembelajaran dijumpai'
                                    : 'Tiada bahan pembelajaran tersedia'}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-4xl">
                    {selectedMaterial && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl">
                                    {selectedMaterial.title}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                {selectedMaterial.description && (
                                    <p className="text-gray-600">
                                        {selectedMaterial.description}
                                    </p>
                                )}

                                {selectedMaterial.type === 'video' && selectedMaterial.video_url && (
                                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                        <iframe
                                            src={getYouTubeEmbedUrl(selectedMaterial.video_url) || ''}
                                            title={selectedMaterial.title}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}

                                {selectedMaterial.type === 'pdf' && selectedMaterial.file_path && (
                                    <div className="space-y-4">
                                        <div className="bg-gray-100 rounded-lg p-8 text-center">
                                            <FileText className="h-16 w-16 text-red-600 mx-auto mb-4" />
                                            <p className="text-gray-700 mb-4">
                                                Dokumen PDF tersedia untuk dimuat turun
                                            </p>
                                            <Button
                                                asChild
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                <a
                                                    href={`/storage/${selectedMaterial.file_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Buka PDF
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div className="text-sm text-gray-500 border-t pt-4">
                                    Dimuat naik oleh {selectedMaterial.uploader.name}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </FarmerSidebarLayout>
    );
}