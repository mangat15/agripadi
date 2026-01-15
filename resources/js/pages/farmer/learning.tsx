import { useState } from 'react';
import FarmerSidebarLayout from '@/layouts/app/farmer-sidebar-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    BookOpen,
    ChevronDown,
    ChevronRight,
    FileText,
    GraduationCap,
    Play,
    Video,
} from 'lucide-react';
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

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
};

export default function FarmerLearningMaterial({ materials, categories }: Props) {
    const { t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categories));
    const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredMaterials =
        selectedCategory === 'all'
            ? materials
            : materials.filter((m) => m.category === selectedCategory);

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

    const handleMaterialClick = (material: LearningMaterial) => {
        if (material.type === 'video' && material.video_url) {
            setSelectedMaterial(material);
            setIsModalOpen(true);
        } else if (material.type === 'pdf' && material.file_path) {
            window.open(`/storage/${material.file_path}`, '_blank');
        } else if (material.type === 'quiz' && material.quiz_url) {
            setSelectedMaterial(material);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMaterial(null);
    };

    const renderEmbeddedContent = () => {
        if (!selectedMaterial) return null;

        if (selectedMaterial.type === 'video' && selectedMaterial.video_url) {
            const videoId = getYouTubeVideoId(selectedMaterial.video_url);
            if (videoId) {
                return (
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                            title={selectedMaterial.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                );
            }
        }

        if (selectedMaterial.type === 'quiz' && selectedMaterial.quiz_url) {
            return (
                <div className="w-full h-[60vh] sm:h-[70vh]">
                    <iframe
                        className="w-full h-full rounded-lg border-0"
                        src={selectedMaterial.quiz_url}
                        title={selectedMaterial.title}
                        allow="fullscreen"
                    />
                </div>
            );
        }

        return null;
    };

    return (
        <FarmerSidebarLayout
            breadcrumbs={[{ title: t('learning.title'), href: '/farmer/learning' }]}
        >
            <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {t('learning.title')}
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {t('learning.subtitle')}
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap">
                    <Button
                        onClick={() => setSelectedCategory('all')}
                        variant={selectedCategory === 'all' ? 'default' : 'outline'}
                        size="sm"
                        className={selectedCategory === 'all' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                        {t('learning.allCategories')}
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
                                {t('learning.noMaterialsAvailable')}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {Object.entries(materialsByCategory).map(([category, categoryMaterials]) => (
                            <Card key={category} className="overflow-hidden">
                                {/* Category Header */}
                                <div
                                    className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200 cursor-pointer hover:from-blue-100 hover:to-blue-150 transition-colors"
                                    onClick={() => toggleCategory(category)}
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                                            {expandedCategories.has(category) ? (
                                                <ChevronDown className="w-5 h-5" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5" />
                                            )}
                                            {category}
                                        </h2>
                                        <span className="text-sm font-medium text-blue-700">
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

                                                    {/* Action Button */}
                                                    <Button
                                                        onClick={() => handleMaterialClick(material)}
                                                        size="sm"
                                                        className="flex-shrink-0 bg-green-600 hover:bg-green-700"
                                                    >
                                                        {material.type === 'video' ? (
                                                            <>
                                                                <Play className="w-4 h-4 mr-2" />
                                                                Tonton
                                                            </>
                                                        ) : material.type === 'pdf' ? (
                                                            'Buka'
                                                        ) : (
                                                            'Mula'
                                                        )}
                                                    </Button>
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

            {/* Embedded Content Modal */}
            <Dialog open={isModalOpen} onOpenChange={closeModal}>
                <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] p-0 overflow-hidden sm:rounded-lg">
                    <DialogHeader className="p-3 sm:p-4 pb-2 border-b">
                        <DialogTitle className="text-base sm:text-lg font-semibold pr-8">
                            {selectedMaterial?.title}
                        </DialogTitle>
                        {selectedMaterial?.description && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                                {selectedMaterial.description}
                            </p>
                        )}
                    </DialogHeader>
                    <div className="p-2 sm:p-4">
                        {renderEmbeddedContent()}
                    </div>
                </DialogContent>
            </Dialog>
        </FarmerSidebarLayout>
    );
}
