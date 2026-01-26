import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import { Plus, X, Search, Filter } from 'lucide-react';

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/expenses`);
            setExpenses(res.data);
        } catch (error) {
            console.error("Failed to fetch expenses", error);
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

    // Filter expenses based on search
    const filteredExpenses = expenses.filter(exp =>
        exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Expenses</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track all your transactions.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm font-semibold"
                >
                    <Plus className="w-5 h-5" /> Add Expense
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-colors">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search expenses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                    />
                </div>
                {/* Placeholder for future filter dropdown */}
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors">
                    <Filter className="w-5 h-5" />
                </button>
            </div>

            <ExpenseList expenses={filteredExpenses} onDelete={handleDelete} onEdit={openEditModal} />

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
