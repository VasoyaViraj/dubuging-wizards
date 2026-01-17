import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { citizenAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import { ArrowLeft, Clock, CheckCircle2, XCircle, Calendar, User, FileText, MessageSquare } from 'lucide-react';

export default function RequestDetail() {
    const { id } = useParams();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequest();
    }, [id]);

    const loadRequest = async () => {
        try {
            const response = await citizenAPI.getRequest(id);
            setRequest(response.data.data);
        } catch (error) {
            console.error('Error loading request:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', Icon: Clock, label: 'Pending Review' },
            ACCEPTED: { bg: 'bg-green-100', text: 'text-green-700', Icon: CheckCircle2, label: 'Accepted' },
            REJECTED: { bg: 'bg-red-100', text: 'text-red-700', Icon: XCircle, label: 'Rejected' },
        };
        const { bg, text, Icon, label } = config[status] || config.PENDING;
        return (
            <div className={`inline-flex items-center gap-2 px-4 py-2 ${bg} ${text} rounded-xl`}>
                <Icon size={18} />
                <span className="font-medium">{label}</span>
            </div>
        );
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            </Layout>
        );
    }

    if (!request) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900">Request not found</h2>
                    <Link to="/requests" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
                        ← Back to Requests
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Back Button */}
            <Link
                to="/requests"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
            >
                <ArrowLeft size={20} />
                Back to Requests
            </Link>

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{request.serviceId?.name}</h1>
                            <p className="text-gray-500 mt-1">{request.departmentId?.name}</p>
                        </div>
                        {getStatusBadge(request.status)}
                    </div>
                </div>

                {/* Request Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Calendar className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Submitted On</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(request.createdAt).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <FileText className="text-purple-600" size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Request ID</p>
                                <p className="font-medium text-gray-900 font-mono text-sm">{request._id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submitted Data */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Submitted Information</h2>
                    <div className="space-y-4">
                        {Object.entries(request.payload || {}).map(([key, value]) => (
                            <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-2">
                                <span className="text-sm font-medium text-gray-500 sm:w-40 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <span className="text-gray-900">{value || 'N/A'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Response / Remarks */}
                {(request.officerRemarks || request.responseData) && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <MessageSquare className="text-green-600" size={20} />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Response</h2>
                        </div>

                        {request.officerRemarks && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-1">Remarks</p>
                                <p className="text-gray-900 bg-gray-50 p-4 rounded-xl">{request.officerRemarks}</p>
                            </div>
                        )}

                        {request.responseData?.advisoryText && (
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Advisory</p>
                                <div className="text-gray-900 bg-green-50 p-4 rounded-xl whitespace-pre-line border border-green-100">
                                    {request.responseData.advisoryText}
                                </div>
                            </div>
                        )}

                        {request.responseData?.assignedDoctor && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-sm text-blue-600 font-medium">Assigned Doctor</p>
                                <p className="text-blue-900 font-semibold">{request.responseData.assignedDoctor}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}
