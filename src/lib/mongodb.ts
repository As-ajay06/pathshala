// This approach is taken from https://authjs.dev/getting-started/adapters/mongodb
import { MongoClient } from "mongodb"

const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Lazy initialization - only connects when the promise is actually awaited
if (process.env.NEXT_PUBLIC_MONGO_URL) {
    if (process.env.NODE_ENV === "development") {
        // In development mode, use a global variable so that the value
        // is preserved across module reloads caused by HMR (Hot Module Replacement).
        let globalWithMongo = global as typeof globalThis & {
            _mongoClientPromise?: Promise<MongoClient>
        }

        if (!globalWithMongo._mongoClientPromise) {
            client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_URL, options)
            globalWithMongo._mongoClientPromise = client.connect()
        }
        clientPromise = globalWithMongo._mongoClientPromise
    } else {
        // In production mode, it's best to not use a global variable.
        client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_URL, options)
        clientPromise = client.connect()
    }
} else {
    // Return a promise that rejects only when awaited - allows module to import during build
    clientPromise = new Promise((_, reject) => {
        reject(new Error('Invalid/Missing environment variable: "MONGODB_URI"'))
    })
    // Prevent unhandled promise rejection during build
    clientPromise.catch(() => { })
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
