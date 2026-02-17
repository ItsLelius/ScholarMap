import React, { useState } from 'react';
import axios from 'axios';
import VerifyOTP from './VerifyOTP'; // Ensure this file exists in the same folder

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages
        try {
            const res = await axios.post('http://localhost:5000/api/login', { email, password });
            if (res.data.success) {
                setIsOtpSent(true);
            }
        } catch (err) {
            setMessage("Error: Invalid email or password.");
        }
    };

    // If OTP is sent, show the Verification Screen instead of the Login Form
    if (isOtpSent) {
        return <VerifyOTP email={email} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" 
             style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-200">
                        <span className="text-white text-3xl font-bold">S</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
                    <p className="text-slate-500 text-sm mt-2">Please enter your details to sign in.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter your email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
                        </div>
                        <input 
                            type="password" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id="remember" className="rounded text-blue-600" />
                        <label htmlFor="remember" className="text-sm text-slate-600">Remember me</label>
                    </div>

                    <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg">
                        Sign in
                    </button>
                </form>

                {message && (
                    <p className={`mt-4 text-center text-sm font-medium ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                        {message}
                    </p>
                )}

                <p className="text-center text-sm text-slate-500 mt-8">
                    Don't have an account yet? <a href="#" className="text-slate-900 font-bold hover:underline">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;