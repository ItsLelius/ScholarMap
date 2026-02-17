import React, { useState } from 'react';
import axios from 'axios';

const VerifyOTP = ({ email }) => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/verify-otp', { email, otp });
            if (res.data.success) {
                window.location.href = '/dashboard'; // Redirect to Admin Dashboard
            }
        } catch (err) {
            setMessage("Invalid or expired code. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" 
             style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100 text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Verify Code</h1>
                    <p className="text-slate-500 text-sm mt-2">We sent a 6-digit code to <span className="font-semibold text-slate-700">{email}</span></p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <input 
                        type="text" 
                        maxLength="6"
                        className="w-full text-center text-3xl tracking-widest px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="000000"
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />

                    <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                        Verify and Sign In
                    </button>
                </form>

                {message && <p className="mt-4 text-red-500 text-sm">{message}</p>}
            </div>
        </div>
    );
};

export default VerifyOTP;