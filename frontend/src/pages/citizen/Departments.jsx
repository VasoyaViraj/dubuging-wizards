import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { citizenAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import { Building2, ArrowRight, Search } from 'lucide-react';

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const response = await citizenAPI.getDepartments();
            setDepartments(response.data.data || []);
        } catch (error) {
            console.error('Error loading departments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (iconName) => {
        const icons = {
            'heart-pulse': '❤️',
            'leaf': '🌿',
            'building': '🏢',
            'book': '📚',
            'car': '🚗',
            'home': '🏠',
        };
        return icons[iconName] || '🏛️';
    };

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
                <p className="text-gray-500 mt-1">Browse government departments and their services</p>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search departments..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDepartments.map((dept) => (
                    <Link
                        key={dept._id}
                        to={`/departments/${dept._id}`}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center text-3xl">
                                {getIcon(dept.icon)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {dept.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {dept.description || 'Access services from this department'}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-sm text-gray-500">View Services</span>
                            <ArrowRight className="text-blue-600 group-hover:translate-x-1 transition-transform" size={20} />
                        </div>
                    </Link>
                ))}
            </div>

            {filteredDepartments.length === 0 && (
                <div className="text-center py-12">
                    <Building2 className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900">No departments found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search terms</p>
                </div>
            )}
        </Layout>
    );
}
