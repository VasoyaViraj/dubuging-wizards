import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { citizenAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import { FileText, Clock, CheckCircle2, XCircle, CalendarDays, Filter, Search } from 'lucide-react';

export default function Requests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const response = await citizenAPI.getRequests({ limit: 50 });
            setRequests(response.data.data || []);
        } catch (error) {
            console.error('Error loading requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            PENDING: 'bg-amber-100 text-amber-700',
            ACCEPTED: 'bg-green-100 text-green-700',
            REJECTED: 'bg-red-100 text-red-700',
        };
        const icons = {
            PENDING: Clock,
            ACCEPTED: CheckCircle2,
            REJECTED: XCircle,
        };
        const Icon = icons[status] || Clock;
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
                <Icon size={14} />
                {status}
            </span>
        );
    };

    const getIcon = (iconName) => {
        const icons = {
            'heart-pulse': '❤️',
            'leaf': '🌿',
            'calendar-plus': '📅',
            'message-circle': '💬',
        };
        return icons[iconName] || '📋';
    };

    const filteredRequests = filter === 'all'
        ? requests
        : requests.filter(r => r.status === filter);

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
                    <p className="text-gray-500 mt-1">Track the status of your service requests</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    { value: 'all', label: 'All' },
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'ACCEPTED', label: 'Accepted' },
                    { value: 'REJECTED', label: 'Rejected' },
                ].map((item) => (
                    <button
                        key={item.value}
                        onClick={() => setFilter(item.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === item.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredRequests.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {filteredRequests.map((request) => (
                            <Link
                                key={request._id}
                                to={`/requests/${request._id}`}
                                className="flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-2xl">
                                    {getIcon(request.serviceId?.icon)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900">
                                        {request.serviceId?.name || 'Service'}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                        <span>{request.departmentId?.name}</span>
                                        <span className="flex items-center gap-1">
                                            <CalendarDays size={14} />
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                {getStatusBadge(request.status)}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
                        <p className="text-gray-500 mt-1">
                            {filter === 'all'
                                ? "You haven't submitted any requests yet"
                                : `No ${filter.toLowerCase()} requests`}
                        </p>
                        <Link
                            to="/departments"
                            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                        >
                            Browse Services
                        </Link>
                    </div>
                )}
            </div>
        </Layout>
    );
}
