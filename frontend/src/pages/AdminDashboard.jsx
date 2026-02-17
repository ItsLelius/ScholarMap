import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-6 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">S</div>
                    <span className="text-xl font-bold text-slate-800">ScholarMap</span>
                </div>
                
                <nav className="flex-1 px-4 space-y-1 mt-4">
                    <a href="#" className="flex items-center space-x-3 bg-slate-100 text-blue-600 p-3 rounded-xl font-medium">
                        <span>Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 text-slate-500 hover:bg-slate-50 p-3 rounded-xl transition-all">
                        <span>Applications</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 text-slate-500 hover:bg-slate-50 p-3 rounded-xl transition-all">
                        <span>Scholars</span>
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button onClick={() => window.location.href = '/'} className="w-full text-left text-slate-500 p-3 hover:text-red-600 transition-colors">
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
                    <h2 className="text-xl font-semibold text-slate-800">Overview</h2>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-700">Admin User</p>
                            <p className="text-xs text-slate-500">System Administrator</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                    </div>
                </header>

                <main className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {['Total Scholars', 'Pending Apps', 'Approved'].map((title, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <p className="text-sm text-slate-500 font-medium">{title}</p>
                                <p className="text-3xl font-bold text-slate-800 mt-2">{[124, 45, 89][i]}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50">
                            <h3 className="font-bold text-slate-800">Recent Activity</h3>
                        </div>
                        <div className="p-12 text-center">
                            <p className="text-slate-400 italic">No recent applications to display.</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;