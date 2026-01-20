const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://koiwilliam91_db_user:fj5ADJME3w1Qvtng@cluster0.jl4ntmm.mongodb.net/directory-app?retryWrites=true&w=majority";

async function testConnection() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!");

    const database = client.db('directory-app');
    const collections = await database.listCollections().toArray();

    console.log("\n📚 Available collections:");
    collections.forEach(col => console.log(`  - ${col.name}`));

    // Test insert
    const users = database.collection('users');
    const testUser = {
      email: 'test@example.com',
      password: '$2a$10$hashedpassword',
      name: 'Test User',
      role: 'user',
      language: 'en-US',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await users.insertOne(testUser);
    console.log(`\n✅ Test user created with ID: ${result.insertedId}`);

    // Clean up test user
    await users.deleteOne({ _id: result.insertedId });
    console.log("🗑️  Test user deleted");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.close();
  }
}

testConnection();
