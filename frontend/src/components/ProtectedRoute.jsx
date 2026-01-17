import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Redirect to appropriate dashboard based on role
        const roleRoutes = {
            ADMIN: '/admin/dashboard',
            CITIZEN: '/dashboard',
            DEPARTMENT_PERSON: '/officer/dashboard',
        };
        return <Navigate to={roleRoutes[user.role] || '/login'} replace />;
    }

    return children;
};

export const PublicRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        const roleRoutes = {
            ADMIN: '/admin/dashboard',
            CITIZEN: '/dashboard',
            DEPARTMENT_PERSON: '/officer/dashboard',
        };
        return <Navigate to={roleRoutes[user.role] || '/dashboard'} replace />;
    }

    return children;
};
