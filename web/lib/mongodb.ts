import { MongoClient, Db } from 'mongodb';

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://mongoadmin:mongopassword@localhost:27017/raw_clickstream?authSource=admin';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getMongoDb(): Promise<Db> {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db('raw_clickstream');
  }
  return db!;
}
