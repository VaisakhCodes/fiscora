const prisma = require('../utils/prismaClient');

exports.getExpenses = async (req, res) => {
    try {
        const { userId } = req.user;
        const { month, year } = req.query;

        let whereClause = { userId: userId };

        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0); // Last day of month
            whereClause.date = {
                gte: startDate,
                lte: endDate
            };
        }

        const expenses = await prisma.expense.findMany({
            where: whereClause,
            orderBy: { date: 'desc' }
        });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createExpense = async (req, res) => {
    try {
        const { amount, category, description, date } = req.body;
        const { userId } = req.user;

        const expense = await prisma.expense.create({
            data: {
                amount: parseFloat(amount),
                category,
                description,
                date: new Date(date),
                userId
            }
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const { amount, category, description, date } = req.body;

        const expense = await prisma.expense.findFirst({ where: { id: parseInt(id), userId } });
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        const updated = await prisma.expense.update({
            where: { id: parseInt(id) },
            data: {
                amount: parseFloat(amount),
                category,
                description,
                date: new Date(date)
            }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        const expense = await prisma.expense.findFirst({ where: { id: parseInt(id), userId } });
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        await prisma.expense.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMonthlyStats = async (req, res) => {
    try {
        const { userId } = req.user;
        const { month, year } = req.query;

        // Current month by default or specified
        const now = new Date();
        const searchYear = year ? parseInt(year) : now.getFullYear();
        const searchMonth = month ? parseInt(month) : now.getMonth() + 1;

        const startDate = new Date(searchYear, searchMonth - 1, 1);
        const endDate = new Date(searchYear, searchMonth, 0);

        const expenses = await prisma.expense.findMany({
            where: {
                userId,
                date: { gte: startDate, lte: endDate }
            }
        });

        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        // Group by category
        const byCategory = expenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {});

        res.json({ total, byCategory, month: searchMonth, year: searchYear });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
