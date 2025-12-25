import { useState } from 'react';
import FarmerSidebarLayout from '@/layouts/app/farmer-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, Zap, Target, Award } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';

export default function FarmerFeedback() {
    const [selectedType, setSelectedType] = useState<'positive' | 'improvement' | null>(null);

    const { data, setData, processing, errors, reset } = useForm({
        type: '' as 'positive' | 'improvement' | '',
        message: '',
        rating: null as number | null,
        feature: '',
    });

    const handleTypeSelect = (type: 'positive' | 'improvement') => {
        setSelectedType(type);
        setData('type', type);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post('/farmer/feedback', data, {
            onSuccess: () => {
                setSelectedType(null);
                reset();
            },
        });
    };

    return (
        <FarmerSidebarLayout breadcrumbs={[{ title: 'Maklum Balas', href: '/farmer/feedback' }]}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900">Maklum Balas</h1>
                    <p className="text-base text-gray-600 mt-3">
                        Maklum balas anda penting kepada kami. Beritahu kami pendapat anda tentang sistem ini, dan cadangkan sebarang penambahbaikan.
                    </p>
                </div>

                {/* Feedback Type Selection */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        Bagaimana anda menilai pengalaman anda dengan AgriPadi?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Positive Feedback Button */}
                        <button
                            type="button"
                            onClick={() => handleTypeSelect('positive')}
                            className={`p-8 border-2 rounded-lg transition-all hover:shadow-lg ${
                                selectedType === 'positive'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-green-300'
                            }`}
                        >
                            <div className="flex flex-col items-center gap-3">
                                <div
                                    className={`p-4 rounded-full ${
                                        selectedType === 'positive'
                                            ? 'bg-green-500'
                                            : 'bg-gray-200'
                                    }`}
                                >
                                    <ThumbsUp
                                        className={`h-8 w-8 ${
                                            selectedType === 'positive'
                                                ? 'text-white'
                                                : 'text-gray-600'
                                        }`}
                                    />
                                </div>
                                <h3 className="text-lg font-semibold">Maklum Balas Positif</h3>
                                <p className="text-sm text-gray-600 text-center">
                                    Kongsikan apa yang anda suka tentang sistem
                                </p>
                            </div>
                        </button>

                        {/* Areas for Improvement Button */}
                        <button
                            type="button"
                            onClick={() => handleTypeSelect('improvement')}
                            className={`p-8 border-2 rounded-lg transition-all hover:shadow-lg ${
                                selectedType === 'improvement'
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-200 hover:border-red-300'
                            }`}
                        >
                            <div className="flex flex-col items-center gap-3">
                                <div
                                    className={`p-4 rounded-full ${
                                        selectedType === 'improvement'
                                            ? 'bg-red-500'
                                            : 'bg-gray-200'
                                    }`}
                                >
                                    <ThumbsDown
                                        className={`h-8 w-8 ${
                                            selectedType === 'improvement'
                                                ? 'text-white'
                                                : 'text-gray-600'
                                        }`}
                                    />
                                </div>
                                <h3 className="text-lg font-semibold">Cadangan Penambahbaikan</h3>
                                <p className="text-sm text-gray-600 text-center">
                                    Beritahu kami isu yang anda hadapi atau cadangan untuk penambahbaikan
                                </p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Feedback Form */}
                {selectedType && (
                    <Card className="max-w-4xl mx-auto">
                        <CardHeader>
                            <CardTitle>
                                {selectedType === 'positive'
                                    ? 'Kongsikan Maklum Balas Positif Anda'
                                    : 'Apa yang boleh kami perbaiki?'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="feature">Ciri/Modul (Pilihan)</Label>
                                    <select
                                        id="feature"
                                        value={data.feature}
                                        onChange={(e) => setData('feature', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">Pilih ciri (pilihan)</option>
                                        <option value="Bahan Pembelajaran">Bahan Pembelajaran</option>
                                        <option value="Lawatan Maya Ladang">Lawatan Maya Ladang</option>
                                        <option value="Sistem Pelaporan">Sistem Pelaporan</option>
                                        <option value="Forum Komuniti">Forum Komuniti</option>
                                        <option value="Pengumuman">Pengumuman</option>
                                        <option value="Keseluruhan Sistem">Keseluruhan Sistem</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rating">Penilaian (Pilihan)</Label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                                key={rating}
                                                type="button"
                                                onClick={() => setData('rating', rating)}
                                                className={`px-4 py-2 rounded-md border-2 transition-all ${
                                                    data.rating === rating
                                                        ? 'border-green-500 bg-green-500 text-white'
                                                        : 'border-gray-300 hover:border-green-300'
                                                }`}
                                            >
                                                {rating}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">1 = Sangat Tidak Puas, 5 = Sangat Puas</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">
                                        {selectedType === 'positive'
                                            ? 'Beritahu kami apa yang anda suka'
                                            : 'Beritahu kami apa yang perlu diperbaiki'}
                                        *
                                    </Label>
                                    <Textarea
                                        id="message"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder={
                                            selectedType === 'positive'
                                                ? 'Contoh: Bahan pembelajaran sangat membantu dan mudah difahami...'
                                                : 'Contoh: Sistem pelaporan agak mengelirukan untuk digunakan. Akan lebih baik jika...'
                                        }
                                        rows={6}
                                        required
                                    />
                                    {errors.message && (
                                        <p className="text-sm text-red-600">{errors.message}</p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {processing ? 'Menghantar...' : 'Hantar Maklum Balas'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedType(null);
                                            reset();
                                        }}
                                    >
                                        Batal
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* How Your Feedback Helps */}
                <div className="max-w-6xl mx-auto mt-12">
                    <h2 className="text-2xl font-semibold text-center mb-8">
                        Bagaimana Maklum Balas Anda Membantu
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="p-4 bg-blue-100 rounded-full">
                                        <Target className="h-8 w-8 text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Perbaiki Ciri</h3>
                                <p className="text-sm text-gray-600">
                                    Maklum balas anda membantu kami mengenal pasti ciri yang berfungsi dengan baik dan yang perlu diperbaiki.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="p-4 bg-purple-100 rounded-full">
                                        <Zap className="h-8 w-8 text-purple-600" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Tambah Ciri Baru</h3>
                                <p className="text-sm text-gray-600">
                                    Kami pertimbangkan cadangan anda apabila membangunkan ciri baharu untuk AgriPadi.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="p-4 bg-green-100 rounded-full">
                                        <Award className="h-8 w-8 text-green-600" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Pengalaman Lebih Baik</h3>
                                <p className="text-sm text-gray-600">
                                    Input anda secara langsung menyumbang untuk menjadikan AgriPadi lebih mesra pengguna.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </FarmerSidebarLayout>
    );
}