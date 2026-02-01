import Stripe from 'stripe'

// Server-side Stripe instance - only initialize if secret key is provided
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export const stripe = stripeSecretKey
    ? new Stripe(stripeSecretKey, {
        typescript: true,
    })
    : null

// Stripe publishable key for client-side
export const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
