import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import { Building2, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Check, ExternalLink } from 'lucide-react';

export default function AdminDepartments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', code: '', endpointBaseUrl: '', icon: 'building' });
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadDepartments(); }, []);

    const loadDepartments = async () => {
        try {
            const response = await adminAPI.getDepartments();
            setDepartments(response.data.data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (dept = null) => {
        setEditingDept(dept);
        setFormData(dept ? { name: dept.name, description: dept.description || '', code: dept.code, endpointBaseUrl: dept.endpointBaseUrl, icon: dept.icon || 'building' } : { name: '', description: '', code: '', endpointBaseUrl: '', icon: 'building' });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingDept) await adminAPI.updateDepartment(editingDept._id, formData);
            else await adminAPI.createDepartment(formData);
            loadDepartments();
            setShowModal(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed');
        } finally {
            setSaving(false);
        }
    };

    const toggleDepartment = async (dept) => {
        try {
            dept.isActive ? await adminAPI.disableDepartment(dept._id) : await adminAPI.enableDepartment(dept._id);
            loadDepartments();
        } catch (error) { alert('Failed'); }
    };

    const deleteDepartment = async (dept) => {
        if (!confirm(`Delete ${dept.name}?`)) return;
        try { await adminAPI.deleteDepartment(dept._id); loadDepartments(); } catch { alert('Failed'); }
    };

    if (loading) return <Layout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div></div></Layout>;

    return (
        <Layout>
            <div className="flex items-center justify-between mb-8">
                <div><h1 className="text-2xl font-bold text-gray-900">Departments</h1><p className="text-gray-500 mt-1">Manage departments</p></div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"><Plus size={20} />Add</button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50"><tr><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Department</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Code</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {departments.map((dept) => (
                            <tr key={dept._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Building2 className="text-blue-600" size={20} /></div><div><p className="font-medium text-gray-900">{dept.name}</p><p className="text-sm text-gray-500">{dept.endpointBaseUrl}</p></div></div></td>
                                <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm font-mono">{dept.code}</span></td>
                                <td className="px-6 py-4"><button onClick={() => toggleDepartment(dept)} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${dept.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{dept.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}{dept.isActive ? 'Active' : 'Disabled'}</button></td>
                                <td className="px-6 py-4"><div className="flex items-center justify-end gap-2"><button onClick={() => openModal(dept)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={18} /></button><button onClick={() => deleteDepartment(dept)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {departments.length === 0 && <div className="text-center py-12"><Building2 className="mx-auto text-gray-300 mb-4" size={48} /><h3 className="text-lg font-medium text-gray-900">No departments</h3></div>}
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto"><div className="flex items-center justify-center min-h-screen px-4"><div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} /><div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
                    <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold">{editingDept ? 'Edit' : 'Add'} Department</h2><button onClick={() => setShowModal(false)}><X size={24} /></button></div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Name" required />
                        <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono" placeholder="CODE" required disabled={!!editingDept} />
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Description" rows={2} />
                        <input type="url" value={formData.endpointBaseUrl} onChange={(e) => setFormData({ ...formData, endpointBaseUrl: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="http://localhost:5001" required />
                        <div className="flex gap-3"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl">Cancel</button><button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl disabled:opacity-50">{saving ? '...' : (editingDept ? 'Update' : 'Create')}</button></div>
                    </form>
                </div></div></div>
            )}
        </Layout>
    );
}
