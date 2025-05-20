const connectDB = require('./db');

(async () => {
  const db = await connectDB();
  const users = await db.collection('users').find({}).toArray();
  console.log("Users:", users);
})();
