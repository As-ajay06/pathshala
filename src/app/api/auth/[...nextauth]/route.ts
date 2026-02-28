import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import connectDB from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            image?: string;
            role: string;
        }
    }
}

export const authOptions: AuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: "student", // Default role
                    createdAt: new Date(),
                }
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                await connectDB();

                // Find user by email
                // We're using Mongoose model here directly for custom credentials logic
                // Note: The Adapter handles Google auth, but Credentials provider needs manual lookup
                const user = await User.findOne({ email: credentials.email }).select("+password");

                if (!user) {
                    throw new Error("User not found");
                }

                // Verify password (assuming we hash it)
                // For MVP we might not have hashing yet, but let's assume standard practice
                // const isValid = await bcrypt.compare(credentials.password, user.password);

                // Simple comparison for now if not using bcrypt yet or if using simple storage
                // TODO: Implement proper hashing during Signup
                const isValid = credentials.password === user.password || (user.password && await bcrypt.compare(credentials.password, user.password));

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                };
            }
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
