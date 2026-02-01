# Pathshala Learning Platform

A modern online learning platform built with Next.js 16, featuring course management, live classes, AI-powered assistance, and integrated payment processing.

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── enrollment/    # Course enrollment
│   │   ├── live-classes/  # Live class management
│   │   ├── payments/      # Payment processing
│   │   └── search/        # Course search
│   ├── auth/              # Auth pages (login/signup)
│   ├── instructor/        # Instructor dashboard
│   └── student/           # Student dashboard
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries & configs
├── models/                # MongoDB/Mongoose schemas
└── types/                 # TypeScript definitions
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Frontend** | React 19, Tailwind CSS 4 |
| **Auth** | NextAuth.js, Supabase Auth |
| **Database** | MongoDB, Mongoose, Supabase |
| **AI** | Google Gemini AI, OpenAI |
| **Payments** | Razorpay, Stripe |
| **Icons** | Lucide React |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB instance
- Supabase project

### Installation

```bash
# Clone & install
git clone <repository-url>
cd pathshala
npm install

# Configure environment
cp env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ⚙️ Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your-secret

# Stripe (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 📁 Key Features

- **Course Management** - Create, edit, and manage courses
- **Live Classes** - Real-time class streaming for instructors
- **AI Assistant** - Powered by Google Gemini & OpenAI
- **Dual Payment Gateway** - Razorpay & Stripe integration
- **Role-based Access** - Instructor & Student dashboards
- **Course Search** - Full-text search functionality

## 📄 License

Private
