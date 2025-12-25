import { useState } from 'react';
import AdminSidebarLayout from '@/layouts/app/admin-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Calendar, User, FileText } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    location: string | null;
}

interface Report {
    id: number;
    user_id: number;
    title: string;
    type: string;
    description: string;
    location: string;
    image: string | null;
    status: 'pending' | 'under_review' | 'resolved';
    admin_response: string | null;
    responded_at: string | null;
    created_at: string;
    updated_at: string;
    user: User;
}

interface Props {
    report: Report;
}

export default function AdminReportDetail({ report }: Props) {
    const [isResponding, setIsResponding] = useState(false);

    const { data, setData, processing, errors, reset } = useForm({
        admin_response: report.admin_response || '',
        status: report.status as 'pending' | 'under_review' | 'resolved',
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ms-MY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                        Menunggu
                    </span>
                );
            case 'under_review':
                return (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        Dalam Semakan
                    </span>
                );
            case 'resolved':
                return (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        Selesai
                    </span>
                );
            default:
                return null;
        }
    };

    const handleSubmitResponse = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/admin/reports/${report.id}/respond`, data, {
            onSuccess: () => {
                setIsResponding(false);
            },
        });
    };

    const handleMarkAsResolved = () => {
        if (confirm('Adakah anda pasti mahu menandakan laporan ini sebagai selesai?')) {
            router.put(`/admin/reports/${report.id}/status`, {
                status: 'resolved',
            });
        }
    };

    const handleUpdateStatus = (newStatus: 'pending' | 'under_review' | 'resolved') => {
        router.put(`/admin/reports/${report.id}/status`, {
            status: newStatus,
        });
    };

    return (
        <AdminSidebarLayout
            breadcrumbs={[
                { title: 'Pengurusan Laporan', href: '/admin/reports' },
                { title: report.title, href: `/admin/reports/${report.id}` },
            ]}
        >
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Butiran lengkap laporan daripada petani
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {getStatusBadge(report.status)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Report Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Butiran Laporan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-gray-600">Jenis Laporan</Label>
                                    <p className="text-base font-medium mt-1">{report.type}</p>
                                </div>

                                <div>
                                    <Label className="text-gray-600">Lokasi Masalah</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <p className="text-base font-medium">{report.location}</p>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-gray-600">Penerangan</Label>
                                    <p className="text-base mt-1 whitespace-pre-wrap">
                                        {report.description}
                                    </p>
                                </div>

                                {report.image && (
                                    <div>
                                        <Label className="text-gray-600">Gambar Lampiran</Label>
                                        <div className="mt-2 border rounded-lg overflow-hidden">
                                            <img
                                                src={`/storage/${report.image}`}
                                                alt={report.title}
                                                className="w-full h-auto"
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Admin Response Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Maklum Balas Pentadbir</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {report.admin_response && !isResponding ? (
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                {report.admin_response}
                                            </p>
                                            {report.responded_at && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Dibalas pada: {formatDate(report.responded_at)}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsResponding(true)}
                                        >
                                            Kemaskini Maklum Balas
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmitResponse} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="admin_response">
                                                Tulis Maklum Balas Anda
                                            </Label>
                                            <Textarea
                                                id="admin_response"
                                                value={data.admin_response}
                                                onChange={(e) =>
                                                    setData('admin_response', e.target.value)
                                                }
                                                placeholder="Masukkan maklum balas anda kepada petani..."
                                                rows={6}
                                                required
                                            />
                                            {errors.admin_response && (
                                                <p className="text-sm text-red-600">
                                                    {errors.admin_response}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status Laporan</Label>
                                            <select
                                                id="status"
                                                value={data.status}
                                                onChange={(e) =>
                                                    setData(
                                                        'status',
                                                        e.target.value as
                                                            | 'pending'
                                                            | 'under_review'
                                                            | 'resolved',
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                required
                                            >
                                                <option value="pending">Menunggu</option>
                                                <option value="under_review">Dalam Semakan</option>
                                                <option value="resolved">Selesai</option>
                                            </select>
                                            {errors.status && (
                                                <p className="text-sm text-red-600">{errors.status}</p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                {processing ? 'Menghantar...' : 'Hantar Maklum Balas'}
                                            </Button>
                                            {isResponding && report.admin_response && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setIsResponding(false);
                                                        reset();
                                                    }}
                                                >
                                                    Batal
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Farmer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Maklumat Petani</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Nama</p>
                                        <p className="font-medium">{report.user.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">E-mel</p>
                                        <p className="font-medium">{report.user.email}</p>
                                    </div>
                                </div>

                                {report.user.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-600">Lokasi</p>
                                            <p className="font-medium">{report.user.location}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Report Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Maklumat Masa</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Tarikh Dihantar</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <p className="font-medium text-sm">
                                            {formatDate(report.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Kemas Kini Terakhir</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <p className="font-medium text-sm">
                                            {formatDate(report.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tindakan Pantas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {report.status !== 'under_review' && (
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => handleUpdateStatus('under_review')}
                                    >
                                        Tandakan Dalam Semakan
                                    </Button>
                                )}
                                {report.status !== 'resolved' && (
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        onClick={handleMarkAsResolved}
                                    >
                                        Tandakan Selesai
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => router.get('/admin/reports')}
                                >
                                    Kembali ke Senarai
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminSidebarLayout>
    );
}