import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import StatsChart from '../components/StatsChart';
import { Plus, X, Wallet, TrendingUp, AlertCircle } from 'lucide-react';

export default function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [expRes, statsRes] = await Promise.all([
                axios.get(`${API_URL}/api/expenses`),
                axios.get(`${API_URL}/api/expenses/stats`)
            ]);
            setExpenses(expRes.data);
            setStats(statsRes.data.byCategory || {});
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAdd = async (data) => {
        try {
            await axios.post(`${API_URL}/api/expenses`, data);
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert("Failed to add expense");
        }
    };

    const handleEdit = async (data) => {
        try {
            await axios.put(`${API_URL}/api/expenses/${editingExpense.id}`, data);
            setEditingExpense(null);
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert("Failed to update expense");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${API_URL}/api/expenses/${id}`);
            fetchData();
        } catch (error) {
            alert("Failed to delete expense");
        }
    };

    const openAddModal = () => {
        setEditingExpense(null);
        setIsModalOpen(true);
    };

    const openEditModal = (expense) => {
        setEditingExpense(expense);
        setIsModalOpen(true);
    };

    // Calculate total spend
    const totalSpend = Object.values(stats).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's your spending overview.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm font-semibold"
                >
                    <Plus className="w-5 h-5" /> Add Expense
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Total Spent Card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-2xl shadow-xl shadow-blue-500/20 p-6 text-white relative overflow-hidden lg:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Wallet className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex items-center space-x-2 text-blue-100 mb-2">
                                <Wallet className="w-5 h-5" />
                                <span className="font-medium">Total Spent This Month</span>
                            </div>
                            <h2 className="text-5xl font-bold mt-2">
                                ₹{totalSpend.toFixed(2)}
                            </h2>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/20 flex items-center text-sm text-blue-100">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            <span>You've spent ₹{(totalSpend / 30).toFixed(2)} daily on average this month.</span>
                        </div>
                    </div>
                </div>

                {/* Stats Card */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 lg:col-span-1 flex flex-col transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                            Spending Pattern
                        </h3>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <StatsChart data={stats} />
                    </div>
                </div>
            </div>

            {/* Recent Transactions Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
                <ExpenseList expenses={expenses} onDelete={handleDelete} onEdit={openEditModal} />
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all">
                    <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 shadow-2xl scale-100 animate-jump-in border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingExpense ? 'Edit Transaction' : 'New Transaction'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <ExpenseForm
                                onSubmit={editingExpense ? handleEdit : handleAdd}
                                initialData={editingExpense}
                                onCancel={() => setIsModalOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
