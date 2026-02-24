import mongoose from 'mongoose';
// @ts-ignore
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars manually for script
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGO_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
}

async function testConnection() {
    console.log('Attempting to connect to MongoDB Atlas...');
    console.log(`URI: ${MONGODB_URI?.split('@')[1]}`); // Log only host for privacy

    try {
        await mongoose.connect(MONGODB_URI!);
        console.log('Connection Sucessful! Database is accessible.');

        // Optional: List collections
        const collections = await mongoose.connection.db?.listCollections().toArray();
        console.log('Collections:', collections?.map(c => c.name) || 'None');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error: any) {
        console.error('Connection Failed:', error.message);
        process.exit(1);
    }
}

testConnection();
