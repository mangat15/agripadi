import { useState } from 'react';
import FarmerSidebarLayout from '@/layouts/app/farmer-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, Zap, Target, Award } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FarmerFeedback() {
    const { t } = useLanguage();
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
        <FarmerSidebarLayout breadcrumbs={[{ title: t('feedback.title'), href: '/farmer/feedback' }]}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900">{t('feedback.title')}</h1>
                    <p className="text-base text-gray-600 mt-3">
                        {t('feedback.subtitle')}
                    </p>
                </div>

                {/* Feedback Type Selection */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        {t('feedback.questionTitle')}
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
                                <h3 className="text-lg font-semibold">{t('feedback.positive')}</h3>
                                <p className="text-sm text-gray-600 text-center">
                                    {t('feedback.positiveDescription')}
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
                                <h3 className="text-lg font-semibold">{t('feedback.improvement')}</h3>
                                <p className="text-sm text-gray-600 text-center">
                                    {t('feedback.improvementDescription')}
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
                                    ? t('feedback.form.positiveTitle')
                                    : t('feedback.form.improvementTitle')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="feature">{t('feedback.form.feature')}</Label>
                                    <select
                                        id="feature"
                                        value={data.feature}
                                        onChange={(e) => setData('feature', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">{t('feedback.form.selectFeature')}</option>
                                        <option value={t('feedback.form.feature.learning')}>{t('feedback.form.feature.learning')}</option>
                                        <option value={t('feedback.form.feature.virtualTour')}>{t('feedback.form.feature.virtualTour')}</option>
                                        <option value={t('feedback.form.feature.reporting')}>{t('feedback.form.feature.reporting')}</option>
                                        <option value={t('feedback.form.feature.forum')}>{t('feedback.form.feature.forum')}</option>
                                        <option value={t('feedback.form.feature.announcements')}>{t('feedback.form.feature.announcements')}</option>
                                        <option value={t('feedback.form.feature.overall')}>{t('feedback.form.feature.overall')}</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rating">{t('feedback.form.rating')}</Label>
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
                                    <p className="text-xs text-gray-500">{t('feedback.form.ratingScale')}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">
                                        {selectedType === 'positive'
                                            ? t('feedback.form.messagePositive')
                                            : t('feedback.form.messageImprovement')}
                                        *
                                    </Label>
                                    <Textarea
                                        id="message"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder={
                                            selectedType === 'positive'
                                                ? t('feedback.form.placeholderPositive')
                                                : t('feedback.form.placeholderImprovement')
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
                                        {processing ? t('feedback.form.submitting') : t('feedback.form.submit')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedType(null);
                                            reset();
                                        }}
                                    >
                                        {t('feedback.form.cancel')}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* How Your Feedback Helps */}
                <div className="max-w-6xl mx-auto mt-12">
                    <h2 className="text-2xl font-semibold text-center mb-8">
                        {t('feedback.howHelps.title')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="p-4 bg-blue-100 rounded-full">
                                        <Target className="h-8 w-8 text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{t('feedback.howHelps.improveFeatures')}</h3>
                                <p className="text-sm text-gray-600">
                                    {t('feedback.howHelps.improveFeaturesDesc')}
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
                                <h3 className="text-lg font-semibold mb-2">{t('feedback.howHelps.addFeatures')}</h3>
                                <p className="text-sm text-gray-600">
                                    {t('feedback.howHelps.addFeaturesDesc')}
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
                                <h3 className="text-lg font-semibold mb-2">{t('feedback.howHelps.betterExperience')}</h3>
                                <p className="text-sm text-gray-600">
                                    {t('feedback.howHelps.betterExperienceDesc')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </FarmerSidebarLayout>
    );
}