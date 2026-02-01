'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    CreditCard,
    Download,
    Search,
    Filter,
    ChevronDown,
    CheckCircle,
    Clock,
    XCircle,
    BookOpen,
    Receipt,
    Calendar,
    DollarSign,
    RefreshCw,
    ExternalLink,
    FileText,
    AlertCircle
} from 'lucide-react';

interface Payment {
    id: string;
    orderId: string;
    course: string;
    courseId: string;
    amount: number;
    currency: string;
    method: string;
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    date: string;
    invoiceUrl?: string;
}

interface PaymentMethod {
    id: string;
    type: 'card' | 'upi' | 'netbanking';
    last4?: string;
    bank?: string;
    upiId?: string;
    isDefault: boolean;
}

const mockPayments: Payment[] = [
    {
        id: 'pay_1',
        orderId: 'ORD_20260125_001',
        course: 'Complete React Masterclass',
        courseId: '1',
        amount: 7499,
        currency: 'INR',
        method: 'UPI',
        status: 'completed',
        date: '2026-01-25',
        invoiceUrl: '#',
    },
    {
        id: 'pay_2',
        orderId: 'ORD_20260120_002',
        course: 'Node.js Backend Development',
        courseId: '2',
        amount: 9999,
        currency: 'INR',
        method: 'Credit Card',
        status: 'completed',
        date: '2026-01-20',
        invoiceUrl: '#',
    },
    {
        id: 'pay_3',
        orderId: 'ORD_20260115_003',
        course: 'JavaScript Essentials',
        courseId: '3',
        amount: 4999,
        currency: 'INR',
        method: 'Debit Card',
        status: 'completed',
        date: '2026-01-15',
        invoiceUrl: '#',
    },
    {
        id: 'pay_4',
        orderId: 'ORD_20260110_004',
        course: 'TypeScript Mastery',
        courseId: '4',
        amount: 6999,
        currency: 'INR',
        method: 'NetBanking',
        status: 'refunded',
        date: '2026-01-10',
    },
    {
        id: 'pay_5',
        orderId: 'ORD_20260105_005',
        course: 'Python for Data Science',
        courseId: '5',
        amount: 8999,
        currency: 'INR',
        method: 'UPI',
        status: 'failed',
        date: '2026-01-05',
    },
];

const mockPaymentMethods: PaymentMethod[] = [
    { id: '1', type: 'card', last4: '4242', isDefault: true },
    { id: '2', type: 'upi', upiId: 'user@paytm', isDefault: false },
];

export default function PaymentsPage() {
    const [payments] = useState<Payment[]>(mockPayments);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed' | 'refunded'>('all');

    const filteredPayments = payments.filter(p => {
        const matchesSearch = p.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.orderId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalSpent = payments
        .filter(p => p.status === 'completed')
        .reduce((acc, p) => acc + p.amount, 0);

    const getStatusColor = (status: Payment['status']) => {
        switch (status) {
            case 'completed': return 'bg-[var(--success-500)]/20 text-[var(--success-400)]';
            case 'pending': return 'bg-[var(--warning-500)]/20 text-[var(--warning-400)]';
            case 'failed': return 'bg-[var(--error-500)]/20 text-[var(--error-400)]';
            case 'refunded': return 'bg-[var(--text-tertiary)]/20 text-[var(--text-tertiary)]';
        }
    };

    const getStatusIcon = (status: Payment['status']) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'failed': return <XCircle className="w-4 h-4" />;
            case 'refunded': return <RefreshCw className="w-4 h-4" />;
        }
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Payments & Billing</h1>
                    <p className="text-[var(--text-secondary)]">
                        Manage your payments and download invoices
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--success-500)]/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-[var(--success-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">₹{totalSpent.toLocaleString()}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Total Spent</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--primary-500)]/20 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-[var(--primary-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{payments.filter(p => p.status === 'completed').length}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Courses Purchased</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--warning-500)]/20 flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-[var(--warning-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{payments.length}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Transactions</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-500)]/20 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-[var(--accent-400)]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{mockPaymentMethods.length}</p>
                            <p className="text-xs text-[var(--text-tertiary)]">Saved Methods</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Payment History */}
                <div className="lg:col-span-2">
                    <div className="glass-card overflow-hidden">
                        <div className="p-4 border-b border-[var(--border-subtle)]">
                            <h3 className="text-lg font-semibold text-white mb-4">Payment History</h3>
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                                    <input
                                        type="text"
                                        placeholder="Search by course or order ID..."
                                        className="input pl-10 py-2 text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        className="input appearance-none cursor-pointer pr-10 py-2 text-sm"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-[var(--border-subtle)]">
                            {filteredPayments.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Receipt className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-white mb-2">No payments found</h3>
                                    <p className="text-[var(--text-secondary)]">
                                        {searchQuery ? 'Try a different search term' : 'Your payment history will appear here'}
                                    </p>
                                </div>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <div key={payment.id} className="p-4 hover:bg-[var(--surface-glass)] transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[var(--primary-500)]/20 flex items-center justify-center flex-shrink-0">
                                                    <BookOpen className="w-5 h-5 text-[var(--primary-400)]" />
                                                </div>
                                                <div>
                                                    <Link href={`/student/courses/${payment.courseId}`} className="font-medium text-white hover:text-[var(--primary-400)]">
                                                        {payment.course}
                                                    </Link>
                                                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{payment.orderId}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-xs text-[var(--text-secondary)]">{payment.method}</span>
                                                        <span className="text-xs text-[var(--text-tertiary)]">
                                                            {new Date(payment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-white">₹{payment.amount.toLocaleString()}</p>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs mt-1 ${getStatusColor(payment.status)}`}>
                                                    {getStatusIcon(payment.status)}
                                                    {payment.status}
                                                </span>
                                                {payment.invoiceUrl && payment.status === 'completed' && (
                                                    <button className="flex items-center gap-1 text-xs text-[var(--primary-400)] hover:underline mt-2 ml-auto">
                                                        <Download className="w-3 h-3" />
                                                        Invoice
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Payment Methods */}
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-white">Payment Methods</h3>
                            <button className="text-sm text-[var(--primary-400)] hover:underline">+ Add</button>
                        </div>
                        <div className="space-y-3">
                            {mockPaymentMethods.map((method) => (
                                <div key={method.id} className="flex items-center gap-3 p-3 bg-[var(--surface-glass)] rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
                                        {method.type === 'card' ? (
                                            <CreditCard className="w-5 h-5 text-[var(--text-secondary)]" />
                                        ) : (
                                            <span className="text-lg">📱</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        {method.type === 'card' ? (
                                            <p className="text-sm text-white">•••• {method.last4}</p>
                                        ) : (
                                            <p className="text-sm text-white">{method.upiId}</p>
                                        )}
                                        <p className="text-xs text-[var(--text-tertiary)] capitalize">{method.type}</p>
                                    </div>
                                    {method.isDefault && (
                                        <span className="text-xs text-[var(--success-400)]">Default</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Billing Address */}
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-white">Billing Address</h3>
                            <button className="text-sm text-[var(--primary-400)] hover:underline">Edit</button>
                        </div>
                        <div className="text-sm text-[var(--text-secondary)] space-y-1">
                            <p className="text-white">Student Name</p>
                            <p>123 Learning Street</p>
                            <p>Mumbai, Maharashtra 400001</p>
                            <p>India</p>
                        </div>
                    </div>

                    {/* Need Help */}
                    <div className="glass-card p-6">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[var(--info-500)]/20 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-[var(--info-400)]" />
                            </div>
                            <div>
                                <h4 className="font-medium text-white mb-1">Need Help?</h4>
                                <p className="text-sm text-[var(--text-secondary)] mb-3">
                                    Having issues with a payment? Contact our support team.
                                </p>
                                <button className="text-sm text-[var(--primary-400)] hover:underline">
                                    Contact Support →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
