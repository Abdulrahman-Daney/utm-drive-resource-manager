const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://abood053111:Daney2025@cluster0.v6vcc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    return client.db("ResourceSharingDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
