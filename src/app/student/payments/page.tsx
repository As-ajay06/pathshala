'use client';

import { useState, useEffect } from 'react';
import {
    CreditCard,
    Download,
    CheckCircle,
    Clock,
    XCircle,
    Loader2,
    Receipt,
    ArrowUpDown,
    IndianRupee
} from 'lucide-react';

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

    useEffect(() => {
        async function fetchPayments() {
            try {
                const res = await fetch('/api/student/payments');
                if (res.ok) {
                    const json = await res.json();
                    setPayments(json);
                }
            } catch (err) {
                console.error('Failed to fetch payments:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchPayments();
    }, []);

    const filteredPayments = payments.filter(p =>
        filter === 'all' || p.status === filter
    );

    const totalSpent = payments
        .filter(p => p.status === 'completed')
        .reduce((acc, p) => acc + (p.amount || 0), 0);

    const statusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-4 h-4 text-[var(--success-400)]" />;
            case 'pending': return <Clock className="w-4 h-4 text-[var(--warning-400)]" />;
            case 'failed': return <XCircle className="w-4 h-4 text-[var(--error-400)]" />;
            case 'refunded': return <ArrowUpDown className="w-4 h-4 text-blue-400" />;
            default: return null;
        }
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-[var(--success-400)] bg-[var(--success-400)]/10';
            case 'pending': return 'text-[var(--warning-400)] bg-[var(--warning-400)]/10';
            case 'failed': return 'text-[var(--error-400)] bg-[var(--error-400)]/10';
            case 'refunded': return 'text-blue-400 bg-blue-400/10';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-[var(--primary-400)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Payment History</h1>
                <p className="text-[var(--text-secondary)]">View your transactions and receipts</p>
            </div>

            {/* Summary Card */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center">
                        <IndianRupee className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-[var(--text-secondary)]">Total Spent</p>
                        <p className="text-2xl font-bold text-white">₹{totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-sm text-[var(--text-secondary)]">Transactions</p>
                        <p className="text-2xl font-bold text-white">{payments.length}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {(['all', 'completed', 'pending', 'failed'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Payments List */}
            {filteredPayments.length > 0 ? (
                <div className="space-y-3">
                    {filteredPayments.map((payment) => (
                        <div key={payment._id} className="glass-card p-4 flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusColor(payment.status)}`}>
                                {statusIcon(payment.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white truncate">{payment.course}</h3>
                                <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                                    <span>{new Date(payment.date).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{payment.method}</span>
                                    <span>•</span>
                                    <span className="uppercase">{payment.orderId}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-white">₹{payment.amount.toLocaleString()}</p>
                                <span className={`text-xs capitalize ${statusColor(payment.status)} px-2 py-0.5 rounded-full`}>
                                    {payment.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card p-12 text-center">
                    <Receipt className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No payments found</h3>
                    <p className="text-[var(--text-secondary)]">
                        {payments.length === 0
                            ? 'Your payment history will appear here after you enroll in a course.'
                            : 'No payments match the selected filter.'}
                    </p>
                </div>
            )}
        </div>
    );
}
