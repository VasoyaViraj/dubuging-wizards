import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import { Settings, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';

export default function AdminServices() {
    const [services, setServices] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSvc, setEditingSvc] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', departmentId: '', endpointPath: '', method: 'POST', formSchema: '[]' });
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [svcRes, deptRes] = await Promise.all([adminAPI.getServices(), adminAPI.getDepartments()]);
            setServices(svcRes.data.data || []);
            setDepartments(deptRes.data.data || []);
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    const openModal = (svc = null) => {
        setEditingSvc(svc);
        if (svc) {
            setFormData({ name: svc.name, description: svc.description || '', departmentId: svc.departmentId?._id || '', endpointPath: svc.endpointPath, method: svc.method, formSchema: JSON.stringify(svc.formSchema || [], null, 2) });
        } else {
            setFormData({ name: '', description: '', departmentId: '', endpointPath: '', method: 'POST', formSchema: '[]' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let schema = [];
            try { schema = JSON.parse(formData.formSchema); } catch { alert('Invalid JSON'); setSaving(false); return; }
            const data = { ...formData, formSchema: schema };
            if (editingSvc) await adminAPI.updateService(editingSvc._id, data);
            else await adminAPI.createService(data);
            loadData();
            setShowModal(false);
        } catch (error) { alert(error.response?.data?.message || 'Failed'); }
        finally { setSaving(false); }
    };

    const toggleService = async (svc) => {
        try {
            svc.isActive ? await adminAPI.disableService(svc._id) : await adminAPI.enableService(svc._id);
            loadData();
        } catch (error) { alert(error.response?.data?.message || 'Failed'); }
    };

    const deleteService = async (svc) => {
        if (!confirm(`Delete ${svc.name}?`)) return;
        try { await adminAPI.deleteService(svc._id); loadData(); } catch { alert('Failed'); }
    };

    if (loading) return <Layout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div></div></Layout>;

    return (
        <Layout>
            <div className="flex items-center justify-between mb-8">
                <div><h1 className="text-2xl font-bold text-gray-900">Services</h1><p className="text-gray-500 mt-1">Manage services and forms</p></div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"><Plus size={20} />Add Service</button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50"><tr><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Service</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Department</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Endpoint</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {services.map((svc) => (
                            <tr key={svc._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4"><p className="font-medium text-gray-900">{svc.name}</p><p className="text-sm text-gray-500">{svc.formSchema?.length || 0} fields</p></td>
                                <td className="px-6 py-4"><span className="text-sm text-gray-700">{svc.departmentId?.name}</span></td>
                                <td className="px-6 py-4"><span className="text-sm text-gray-500 font-mono">{svc.method} {svc.endpointPath}</span></td>
                                <td className="px-6 py-4"><button onClick={() => toggleService(svc)} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${svc.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{svc.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}{svc.isActive ? 'Active' : 'Disabled'}</button></td>
                                <td className="px-6 py-4"><div className="flex items-center justify-end gap-2"><button onClick={() => openModal(svc)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={18} /></button><button onClick={() => deleteService(svc)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {services.length === 0 && <div className="text-center py-12"><Settings className="mx-auto text-gray-300 mb-4" size={48} /><h3 className="text-lg font-medium text-gray-900">No services</h3></div>}
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto"><div className="flex items-center justify-center min-h-screen px-4"><div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} /><div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold">{editingSvc ? 'Edit' : 'Add'} Service</h2><button onClick={() => setShowModal(false)}><X size={24} /></button></div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Service Name" required />
                        <select value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" required disabled={!!editingSvc}>
                            <option value="">Select Department</option>
                            {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                        </select>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Description" rows={2} />
                        <div className="grid grid-cols-2 gap-4">
                            <select value={formData.method} onChange={(e) => setFormData({ ...formData, method: e.target.value })} className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                                <option value="POST">POST</option><option value="GET">GET</option>
                            </select>
                            <input type="text" value={formData.endpointPath} onChange={(e) => setFormData({ ...formData, endpointPath: e.target.value })} className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="/internal/endpoint" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Form Schema (JSON)</label>
                            <textarea value={formData.formSchema} onChange={(e) => setFormData({ ...formData, formSchema: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm" rows={8} placeholder='[{"name":"field","label":"Field","type":"text","required":true}]' />
                        </div>
                        <div className="flex gap-3"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl">Cancel</button><button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl disabled:opacity-50">{saving ? '...' : (editingSvc ? 'Update' : 'Create')}</button></div>
                    </form>
                </div></div></div>
            )}
        </Layout>
    );
}
