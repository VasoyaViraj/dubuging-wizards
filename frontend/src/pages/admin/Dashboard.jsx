import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import {
    Building2, Settings, Users, FileText,
    TrendingUp, CheckCircle2, Clock, XCircle,
    ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await adminAPI.getStats();
            setStats(response.data.data);
        } catch (error) {
            console.error('Error loading stats:', error);
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
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
                {status}
            </span>
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

    return (
        <Layout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">System overview and management</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Departments</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.departments?.total || 0}</p>
                            <p className="text-sm text-green-600 mt-1">{stats?.departments?.active || 0} active</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Building2 className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Services</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.services?.total || 0}</p>
                            <p className="text-sm text-green-600 mt-1">{stats?.services?.active || 0} active</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Settings className="text-purple-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Users</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.users?.total || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Users className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Requests</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.requests?.total || 0}</p>
                            <p className="text-sm text-amber-600 mt-1">{stats?.requests?.pending || 0} pending</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <FileText className="text-amber-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
                    <Clock className="mb-4" size={32} />
                    <p className="text-amber-100">Pending</p>
                    <p className="text-4xl font-bold mt-1">{stats?.requests?.pending || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                    <CheckCircle2 className="mb-4" size={32} />
                    <p className="text-green-100">Accepted</p>
                    <p className="text-4xl font-bold mt-1">{stats?.requests?.accepted || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
                    <XCircle className="mb-4" size={32} />
                    <p className="text-red-100">Rejected</p>
                    <p className="text-4xl font-bold mt-1">{stats?.requests?.rejected || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Requests by Department */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Requests by Department</h2>
                    </div>
                    <div className="p-6">
                        {stats?.requestsByDepartment?.length > 0 ? (
                            <div className="space-y-4">
                                {stats.requestsByDepartment.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-gray-700">{item.departmentName}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-600 rounded-full"
                                                    style={{
                                                        width: `${Math.min((item.count / Math.max(...stats.requestsByDepartment.map(d => d.count))) * 100, 100)}%`
                                                    }}
                                                />
                                            </div>
                                            <span className="font-medium text-gray-900 w-8 text-right">{item.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-4">No data available</p>
                        )}
                    </div>
                </div>

                {/* Recent Requests */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {stats?.recentRequests?.slice(0, 5).map((request) => (
                            <div key={request._id} className="p-4 flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{request.serviceId?.name}</p>
                                    <p className="text-sm text-gray-500">{request.citizenId?.name}</p>
                                </div>
                                {getStatusBadge(request.status)}
                            </div>
                        ))}
                        {(!stats?.recentRequests || stats.recentRequests.length === 0) && (
                            <p className="text-center text-gray-500 py-8">No recent requests</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    to="/admin/departments"
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
                >
                    <Building2 className="text-blue-600 mb-4" size={32} />
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Manage Departments</h3>
                    <p className="text-sm text-gray-500 mt-1">Add, edit, or disable departments</p>
                </Link>
                <Link
                    to="/admin/services"
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
                >
                    <Settings className="text-purple-600 mb-4" size={32} />
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Manage Services</h3>
                    <p className="text-sm text-gray-500 mt-1">Configure services and forms</p>
                </Link>
                <Link
                    to="/admin/users"
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
                >
                    <Users className="text-green-600 mb-4" size={32} />
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Manage Users</h3>
                    <p className="text-sm text-gray-500 mt-1">Add officers and manage users</p>
                </Link>
            </div>
        </Layout>
    );
}
