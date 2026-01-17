import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Building2,
    FileText,
    LogOut,
    Menu,
    X,
    Bell,
    User,
    Settings,
    Shield,
    Users
} from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
    const { user, logout, isAdmin, isOfficer } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const citizenLinks = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/departments', icon: Building2, label: 'Departments' },
        { to: '/requests', icon: FileText, label: 'My Requests' },
    ];

    const adminLinks = [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/departments', icon: Building2, label: 'Departments' },
        { to: '/admin/services', icon: Settings, label: 'Services' },
        { to: '/admin/users', icon: Users, label: 'Users' },
    ];

    const officerLinks = [
        { to: '/officer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/officer/requests', icon: FileText, label: 'Requests' },
    ];

    const links = isAdmin ? adminLinks : isOfficer ? officerLinks : citizenLinks;

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">N</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">Nexus</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Role Badge */}
                    <div className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isAdmin ? 'bg-purple-100 text-purple-700' :
                            isOfficer ? 'bg-amber-100 text-amber-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                            <Shield size={14} />
                            {isAdmin ? 'Administrator' : isOfficer ? 'Department Officer' : 'Citizen'}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-2 overflow-y-auto">
                        <ul className="space-y-1">
                            {links.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(link.to)
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <link.icon size={20} />
                                        <span className="font-medium">{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <LogOut size={18} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64 ">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 lg:flex-none" />

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
