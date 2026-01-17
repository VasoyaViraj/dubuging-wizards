import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register(name.trim(), email.trim(), password);
            navigate('/dashboard');
        } catch (err) {
            setError(err?.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Branding */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-xl font-bold text-white">N</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">Nexus</span>
                    </div>
                    <p className="text-gray-500">Centralized Governance Platform</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-500 mt-1">Join as a citizen</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500"
                        />

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
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Creating account…' : <><UserPlus size={18} /> Create Account</>}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700">
                            <ArrowLeft className="inline w-4 h-4" /> Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
