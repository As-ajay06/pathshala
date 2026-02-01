'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Download,
    Calendar,
    CreditCard,
    Users,
    BookOpen,
    ChevronDown,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Filter,
    BarChart3,
    PieChart,
    Wallet,
    RefreshCw,
    ExternalLink,
    Settings
} from 'lucide-react';

interface Transaction {
    id: string;
    type: 'sale' | 'refund' | 'payout';
    course: string;
    student: string;
    amount: number;
    platformFee: number;
    netAmount: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
}

interface EarningsData {
    totalEarnings: number;
    thisMonth: number;
    lastMonth: number;
    pendingPayout: number;
    totalStudents: number;
    totalCoursesSold: number;
}

const mockEarnings: EarningsData = {
    totalEarnings: 12580,
    thisMonth: 3240,
    lastMonth: 2890,
    pendingPayout: 1850,
    totalStudents: 456,
    totalCoursesSold: 892,
};

const mockTransactions: Transaction[] = [
    { id: '1', type: 'sale', course: 'Complete React Masterclass', student: 'John Doe', amount: 99, platformFee: 29.70, netAmount: 69.30, date: '2026-01-25', status: 'completed' },
    { id: '2', type: 'sale', course: 'Node.js Backend Development', student: 'Jane Smith', amount: 149, platformFee: 44.70, netAmount: 104.30, date: '2026-01-24', status: 'completed' },
    { id: '3', type: 'refund', course: 'JavaScript Essentials', student: 'Mike Brown', amount: -79, platformFee: -23.70, netAmount: -55.30, date: '2026-01-23', status: 'completed' },
    { id: '4', type: 'sale', course: 'Complete React Masterclass', student: 'Sarah Wilson', amount: 99, platformFee: 29.70, netAmount: 69.30, date: '2026-01-22', status: 'completed' },
    { id: '5', type: 'payout', course: 'All Courses', student: '-', amount: -1500, platformFee: 0, netAmount: -1500, date: '2026-01-20', status: 'completed' },
    { id: '6', type: 'sale', course: 'TypeScript Mastery', student: 'Alex Johnson', amount: 129, platformFee: 38.70, netAmount: 90.30, date: '2026-01-19', status: 'completed' },
    { id: '7', type: 'sale', course: 'Complete React Masterclass', student: 'Emily Davis', amount: 99, platformFee: 29.70, netAmount: 69.30, date: '2026-01-18', status: 'pending' },
];

const monthlyData = [
    { month: 'Aug', earnings: 1890 },
    { month: 'Sep', earnings: 2340 },
    { month: 'Oct', earnings: 2780 },
    { month: 'Nov', earnings: 2560 },
    { month: 'Dec', earnings: 2890 },
    { month: 'Jan', earnings: 3240 },
];

const courseBreakdown = [
    { course: 'Complete React Masterclass', earnings: 5890, percentage: 47 },
    { course: 'Node.js Backend Development', earnings: 3240, percentage: 26 },
    { course: 'TypeScript Mastery', earnings: 2150, percentage: 17 },
    { course: 'JavaScript Essentials', earnings: 1300, percentage: 10 },
];

export default function EarningsPage() {
    const [dateRange, setDateRange] = useState('this-month');
    const [transactionFilter, setTransactionFilter] = useState<'all' | 'sale' | 'refund' | 'payout'>('all');

    const earnings = mockEarnings;
    const monthChange = ((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth) * 100;

    const filteredTransactions = mockTransactions.filter(t =>
        transactionFilter === 'all' || t.type === transactionFilter
    );

    const maxMonthlyEarnings = Math.max(...monthlyData.map(d => d.earnings));

    const getTransactionTypeColor = (type: Transaction['type']) => {
        switch (type) {
            case 'sale': return 'text-[var(--success-400)] bg-[var(--success-500)]/10';
            case 'refund': return 'text-[var(--error-400)] bg-[var(--error-500)]/10';
            case 'payout': return 'text-[var(--primary-400)] bg-[var(--primary-500)]/10';
        }
    };

    const getStatusColor = (status: Transaction['status']) => {
        switch (status) {
            case 'completed': return 'text-[var(--success-400)]';
            case 'pending': return 'text-[var(--warning-400)]';
            case 'failed': return 'text-[var(--error-400)]';
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Earnings</h1>
                    <p className="text-[var(--text-secondary)]">
                        Track your revenue and manage payouts
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            className="input appearance-none cursor-pointer pr-10 py-2"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <option value="this-week">This Week</option>
                            <option value="this-month">This Month</option>
                            <option value="last-month">Last Month</option>
                            <option value="this-year">This Year</option>
                            <option value="all-time">All Time</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                    </div>
                    <button className="btn btn-secondary">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button className="btn btn-accent">
                        <Wallet className="w-4 h-4" />
                        Request Payout
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--success-500)]/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-[var(--success-400)]" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${monthChange >= 0 ? 'text-[var(--success-400)]' : 'text-[var(--error-400)]'}`}>
                            {monthChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {Math.abs(monthChange).toFixed(1)}%
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">${earnings.thisMonth.toLocaleString()}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">This Month</p>
                </div>

                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--primary-500)]/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-[var(--primary-400)]" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">${earnings.totalEarnings.toLocaleString()}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">Total Earnings</p>
                </div>

                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--warning-500)]/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-[var(--warning-400)]" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">${earnings.pendingPayout.toLocaleString()}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">Pending Payout</p>
                </div>

                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-500)]/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-[var(--accent-400)]" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{earnings.totalCoursesSold}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">Courses Sold</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Monthly Chart */}
                <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[var(--accent-400)]" />
                            Monthly Earnings
                        </h3>
                    </div>
                    <div className="h-64 flex items-end gap-4">
                        {monthlyData.map((data, index) => (
                            <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className="w-full bg-gradient-to-t from-[var(--primary-500)] to-[var(--accent-500)] rounded-t-lg transition-all hover:from-[var(--primary-400)] hover:to-[var(--accent-400)]"
                                    style={{ height: `${(data.earnings / maxMonthlyEarnings) * 100}%` }}
                                />
                                <span className="text-xs text-[var(--text-tertiary)]">{data.month}</span>
                                <span className="text-xs font-medium text-white">${(data.earnings / 1000).toFixed(1)}k</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Course Breakdown */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-[var(--accent-400)]" />
                        Revenue by Course
                    </h3>
                    <div className="space-y-4">
                        {courseBreakdown.map((course, index) => (
                            <div key={course.course}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-[var(--text-secondary)] truncate max-w-[150px]">{course.course}</span>
                                    <span className="text-sm font-medium text-white">${course.earnings.toLocaleString()}</span>
                                </div>
                                <div className="w-full h-2 bg-[var(--surface-glass)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${course.percentage}%`,
                                            backgroundColor: index === 0 ? 'var(--primary-500)' :
                                                index === 1 ? 'var(--accent-500)' :
                                                    index === 2 ? 'var(--success-500)' : 'var(--warning-500)'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transactions */}
            <div className="glass-card overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
                    <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                    <div className="flex gap-2">
                        {(['all', 'sale', 'refund', 'payout'] as const).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setTransactionFilter(filter)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${transactionFilter === filter
                                    ? 'bg-[var(--accent-500)] text-white'
                                    : 'bg-[var(--surface-glass)] text-[var(--text-secondary)] hover:text-white'
                                    }`}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border-subtle)]">
                                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase">Date</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase">Type</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase">Course</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase">Student</th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase">Amount</th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase">Fee (30%)</th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase">Net</th>
                                <th className="text-center py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-glass)]">
                                    <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">
                                        {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTransactionTypeColor(transaction.type)}`}>
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-white max-w-[200px] truncate">{transaction.course}</td>
                                    <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">{transaction.student}</td>
                                    <td className="py-3 px-4 text-sm text-right text-white">
                                        ${Math.abs(transaction.amount).toFixed(2)}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-right text-[var(--text-tertiary)]">
                                        ${Math.abs(transaction.platformFee).toFixed(2)}
                                    </td>
                                    <td className={`py-3 px-4 text-sm text-right font-medium ${transaction.netAmount >= 0 ? 'text-[var(--success-400)]' : 'text-[var(--error-400)]'}`}>
                                        {transaction.netAmount >= 0 ? '+' : '-'}${Math.abs(transaction.netAmount).toFixed(2)}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`inline-flex items-center gap-1 text-xs ${getStatusColor(transaction.status)}`}>
                                            {transaction.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                            {transaction.status === 'pending' && <Clock className="w-3 h-3" />}
                                            {transaction.status === 'failed' && <XCircle className="w-3 h-3" />}
                                            {transaction.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 text-center border-t border-[var(--border-subtle)]">
                    <button className="text-sm text-[var(--primary-400)] hover:text-[var(--primary-300)]">
                        View All Transactions
                    </button>
                </div>
            </div>

            {/* Payout Settings */}
            <div className="glass-card p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[var(--accent-400)]" />
                        Payout Settings
                    </h3>
                    <button className="btn btn-ghost btn-sm">
                        <Settings className="w-4 h-4" />
                        Configure
                    </button>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 bg-[var(--surface-glass)] rounded-xl">
                        <p className="text-sm text-[var(--text-tertiary)] mb-1">Payout Method</p>
                        <p className="text-white font-medium">Bank Account ****4589</p>
                    </div>
                    <div className="p-4 bg-[var(--surface-glass)] rounded-xl">
                        <p className="text-sm text-[var(--text-tertiary)] mb-1">Payout Schedule</p>
                        <p className="text-white font-medium">Monthly (1st of each month)</p>
                    </div>
                    <div className="p-4 bg-[var(--surface-glass)] rounded-xl">
                        <p className="text-sm text-[var(--text-tertiary)] mb-1">Minimum Payout</p>
                        <p className="text-white font-medium">$100.00</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
