// db/connection.js
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is not set in .env');

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

let _db;

async function connectToDb() {
  if (_db) return _db;
  await client.connect();
  const dbName = process.env.DB_NAME || 'cse341-project1';
  _db = client.db(dbName);
  console.log(`MongoDB connected: ${dbName}`);
  return _db;
}

function getDb() {
  if (!_db) throw new Error('DB not initialized. Call connectToDb() first.');
  return _db;
}

module.exports = { connectToDb, getDb };
