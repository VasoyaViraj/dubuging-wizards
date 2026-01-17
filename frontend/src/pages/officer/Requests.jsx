import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { officerAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import { FileText, Clock, CheckCircle2, XCircle, Filter } from 'lucide-react';

export default function OfficerRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => { loadRequests(); }, []);

    const loadRequests = async () => {
        try {
            const response = await officerAPI.getRequests({ limit: 100 });
            setRequests(response.data.data || []);
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    const getStatusBadge = (status) => {
        const styles = { PENDING: 'bg-amber-100 text-amber-700', ACCEPTED: 'bg-green-100 text-green-700', REJECTED: 'bg-red-100 text-red-700' };
        const icons = { PENDING: Clock, ACCEPTED: CheckCircle2, REJECTED: XCircle };
        const Icon = icons[status] || Clock;
        return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}><Icon size={12} />{status}</span>;
    };

    const filteredRequests = filter === 'all' ? requests : requests.filter(r => r.status === filter);

    if (loading) return <Layout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div></div></Layout>;

    return (
        <Layout>
            <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900">Department Requests</h1><p className="text-gray-500 mt-1">Review and process citizen requests</p></div>
            <div className="flex flex-wrap gap-2 mb-6">
                {[{ value: 'all', label: 'All' }, { value: 'PENDING', label: 'Pending' }, { value: 'ACCEPTED', label: 'Accepted' }, { value: 'REJECTED', label: 'Rejected' }].map((item) => (
                    <button key={item.value} onClick={() => setFilter(item.value)} className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === item.value ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>{item.label}</button>
                ))}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {filteredRequests.map((req) => (
                        <Link key={req._id} to={`/officer/requests/${req._id}`} className="flex items-center gap-4 p-6 hover:bg-gray-50">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium text-sm">{req.citizenId?.name?.charAt(0).toUpperCase()}</div>
                            <div className="flex-1 min-w-0"><h3 className="font-medium text-gray-900">{req.serviceId?.name}</h3><p className="text-sm text-gray-500">{req.citizenId?.name} • {req.citizenId?.email}</p><p className="text-xs text-gray-400 mt-1">{new Date(req.createdAt).toLocaleString()}</p></div>
                            {getStatusBadge(req.status)}
                        </Link>
                    ))}
                </div>
                {filteredRequests.length === 0 && <div className="text-center py-12"><FileText className="mx-auto text-gray-300 mb-4" size={48} /><h3 className="text-lg font-medium text-gray-900">No requests</h3><p className="text-gray-500">{filter === 'all' ? 'No requests yet' : `No ${filter.toLowerCase()} requests`}</p></div>}
            </div>
        </Layout>
    );
}
