import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { officerAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import { FileText, Clock, CheckCircle2, XCircle, ArrowRight, TrendingUp } from 'lucide-react';

export default function OfficerDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [statsRes, reqRes] = await Promise.all([officerAPI.getStats(), officerAPI.getRequests({ limit: 10 })]);
            setStats(statsRes.data.data);
            setRequests(reqRes.data.data || []);
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    const getStatusBadge = (status) => {
        const styles = { PENDING: 'bg-amber-100 text-amber-700', ACCEPTED: 'bg-green-100 text-green-700', REJECTED: 'bg-red-100 text-red-700' };
        const icons = { PENDING: Clock, ACCEPTED: CheckCircle2, REJECTED: XCircle };
        const Icon = icons[status] || Clock;
        return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}><Icon size={12} />{status}</span>;
    };

    if (loading) return <Layout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div></div></Layout>;

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Department Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome, {user?.name} • {user?.departmentId?.name || 'Department Officer'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><FileText className="text-blue-600" size={24} /></div><div><p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p><p className="text-gray-500 text-sm">Total Requests</p></div></div></div>
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white"><Clock className="mb-2" size={24} /><p className="text-amber-100 text-sm">Pending</p><p className="text-3xl font-bold">{stats?.pending || 0}</p></div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white"><CheckCircle2 className="mb-2" size={24} /><p className="text-green-100 text-sm">Accepted</p><p className="text-3xl font-bold">{stats?.accepted || 0}</p></div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white"><XCircle className="mb-2" size={24} /><p className="text-red-100 text-sm">Rejected</p><p className="text-3xl font-bold">{stats?.rejected || 0}</p></div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100"><h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2><Link to="/officer/requests" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">View All <ArrowRight size={16} /></Link></div>
                <div className="divide-y divide-gray-100">
                    {requests.slice(0, 5).map((req) => (
                        <Link key={req._id} to={`/officer/requests/${req._id}`} className="flex items-center gap-4 p-6 hover:bg-gray-50">
                            <div className="flex-1 min-w-0"><h3 className="font-medium text-gray-900">{req.serviceId?.name}</h3><p className="text-sm text-gray-500">{req.citizenId?.name} • {new Date(req.createdAt).toLocaleDateString()}</p></div>
                            {getStatusBadge(req.status)}
                        </Link>
                    ))}
                    {requests.length === 0 && <div className="text-center py-12"><FileText className="mx-auto text-gray-300 mb-4" size={48} /><p className="text-gray-500">No requests</p></div>}
                </div>
            </div>
        </Layout>
    );
}
