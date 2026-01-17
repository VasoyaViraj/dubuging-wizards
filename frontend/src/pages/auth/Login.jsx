import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);

            const roleRoutes = {
                ADMIN: '/admin/dashboard',
                CITIZEN: '/dashboard',
                DEPARTMENT_PERSON: '/officer/dashboard',
            };

            navigate(roleRoutes[user?.role] || '/dashboard');
        } catch (err) {
            setError(err?.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
                {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" /> */}

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">N</span>
                        </div>
                        <span className="text-3xl font-bold text-white">Nexus</span>
                    </div>
                    <p className="text-blue-100 text-lg">Centralized Governance Platform</p>
                </div>

                <div className="relative z-10 space-y-8">
                    <h2 className="text-4xl font-bold text-white leading-tight">
                        One Platform,<br />All Government Services
                    </h2>
                    <p className="text-blue-100 text-lg max-w-md">
                        Access healthcare, agriculture, and more government services through a single, secure portal.
                    </p>

                    <div className="flex gap-4">
                        {[
                            ['10+', 'Departments'],
                            ['50+', 'Services'],
                            ['24/7', 'Available'],
                        ].map(([value, label]) => (
                            <div key={label} className="bg-white/10 backdrop-blur rounded-lg px-4 py-3">
                                <div className="text-2xl font-bold text-white">{value}</div>
                                <div className="text-blue-200 text-sm">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-blue-200 text-sm">
                    © 2026 Nexus Governance Platform
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
                        <p className="text-gray-500 text-center mb-6">Sign in to your account</p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500"
                            />

                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border rounded-xl pr-12 focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl flex justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Signing in…' : <><LogIn size={18} /> Sign In</>}
                            </button>
                        </form>

                        <p className="text-center text-gray-500 mt-6">
                            Don’t have an account?{' '}
                            <Link to="/register" className="text-blue-600 font-medium">
                                Register <ArrowRight className="inline w-4 h-4" />
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
