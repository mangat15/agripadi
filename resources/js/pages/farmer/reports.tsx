import { useState } from 'react';
import FarmerSidebarLayout from '@/layouts/app/farmer-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { FileText, Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReportResponse {
    id: number;
    report_id: number;
    admin_id: number;
    response: string;
    response_type: 'update' | 'resolved';
    created_at: string;
    admin: {
        name: string;
        email: string;
    };
}

interface Report {
    id: number;
    title: string;
    type: string;
    description: string;
    location: string;
    image: string | null;
    pdf_letter: string | null;
    status: 'pending' | 'under_review' | 'resolved';
    admin_response: string | null;
    responded_at: string | null;
    created_at: string;
    updated_at: string;
    responses?: ReportResponse[];
}

interface Props {
    reports: Report[];
}

export default function FarmerReports({ reports }: Props) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const { t, language } = useLanguage();

    const { data, setData, processing, errors, reset } = useForm({
        title: '',
        type: '',
        description: '',
        location: '',
        image: null as File | null,
        pdf_letter: null as File | null,
    });

    const editForm = useForm({
        title: '',
        type: '',
        description: '',
        location: '',
        image: null as File | null,
        pdf_letter: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('type', data.type);
        formData.append('description', data.description);
        formData.append('location', data.location);
        if (data.image) {
            formData.append('image', data.image);
        }
        if (data.pdf_letter) {
            formData.append('pdf_letter', data.pdf_letter);
        }

        router.post('/farmer/reports', formData, {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                reset();
            },
        });
    };

    const handleEdit = (report: Report) => {
        setSelectedReport(report);
        editForm.setData({
            title: report.title,
            type: report.type,
            description: report.description,
            location: report.location,
            image: null,
            pdf_letter: null,
        });
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedReport) {
            const formData = new FormData();
            formData.append('title', editForm.data.title);
            formData.append('type', editForm.data.type);
            formData.append('description', editForm.data.description);
            formData.append('location', editForm.data.location);
            if (editForm.data.image) {
                formData.append('image', editForm.data.image);
            }
            if (editForm.data.pdf_letter) {
                formData.append('pdf_letter', editForm.data.pdf_letter);
            }
            formData.append('_method', 'PUT');

            router.post(`/farmer/reports/${selectedReport.id}`, formData, {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    editForm.reset();
                },
            });
        }
    };

    const handleDelete = (reportId: number) => {
        if (confirm(t('reports.confirmDelete'))) {
            router.delete(`/farmer/reports/${reportId}`);
        }
    };

    const handleViewReport = (report: Report) => {
        setSelectedReport(report);
        setIsViewDialogOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">{t('reports.status.pending')}</span>;
            case 'under_review':
                return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">{t('reports.status.under_review')}</span>;
            case 'resolved':
                return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">{t('reports.status.resolved')}</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">{status}</span>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language === 'ms' ? 'ms-MY' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <FarmerSidebarLayout breadcrumbs={[{ title: t('nav.reports'), href: '/farmer/reports' }]}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{t('reports.title')}</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {t('reports.subtitle')}
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        {t('reports.submitNew')}
                    </Button>
                </div>

                {/* Reports List */}
                <div className="grid gap-4">
                    {reports.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-500 text-center">
                                    {t('reports.noReports')}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        reports.map((report) => (
                            <Card key={report.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{report.title}</CardTitle>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                <span className="font-medium text-gray-700">{report.type}</span>
                                                <span>•</span>
                                                <span>{report.location}</span>
                                                <span>•</span>
                                                <span>{formatDate(report.created_at)}</span>
                                            </div>
                                        </div>
                                        <div>{getStatusBadge(report.status)}</div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 mb-4 line-clamp-2">{report.description}</p>

                                    {report.responses && report.responses.length > 0 && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                            <p className="text-sm font-semibold text-blue-900 mb-2">
                                                {report.responses.length} maklum balas dari pegawai pertanian
                                            </p>
                                            <p className="text-xs text-blue-600">
                                                Terkini: {formatDate(report.responses[report.responses.length - 1].created_at)}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewReport(report)}
                                        >
                                            {t('reports.viewDetails')}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(report)}
                                            className="hover:bg-blue-50"
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            {t('reports.edit')}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(report.id)}
                                            className="hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            {t('reports.delete')}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Create Report Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{t('reports.form.createTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('reports.form.createDescription')}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                        <div className="space-y-4 overflow-y-auto pr-2 flex-1">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t('reports.form.reportTitle')}</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder={t('reports.form.titlePlaceholder')}
                                required
                            />
                            {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">{t('reports.form.problemType')}</Label>
                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            >
                                <option value="">{t('reports.form.selectProblemType')}</option>
                                <option value={t('reports.form.type.irrigation')}>{t('reports.form.type.irrigation')}</option>
                                <option value={t('reports.form.type.pestControl')}>{t('reports.form.type.pestControl')}</option>
                                <option value={t('reports.form.type.soilManagement')}>{t('reports.form.type.soilManagement')}</option>
                                <option value={t('reports.form.type.plantDisease')}>{t('reports.form.type.plantDisease')}</option>
                                <option value={t('reports.form.type.other')}>{t('reports.form.type.other')}</option>
                            </select>
                            {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">{t('reports.form.farmLocation')}</Label>
                            <Input
                                id="location"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                placeholder={t('reports.form.locationPlaceholder')}
                                required
                            />
                            {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">{t('reports.form.problemDescription')}</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder={t('reports.form.descriptionPlaceholder')}
                                rows={4}
                                required
                            />
                            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">{t('reports.form.imageOptional')}</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                                <label htmlFor="image" className="cursor-pointer">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600">
                                        {t('reports.form.clickToUploadImage')}
                                    </p>
                                    <p className="text-xs text-gray-500">{t('reports.form.imageFormat')}</p>
                                    {data.image && (
                                        <p className="mt-2 text-sm text-green-600 font-medium">
                                            {data.image.name}
                                        </p>
                                    )}
                                </label>
                            </div>
                            {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pdf_letter">{t('reports.form.pdfLetterOptional')}</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <input
                                    id="pdf_letter"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => setData('pdf_letter', e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                                <label htmlFor="pdf_letter" className="cursor-pointer">
                                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600">
                                        {t('reports.form.clickToUploadPdf')}
                                    </p>
                                    <p className="text-xs text-gray-500">{t('reports.form.pdfFormat')}</p>
                                    {data.pdf_letter && (
                                        <p className="mt-2 text-sm text-green-600 font-medium">
                                            {data.pdf_letter.name}
                                        </p>
                                    )}
                                </label>
                            </div>
                            {errors.pdf_letter && <p className="text-sm text-red-600">{errors.pdf_letter}</p>}
                        </div>
                        </div>

                        <DialogFooter className="mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsCreateDialogOpen(false);
                                    reset();
                                }}
                            >
                                {t('reports.form.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {processing ? t('reports.form.submitting') : t('reports.form.submit')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Report Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Edit Laporan</DialogTitle>
                        <DialogDescription>
                            Kemaskini maklumat laporan anda
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 overflow-hidden">
                        <div className="space-y-4 overflow-y-auto pr-2 flex-1">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Tajuk Laporan *</Label>
                            <Input
                                id="edit-title"
                                value={editForm.data.title}
                                onChange={(e) => editForm.setData('title', e.target.value)}
                                required
                            />
                            {editForm.errors.title && <p className="text-sm text-red-600">{editForm.errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-type">Jenis Masalah *</Label>
                            <select
                                id="edit-type"
                                value={editForm.data.type}
                                onChange={(e) => editForm.setData('type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            >
                                <option value="">Pilih jenis masalah</option>
                                <option value="Masalah Pengairan">Masalah Pengairan</option>
                                <option value="Kawalan Perosak">Kawalan Perosak</option>
                                <option value="Pengurusan Tanah">Pengurusan Tanah</option>
                                <option value="Penyakit Tanaman">Penyakit Tanaman</option>
                                <option value="Lain-lain">Lain-lain</option>
                            </select>
                            {editForm.errors.type && <p className="text-sm text-red-600">{editForm.errors.type}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-location">Lokasi Ladang *</Label>
                            <Input
                                id="edit-location"
                                value={editForm.data.location}
                                onChange={(e) => editForm.setData('location', e.target.value)}
                                required
                            />
                            {editForm.errors.location && <p className="text-sm text-red-600">{editForm.errors.location}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Penerangan Masalah *</Label>
                            <Textarea
                                id="edit-description"
                                value={editForm.data.description}
                                onChange={(e) => editForm.setData('description', e.target.value)}
                                rows={4}
                                required
                            />
                            {editForm.errors.description && <p className="text-sm text-red-600">{editForm.errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-image">Gambar Baru (Opsional)</Label>
                            <Input
                                id="edit-image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => editForm.setData('image', e.target.files?.[0] || null)}
                            />
                            <p className="text-xs text-gray-500">Kosongkan jika tidak mahu mengubah gambar</p>
                            {editForm.errors.image && <p className="text-sm text-red-600">{editForm.errors.image}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-pdf-letter">Surat PDF Baru (Opsional)</Label>
                            <Input
                                id="edit-pdf-letter"
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => editForm.setData('pdf_letter', e.target.files?.[0] || null)}
                            />
                            <p className="text-xs text-gray-500">Kosongkan jika tidak mahu mengubah surat PDF</p>
                            {editForm.errors.pdf_letter && <p className="text-sm text-red-600">{editForm.errors.pdf_letter}</p>}
                        </div>
                        </div>

                        <DialogFooter className="mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditDialogOpen(false);
                                    editForm.reset();
                                }}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {editForm.processing ? 'Mengemas kini...' : 'Kemas Kini'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Report Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detail Laporan</DialogTitle>
                    </DialogHeader>
                    {selectedReport && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">{selectedReport.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    {getStatusBadge(selectedReport.status)}
                                    <span className="text-sm text-gray-600">
                                        Dihantar pada {formatDate(selectedReport.created_at)}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Jenis:</p>
                                    <p className="font-medium">{selectedReport.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Lokasi:</p>
                                    <p className="font-medium">{selectedReport.location}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-2">Penerangan:</p>
                                <p className="text-gray-800">{selectedReport.description}</p>
                            </div>

                            {selectedReport.image && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Gambar:</p>
                                    <img
                                        src={`/storage/${selectedReport.image}`}
                                        alt="Report"
                                        className="rounded-lg max-w-full h-auto"
                                    />
                                </div>
                            )}

                            {selectedReport.pdf_letter && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Surat PDF:</p>
                                    <a
                                        href={`/storage/${selectedReport.pdf_letter}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <FileText className="h-5 w-5" />
                                        <span>Lihat Surat PDF</span>
                                    </a>
                                </div>
                            )}

                            {selectedReport.responses && selectedReport.responses.length > 0 && (
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 mb-4">{t('reports.adminResponse')}:</p>
                                    <div className="relative border-l-2 border-gray-200 pl-6 space-y-6">
                                        {selectedReport.responses.map((response) => (
                                            <div key={response.id} className="relative">
                                                <div className={`absolute -left-[1.6875rem] w-5 h-5 rounded-full border-2 border-white ${
                                                    response.response_type === 'resolved'
                                                        ? 'bg-green-500'
                                                        : 'bg-blue-500'
                                                }`}></div>
                                                <div className={`p-4 rounded-lg ${
                                                    response.response_type === 'resolved'
                                                        ? 'bg-green-50 border border-green-200'
                                                        : 'bg-blue-50 border border-blue-200'
                                                }`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                                            response.response_type === 'resolved'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {response.response_type === 'resolved' ? t('reports.status.resolved') : t('adminReportDetail.responseType.update')}
                                                        </span>
                                                        <span className="text-xs text-gray-600">
                                                            {formatDate(response.created_at)}
                                                        </span>
                                                    </div>
                                                    <p className={`text-sm ${
                                                        response.response_type === 'resolved'
                                                            ? 'text-green-800'
                                                            : 'text-blue-800'
                                                    }`}>
                                                        {response.response}
                                                    </p>
                                                    <p className="text-xs text-gray-600 mt-2">
                                                        {t('adminReportDetail.respondedBy')} {response.admin.name}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setIsViewDialogOpen(false)}>
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </FarmerSidebarLayout>
    );
}