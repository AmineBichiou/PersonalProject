// Import required packages
import 'server-only';
import { Db, MongoClient, ObjectId } from 'mongodb';
import { z } from 'zod';

// Connection URL for MongoDB
const connectionString = process.env.MONGODB_URL || "mongodb+srv://amine:Amine*20319318@amine.qukftes.mongodb.net/?retryWrites=true&w=majority&appName=Amine";

// Create a MongoDB client
const client = new MongoClient(connectionString);

// Connect to the MongoDB database
let database: Db;

async function connectDB() {
  if (!database) {
    await client.connect();
    database = client.db('taxi'); // Replace 'taxi' with your database name
    console.log('Connected to MongoDB');
  }
  return database;
}


// Define your Transfer model based on the existing MongoDB transfers structure
export type Transfer = {
  _id: ObjectId; // MongoDB ObjectId
  client: {
    _id: ObjectId; // MongoDB ObjectId for the client
    name: string;
    email: string;
    phone: string | number;
  };
  from: string;
  to: string;
  dateTime: Date;
  isCompleted: boolean;
  status: boolean;
  options: string;
};

// Function to get transfers with optional search
export async function getTransfers(
  search: string,
  offset: number
): Promise<{
  transfers: Transfer[];
  newOffset: number | null;
  totalTransfers: number;
}> {
  const db = await connectDB();
  const collection = db.collection<Transfer>('transfers');

  const query: any = {}; // Initialize an empty query object

  // Search logic
  if (search) {
    query.from = { $regex: search, $options: 'i' }; // Adjust based on search needs
  }

  const totalTransfers = await collection.countDocuments(query);
  const transfers = await collection
    .find(query)
    .skip(offset)
    .limit(5)
    .toArray();

  const newOffset = transfers.length >= 5 ? offset + 5 : null;

  return {
    transfers,
    newOffset,
    totalTransfers,
  };
}

// Function to delete a transfer by ID
export async function deleteTransferById(id: string) {
  const db = await connectDB();
  const collection = db.collection<Transfer>('transfers');

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    throw new Error(`Transfer with id ${id} not found`);
  }
}

// Optional: Create an insert schema if needed
export const insertTransferSchema = z.object({
  client: z.object({
    _id: z.string(), // Assuming the client ID is a string representation of ObjectId
    name: z.string(),
    email: z.string().email(), // Validate email format
    phone: z.union([z.string(), z.number()]), // Allow either string or number
  }),
  from: z.string(),
  to: z.string(),
  dateTime: z.date(),
  isCompleted: z.boolean(),
  status: z.boolean(),
  options: z.string(), // Adjust if options is more complex
});
