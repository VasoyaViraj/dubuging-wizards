import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Citizen Pages
import CitizenDashboard from './pages/citizen/Dashboard';
import Departments from './pages/citizen/Departments';
import DepartmentServices from './pages/citizen/DepartmentServices';
import ServiceForm from './pages/citizen/ServiceForm';
import Requests from './pages/citizen/Requests';
import RequestDetail from './pages/citizen/RequestDetail';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminDepartments from './pages/admin/Departments';
import AdminServices from './pages/admin/Services';
import AdminUsers from './pages/admin/Users';

// Officer Pages
import OfficerDashboard from './pages/officer/Dashboard';
import OfficerRequests from './pages/officer/Requests';
import OfficerRequestDetail from './pages/officer/RequestDetail';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Citizen Routes */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenDashboard /></ProtectedRoute>} />
          <Route path="/departments" element={<ProtectedRoute allowedRoles={['CITIZEN']}><Departments /></ProtectedRoute>} />
          <Route path="/departments/:id" element={<ProtectedRoute allowedRoles={['CITIZEN']}><DepartmentServices /></ProtectedRoute>} />
          <Route path="/services/:id" element={<ProtectedRoute allowedRoles={['CITIZEN']}><ServiceForm /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute allowedRoles={['CITIZEN']}><Requests /></ProtectedRoute>} />
          <Route path="/requests/:id" element={<ProtectedRoute allowedRoles={['CITIZEN']}><RequestDetail /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDepartments /></ProtectedRoute>} />
          <Route path="/admin/services" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminServices /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />

          {/* Officer Routes */}
          <Route path="/officer/dashboard" element={<ProtectedRoute allowedRoles={['DEPARTMENT_PERSON']}><OfficerDashboard /></ProtectedRoute>} />
          <Route path="/officer/requests" element={<ProtectedRoute allowedRoles={['DEPARTMENT_PERSON']}><OfficerRequests /></ProtectedRoute>} />
          <Route path="/officer/requests/:id" element={<ProtectedRoute allowedRoles={['DEPARTMENT_PERSON']}><OfficerRequestDetail /></ProtectedRoute>} />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
