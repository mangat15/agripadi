import { useState } from 'react';
import FarmerSidebarLayout from '@/layouts/app/farmer-sidebar-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Camera, Play, Eye, ExternalLink } from 'lucide-react';

interface VirtualTour {
    id: number;
    title: string;
    description: string | null;
    thumbnail: string | null;
    tour_url: string;
    tour_type: 'iframe' | 'redirect';
}

interface Props {
    tours: VirtualTour[];
}

export default function FarmerVirtualTour({ tours }: Props) {
    const [selectedTour, setSelectedTour] = useState<VirtualTour | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleTourClick = (tour: VirtualTour) => {
        if (tour.tour_type === 'redirect') {
            // Open in new tab
            window.open(tour.tour_url, '_blank', 'noopener,noreferrer');
        } else {
            // Open in dialog with iframe
            setSelectedTour(tour);
            setIsDialogOpen(true);
        }
    };

    return (
        <FarmerSidebarLayout breadcrumbs={[{ title: 'Lawatan Maya', href: '/farmer/virtual-tour' }]}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Lawatan Maya 360°</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Jelajahi ladang padi melalui lawatan maya interaktif
                        </p>
                    </div>
                    <Camera className="h-8 w-8 text-green-600" />
                </div>

                {/* Tours Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tours.length === 0 ? (
                        <Card className="col-span-full">
                            <CardContent className="py-12 text-center text-gray-500">
                                <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p>Tiada lawatan maya pada masa ini</p>
                            </CardContent>
                        </Card>
                    ) : (
                        tours.map((tour) => (
                            <Card
                                key={tour.id}
                                className="hover:shadow-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                                onClick={() => handleTourClick(tour)}
                            >
                                <CardContent className="pt-6 space-y-3">
                                    {/* Tour Type Badge */}
                                    <Badge className={tour.tour_type === 'iframe' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 'bg-purple-100 text-purple-800 hover:bg-purple-100'}>
                                        360° Tour
                                    </Badge>

                                    {/* Thumbnail or Play Icon */}
                                    <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-green-500 to-green-600">
                                        {tour.thumbnail ? (
                                            <>
                                                <img
                                                    src={`/storage/${tour.thumbnail}`}
                                                    alt={tour.title}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                                                    <div className="bg-white/90 rounded-full p-4">
                                                        <Play className="h-8 w-8 text-green-600" />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="h-48 flex items-center justify-center">
                                                <div className="text-center text-white">
                                                    <Camera className="h-16 w-16 mx-auto mb-2 opacity-80" />
                                                    <p className="text-sm">360° Virtual Tour</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-semibold leading-tight line-clamp-2">
                                        {tour.title}
                                    </h3>

                                    {/* Description */}
                                    {tour.description && (
                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {tour.description}
                                        </p>
                                    )}

                                    {/* Action Button */}
                                    <Button className="w-full gap-2">
                                        {tour.tour_type === 'iframe' ? (
                                            <>
                                                <Eye className="h-4 w-4" />
                                                Lihat Lawatan
                                            </>
                                        ) : (
                                            <>
                                                <ExternalLink className="h-4 w-4" />
                                                Buka Lawatan
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* View Tour Dialog (for iframe type) */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-6xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedTour?.title}
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                360° Tour
                            </Badge>
                        </DialogTitle>
                    </DialogHeader>
                    {selectedTour && (
                        <div className="space-y-4">
                            {/* Description */}
                            {selectedTour.description && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700">{selectedTour.description}</p>
                                </div>
                            )}

                            {/* Virtual Tour Iframe */}
                            <div className="rounded-lg overflow-hidden bg-gray-900" style={{ height: '70vh' }}>
                                <iframe
                                    src={selectedTour.tour_url}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allowFullScreen
                                    title={selectedTour.title}
                                />
                            </div>

                            {/* Instructions */}
                            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-900">
                                <p className="font-semibold mb-1">Panduan:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Gunakan tetikus untuk melihat sekeliling</li>
                                    <li>Klik dan seret untuk berputar</li>
                                    <li>Gunakan butang fullscreen untuk paparan penuh</li>
                                </ul>
                            </div>

                            {/* Close Button */}
                            <div className="flex justify-end">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Tutup
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </FarmerSidebarLayout>
    );
}