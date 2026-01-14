import { useState } from 'react';
import AdminSidebarLayout from '@/layouts/app/admin-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Calendar, User, FileText } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';
import { useLanguage } from '@/contexts/LanguageContext';

interface User {
    id: number;
    name: string;
    email: string;
    location: string | null;
}

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
    responses?: ReportResponse[];
}

interface Props {
    report: Report;
}

export default function AdminReportDetail({ report }: Props) {
    const [showAddResponse, setShowAddResponse] = useState(false);
    const { t } = useLanguage();

    const { data: responseData, setData: setResponseData, post: postResponse, processing: responseProcessing, errors: responseErrors, reset: resetResponse } = useForm({
        response: '',
        response_type: 'update' as 'update' | 'resolved',
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
                        {t('adminReports.status.pending')}
                    </span>
                );
            case 'under_review':
                return (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {t('adminReports.status.underReview')}
                    </span>
                );
            case 'resolved':
                return (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        {t('adminReports.status.resolved')}
                    </span>
                );
            default:
                return null;
        }
    };

    const handleUpdateStatus = (newStatus: 'pending' | 'under_review' | 'resolved') => {
        router.put(`/admin/reports/${report.id}/status`, {
            status: newStatus,
        });
    };

    const handleAddResponse = (e: React.FormEvent) => {
        e.preventDefault();
        postResponse(`/admin/reports/${report.id}/add-response`, {
            onSuccess: () => {
                setShowAddResponse(false);
                resetResponse();
            },
        });
    };

    return (
        <AdminSidebarLayout
            breadcrumbs={[
                { title: t('adminReports.title'), href: '/admin/reports' },
                { title: report.title, href: `/admin/reports/${report.id}` },
            ]}
        >
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {t('adminReportDetail.title')}
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
                                <CardTitle>{t('adminReportDetail.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-gray-600">{t('adminReportDetail.type')}</Label>
                                    <p className="text-base font-medium mt-1">{report.type}</p>
                                </div>

                                <div>
                                    <Label className="text-gray-600">{t('adminReportDetail.location')}</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <p className="text-base font-medium">{report.location}</p>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-gray-600">{t('adminReportDetail.description')}</Label>
                                    <p className="text-base mt-1 whitespace-pre-wrap">
                                        {report.description}
                                    </p>
                                </div>

                                {report.image && (
                                    <div>
                                        <Label className="text-gray-600">{t('adminReportDetail.image')}</Label>
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

                        {/* Response Timeline - New Time Log System */}
                        {report.responses && report.responses.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>{t('adminReportDetail.responseHistory')}</CardTitle>
                                        <Button
                                            size="sm"
                                            onClick={() => setShowAddResponse(!showAddResponse)}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            {showAddResponse ? t('adminReportDetail.cancel') : `+ ${t('adminReportDetail.addResponse')}`}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {/* Add Response Form */}
                                    {showAddResponse && (
                                        <form onSubmit={handleAddResponse} className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-green-200">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="response">{t('adminReportDetail.response')}</Label>
                                                    <Textarea
                                                        id="response"
                                                        value={responseData.response}
                                                        onChange={(e) => setResponseData('response', e.target.value)}
                                                        placeholder={t('adminReportDetail.responsePlaceholder')}
                                                        rows={4}
                                                        required
                                                    />
                                                    {responseErrors.response && (
                                                        <p className="text-sm text-red-600">{responseErrors.response}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="response_type">{t('adminReportDetail.responseType')}</Label>
                                                    <select
                                                        id="response_type"
                                                        value={responseData.response_type}
                                                        onChange={(e) => setResponseData('response_type', e.target.value as 'update' | 'resolved')}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    >
                                                        <option value="update">{t('adminReportDetail.responseType.update')}</option>
                                                        <option value="resolved">{t('adminReportDetail.responseType.resolved')}</option>
                                                    </select>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    disabled={responseProcessing}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    {responseProcessing ? t('adminReportDetail.submitting') : t('adminReportDetail.submit')}
                                                </Button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Timeline */}
                                    <div className="space-y-4">
                                        {report.responses.map((response, index) => (
                                            <div key={response.id} className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0">
                                                {/* Timeline dot */}
                                                <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${response.response_type === 'resolved' ? 'bg-green-500' : 'bg-blue-500'}`}></div>

                                                <div className="bg-white border rounded-lg p-4 shadow-sm">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{response.admin.name}</p>
                                                            <p className="text-xs text-gray-500">{formatDate(response.created_at)}</p>
                                                        </div>
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            response.response_type === 'resolved'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {response.response_type === 'resolved' ? t('adminReportDetail.responseType.resolved') : t('adminReportDetail.responseType.update')}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{response.response}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Add Response Button if no responses yet */}
                        {(!report.responses || report.responses.length === 0) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('adminReportDetail.addResponse')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!showAddResponse ? (
                                        <Button
                                            onClick={() => setShowAddResponse(true)}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                            + {t('adminReportDetail.addFirstResponse')}
                                        </Button>
                                    ) : (
                                        <form onSubmit={handleAddResponse} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="first_response">{t('adminReportDetail.response')}</Label>
                                                <Textarea
                                                    id="first_response"
                                                    value={responseData.response}
                                                    onChange={(e) => setResponseData('response', e.target.value)}
                                                    placeholder={t('adminReportDetail.responsePlaceholder')}
                                                    rows={6}
                                                    required
                                                />
                                                {responseErrors.response && (
                                                    <p className="text-sm text-red-600">{responseErrors.response}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="first_response_type">{t('adminReportDetail.responseType')}</Label>
                                                <select
                                                    id="first_response_type"
                                                    value={responseData.response_type}
                                                    onChange={(e) => setResponseData('response_type', e.target.value as 'update' | 'resolved')}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                >
                                                    <option value="update">{t('adminReportDetail.responseType.update')}</option>
                                                    <option value="resolved">{t('adminReportDetail.responseType.resolved')}</option>
                                                </select>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    type="submit"
                                                    disabled={responseProcessing}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    {responseProcessing ? t('adminReportDetail.submitting') : t('adminReportDetail.submit')}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowAddResponse(false);
                                                        resetResponse();
                                                    }}
                                                >
                                                    {t('adminReportDetail.cancel')}
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Farmer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('adminReportDetail.reportedBy')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">{t('settings.profile.name')}</p>
                                        <p className="font-medium">{report.user.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">{t('settings.profile.email')}</p>
                                        <p className="font-medium">{report.user.email}</p>
                                    </div>
                                </div>

                                {report.user.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-600">{t('settings.profile.location')}</p>
                                            <p className="font-medium">{report.user.location}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Report Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('adminReportDetail.submittedOn')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">{t('adminReportDetail.submittedOn')}</p>
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
                                <CardTitle>{t('admin.dashboard.quickActions')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {report.status !== 'under_review' && (
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={() => handleUpdateStatus('under_review')}
                                    >
                                        {t('adminReports.status.underReview')}
                                    </Button>
                                )}
                                {report.status !== 'resolved' && (
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleUpdateStatus('resolved')}
                                    >
                                        {t('adminReports.status.resolved')}
                                    </Button>
                                )}
                                <Button
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    onClick={() => router.get('/admin/reports')}
                                >
                                    {t('settings.backToDashboard')}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminSidebarLayout>
    );
}