import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { citizenAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import { ArrowLeft, ArrowRight, Settings } from 'lucide-react';

export default function DepartmentServices() {
    const { id } = useParams();
    const [department, setDepartment] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const response = await citizenAPI.getDepartmentServices(id);
            setDepartment(response.data.data.department);
            setServices(response.data.data.services || []);
        } catch (error) {
            console.error('Error loading services:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (iconName) => {
        const icons = {
            'heart-pulse': '❤️',
            'leaf': '🌿',
            'calendar-plus': '📅',
            'message-circle': '💬',
            'file-text': '📄',
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

    if (!department) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900">Department not found</h2>
                    <Link to="/departments" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
                        ← Back to Departments
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Back Button */}
            <Link
                to="/departments"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
            >
                <ArrowLeft size={20} />
                Back to Departments
            </Link>

            {/* Department Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-4xl">
                        {getIcon(department.icon)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{department.name}</h1>
                        <p className="text-gray-500 mt-1">{department.description}</p>
                    </div>
                </div>
            </div>

            {/* Services */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Available Services</h2>
                <p className="text-gray-500 text-sm">Select a service to proceed</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                    <Link
                        key={service._id}
                        to={`/services/${service._id}`}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-2xl">
                                {getIcon(service.icon)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {service.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {service.description || 'Click to access this service'}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-600">Apply Now</span>
                            <ArrowRight className="text-blue-600 group-hover:translate-x-1 transition-transform" size={20} />
                        </div>
                    </Link>
                ))}
            </div>

            {services.length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                    <Settings className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900">No services available</h3>
                    <p className="text-gray-500 mt-1">This department has no active services at the moment</p>
                </div>
            )}
        </Layout>
    );
}
