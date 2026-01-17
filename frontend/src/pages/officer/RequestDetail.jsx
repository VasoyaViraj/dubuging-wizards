import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { officerAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import { ArrowLeft, CheckCircle2, XCircle, Clock, User, Calendar, FileText, Send } from 'lucide-react';

export default function OfficerRequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [remarks, setRemarks] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => { loadRequest(); }, [id]);

    const loadRequest = async () => {
        try {
            const response = await officerAPI.getRequest(id);
            setRequest(response.data.data);
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    const handleAccept = async () => {
        setProcessing(true);
        try {
            await officerAPI.acceptRequest(id, { remarks });
            navigate('/officer/requests');
        } catch (error) { alert(error.response?.data?.message || 'Failed'); setProcessing(false); }
    };

    const handleReject = async () => {
        if (!remarks.trim()) { alert('Please provide a reason for rejection'); return; }
        setProcessing(true);
        try {
            await officerAPI.rejectRequest(id, { remarks });
            navigate('/officer/requests');
        } catch (error) { alert(error.response?.data?.message || 'Failed'); setProcessing(false); }
    };

    const getStatusBadge = (status) => {
        const config = { PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', Icon: Clock }, ACCEPTED: { bg: 'bg-green-100', text: 'text-green-700', Icon: CheckCircle2 }, REJECTED: { bg: 'bg-red-100', text: 'text-red-700', Icon: XCircle } };
        const { bg, text, Icon } = config[status] || config.PENDING;
        return <div className={`inline-flex items-center gap-2 px-4 py-2 ${bg} ${text} rounded-xl`}><Icon size={18} /><span className="font-medium">{status}</span></div>;
    };

    if (loading) return <Layout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div></div></Layout>;
    if (!request) return <Layout><div className="text-center py-12"><h2 className="text-xl font-semibold text-gray-900">Request not found</h2><Link to="/officer/requests" className="text-blue-600 mt-4 inline-block">← Back</Link></div></Layout>;

    return (
        <Layout>
            <Link to="/officer/requests" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"><ArrowLeft size={20} />Back to Requests</Link>
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div><h1 className="text-2xl font-bold text-gray-900">{request.serviceId?.name}</h1><p className="text-gray-500 mt-1">{request.departmentId?.name}</p></div>
                        {getStatusBadge(request.status)}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><User className="text-blue-600" size={20} /></div><div><p className="text-sm text-gray-500">Citizen</p><p className="font-medium text-gray-900">{request.citizenId?.name}</p><p className="text-sm text-gray-500">{request.citizenId?.email}</p></div></div></div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center"><Calendar className="text-purple-600" size={20} /></div><div><p className="text-sm text-gray-500">Submitted</p><p className="font-medium text-gray-900">{new Date(request.createdAt).toLocaleString()}</p></div></div></div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Submitted Data</h2>
                    <div className="space-y-3">{Object.entries(request.payload || {}).map(([key, value]) => (<div key={key} className="flex flex-col sm:flex-row gap-2"><span className="text-sm font-medium text-gray-500 sm:w-40 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span><span className="text-gray-900">{String(value)}</span></div>))}</div>
                </div>
                {request.status === 'PENDING' && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Take Action</h2>
                        <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-4" rows={3} placeholder="Add remarks or notes (required for rejection)..." />
                        <div className="flex gap-4">
                            <button onClick={handleAccept} disabled={processing} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50"><CheckCircle2 size={20} />Accept</button>
                            <button onClick={handleReject} disabled={processing} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50"><XCircle size={20} />Reject</button>
                        </div>
                    </div>
                )}
                {request.officerRemarks && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-6"><h2 className="text-lg font-semibold text-gray-900 mb-2">Remarks</h2><p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{request.officerRemarks}</p></div>
                )}
            </div>
        </Layout>
    );
}
