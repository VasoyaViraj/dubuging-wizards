import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { citizenAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import {
    Building2,
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
    CalendarDays,
    TrendingUp
} from 'lucide-react';

export default function CitizenDashboard() {
    const { user } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [recentRequests, setRecentRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [deptRes, reqRes] = await Promise.all([
                citizenAPI.getDepartments(),
                citizenAPI.getRecentAppointments()
            ]);
            setDepartments(deptRes.data.data || []);
            setRecentRequests(reqRes.data.data || []);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            PENDING: 'bg-amber-100 text-amber-700',
            ACCEPTED: 'bg-green-100 text-green-700',
            REJECTED: 'bg-red-100 text-red-700',
            PROCESSING: 'bg-blue-100 text-blue-700',
        };
        const icons = {
            PENDING: Clock,
            ACCEPTED: CheckCircle2,
            REJECTED: XCircle,
            PROCESSING: TrendingUp,
        };
        const Icon = icons[status] || Clock;
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
                <Icon size={12} />
                {status}
            </span>
        );
    };

    const getIcon = (iconName) => {
        const icons = {
            'heart-pulse': '❤️',
            'leaf': '🌿',
            'building': '🏢',
            'calendar-plus': '📅',
            'message-circle': '💬',
        };
        return icons[iconName] || '📋';
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

    return (
        <Layout>
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-500 mt-1">
                    Access government services and track your requests
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Building2 className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                            <p className="text-gray-500 text-sm">Active Departments</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="text-green-600" size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {recentRequests.filter(r => r.status === 'ACCEPTED').length}
                            </p>
                            <p className="text-gray-500 text-sm">Approved Requests</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Clock className="text-amber-600" size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {recentRequests.filter(r => r.status === 'PENDING').length}
                            </p>
                            <p className="text-gray-500 text-sm">Pending Requests</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Departments */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Departments</h2>
                        <Link to="/departments" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {departments.slice(0, 4).map((dept) => (
                                <Link
                                    key={dept._id}
                                    to={`/departments/${dept._id}`}
                                    className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group"
                                >
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                                        {getIcon(dept.icon)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {dept.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 line-clamp-1">{dept.description}</p>
                                    </div>
                                    <ArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors" size={20} />
                                </Link>
                            ))}
                            {departments.length === 0 && (
                                <p className="text-center text-gray-500 py-8">No departments available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Appointments */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
                        <Link to="/requests" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentRequests.slice(0, 5).map((request) => (
                                <Link
                                    key={request._id}
                                    to={`/requests/${request._id}`}
                                    className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                                        {getIcon(request.serviceId?.icon)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate">
                                            {request.serviceId?.name || 'Service'}
                                        </h3>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <CalendarDays size={12} />
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {getStatusBadge(request.status)}
                                </Link>
                            ))}
                            {recentRequests.length === 0 && (
                                <div className="text-center py-8">
                                    <FileText className="mx-auto text-gray-300 mb-3" size={40} />
                                    <p className="text-gray-500">No requests yet</p>
                                    <Link to="/departments" className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block">
                                        Browse Services
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
