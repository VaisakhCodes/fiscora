import { useState, useEffect } from 'react';
import { Calendar, Tag, DollarSign, Type, FileText } from 'lucide-react';
import clsx from 'clsx';

export default function ExpenseForm({ onSubmit, initialData = null, onCancel }) {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                date: new Date(initialData.date).toISOString().split('T')[0]
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert amount to number
        onSubmit({ ...formData, amount: parseFloat(formData.amount) });
    };

    const inputClasses = "w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500";
    const labelClasses = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className={labelClasses}>Description</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        name="description"
                        required
                        placeholder="e.g. Grocery Shopping"
                        value={formData.description}
                        onChange={handleChange}
                        className={inputClasses}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>Amount (₹)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-sm">₹</span>
                        <input
                            type="number"
                            step="0.01"
                            name="amount"
                            required
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleChange}
                            className={inputClasses}
                        />
                    </div>
                </div>
                <div>
                    <label className={labelClasses}>Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            className={inputClasses}
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className={labelClasses}>Category</label>
                <div className="relative">
                    <Tag className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={inputClasses}
                    >
                        <option>Food</option>
                        <option>Transport</option>
                        <option>Utilities</option>
                        <option>Entertainment</option>
                        <option>Health</option>
                        <option>Shopping</option>
                        <option>Other</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    {initialData ? 'Update Expense' : 'Save Expense'}
                </button>
            </div>
        </form>
    );
}
