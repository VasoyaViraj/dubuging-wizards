import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import { Users, Plus, ToggleLeft, ToggleRight, X, Shield } from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'CITIZEN', departmentId: '' });
    const [saving, setSaving] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [usersRes, deptRes] = await Promise.all([adminAPI.getUsers(), adminAPI.getDepartments()]);
            setUsers(usersRes.data.data || []);
            setDepartments(deptRes.data.data || []);
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await adminAPI.createUser(formData);
            loadData();
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', role: 'CITIZEN', departmentId: '' });
        } catch (error) { alert(error.response?.data?.message || 'Failed'); }
        finally { setSaving(false); }
    };

    const toggleUser = async (user) => {
        try { await adminAPI.toggleUser(user._id); loadData(); }
        catch { alert('Failed'); }
    };

    const getRoleBadge = (role) => {
        const styles = { ADMIN: 'bg-purple-100 text-purple-700', CITIZEN: 'bg-blue-100 text-blue-700', DEPARTMENT_PERSON: 'bg-amber-100 text-amber-700' };
        return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[role]}`}><Shield size={12} />{role === 'DEPARTMENT_PERSON' ? 'Officer' : role}</span>;
    };

    const filteredUsers = filter === 'all' ? users : users.filter(u => u.role === filter);

    if (loading) return <Layout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div></div></Layout>;

    return (
        <Layout>
            <div className="flex items-center justify-between mb-8">
                <div><h1 className="text-2xl font-bold text-gray-900">Users</h1><p className="text-gray-500 mt-1">Manage system users</p></div>
                <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"><Plus size={20} />Add User</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
                {[{ value: 'all', label: 'All' }, { value: 'CITIZEN', label: 'Citizens' }, { value: 'DEPARTMENT_PERSON', label: 'Officers' }, { value: 'ADMIN', label: 'Admins' }].map((item) => (
                    <button key={item.value} onClick={() => setFilter(item.value)} className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === item.value ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>{item.label}</button>
                ))}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50"><tr><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">User</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Role</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Department</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">{user.name?.charAt(0).toUpperCase()}</div><div><p className="font-medium text-gray-900">{user.name}</p><p className="text-sm text-gray-500">{user.email}</p></div></div></td>
                                <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                <td className="px-6 py-4"><span className="text-sm text-gray-700">{user.departmentId?.name || '-'}</span></td>
                                <td className="px-6 py-4"><button onClick={() => toggleUser(user)} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{user.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}{user.isActive ? 'Active' : 'Disabled'}</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && <div className="text-center py-12"><Users className="mx-auto text-gray-300 mb-4" size={48} /><h3 className="text-lg font-medium text-gray-900">No users</h3></div>}
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto"><div className="flex items-center justify-center min-h-screen px-4"><div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} /><div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
                    <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold">Add User</h2><button onClick={() => setShowModal(false)}><X size={24} /></button></div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Full Name" required />
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Email" required />
                        <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Password" required minLength={6} />
                        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" required>
                            <option value="CITIZEN">Citizen</option><option value="DEPARTMENT_PERSON">Department Officer</option><option value="ADMIN">Admin</option>
                        </select>
                        {formData.role === 'DEPARTMENT_PERSON' && (
                            <select value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" required>
                                <option value="">Select Department</option>
                                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                            </select>
                        )}
                        <div className="flex gap-3"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl">Cancel</button><button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl disabled:opacity-50">{saving ? '...' : 'Create'}</button></div>
                    </form>
                </div></div></div>
            )}
        </Layout>
    );
}
