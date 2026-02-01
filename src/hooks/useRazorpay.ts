'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UseRazorpayOptions {
    onSuccess?: (paymentId: string, orderId: string) => void;
    onError?: (error: string) => void;
}

interface PaymentData {
    courseId: string;
    courseName: string;
    amount: number;
    currency?: string;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export function useRazorpay(options: UseRazorpayOptions = {}) {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadRazorpayScript = useCallback((): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }, []);

    const initiatePayment = useCallback(async (paymentData: PaymentData) => {
        if (!session?.user) {
            router.push('/auth/signin?callbackUrl=' + window.location.href);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error('Failed to load Razorpay SDK');
            }

            // Create order on server
            const orderResponse = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: paymentData.courseId,
                    userId: (session.user as any).id,
                    amount: paymentData.amount,
                    currency: paymentData.currency || 'INR',
                    courseName: paymentData.courseName,
                }),
            });

            const orderData = await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(orderData.message || 'Failed to create order');
            }

            // Initialize Razorpay checkout
            const razorpayOptions = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'LearnFlow',
                description: `Purchase: ${paymentData.courseName}`,
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    try {
                        // Verify payment on server
                        const verifyResponse = await fetch('/api/payments/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyData.verified) {
                            options.onSuccess?.(response.razorpay_payment_id, response.razorpay_order_id);
                            // Redirect to success page or enrolled course
                            router.push(`/student/courses?enrolled=true&course=${paymentData.courseId}`);
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (err: any) {
                        setError(err.message);
                        options.onError?.(err.message);
                    }
                },
                prefill: {
                    name: session.user.name || '',
                    email: session.user.email || '',
                },
                theme: {
                    color: '#6366F1',
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(razorpayOptions);
            razorpay.open();
        } catch (err: any) {
            setError(err.message);
            options.onError?.(err.message);
        } finally {
            setLoading(false);
        }
    }, [session, router, loadRazorpayScript, options]);

    return {
        initiatePayment,
        loading,
        error,
    };
}
