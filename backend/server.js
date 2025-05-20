const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb'); // Import ObjectId
const connectDB = require('./db');

const app = express();
app.use(cors({ origin: 'http://localhost:8080' })); // Allow requests from the frontend
app.use(bodyParser.json());

let db;

// Connect to MongoDB
(async () => {
  db = await connectDB();
})();


// Save user data into the database
app.post('/api/save-user', async (req, res) => {
  try {
    const { session_id, full_name, login_name, role, email } = req.body;

    if (!session_id || !full_name || !login_name || !role || !email) {
      return res.status(400).json({ message: 'Invalid user data' });
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ login_name });

    if (existingUser) {
      // Update user details
      await db.collection('users').updateOne(
        { login_name },
        { $set: { session_id, full_name, role,email } }
      );
      return res.status(200).json({ message: 'User updated successfully' });
    }

    // Insert new user
    await db.collection('users').insertOne({
      session_id,
      full_name,
      login_name,
      role,
      email,
      created_at: new Date(),
    });

    res.status(201).json({ message: 'User saved successfully' });
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


////////////////////////// resources /////////////////////////
// Fetch all resources for a specific user role
app.get('/api/resources', async (req, res) => {
  try {
    const { sharedBy, role } = req.query;

    // Default query to fetch all resources
    const query = {};

    // Filter by "sharedBy" if provided
    if (sharedBy) {
      query.sharedBy = sharedBy;
    }

    // Apply visibility rules based on the role
    if (role === 'Student') {
      query.visibleToStudents = true; // Only visible to students
    } else if (role === 'Lecturer') {
      query.visibleToLecturers = true; // Only visible to lecturers
    }

    const resources = await db.collection('resources').find(query).toArray();
    res.status(200).json(resources);
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Add a new resource
app.post('/api/resources', async (req, res) => {
  try {
    const {
      category,
      refName,
      sessionSemester,
      description,
      link,
      sharedBy,
      visibleToStudents = true, // Default to true
      visibleToLecturers = true, // Default to true
    } = req.body;

    if (!category || !refName || !sessionSemester || !description || !link || !sharedBy) {
      return res.status(400).json({ message: 'Invalid resource data' });
    }

    const resource = {
      category,
      refName,
      sessionSemester,
      description,
      link,
      sharedBy,
      visibleToStudents,
      visibleToLecturers, // Ensure visibility for lecturers is added
      created_at: new Date(),
    };

    await db.collection('resources').insertOne(resource);
    res.status(201).json({ message: 'Resource added successfully' });
  } catch (err) {
    console.error('Error adding resource:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Update an existing resource
app.put('/api/resources/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { category, refName, sessionSemester, description, link, visibleToStudents, visibleToLecturers } = req.body;

    const updatedResource = {
      ...(category && { category }),
      ...(refName && { refName }),
      ...(sessionSemester && { sessionSemester }),
      ...(description && { description }),
      ...(link && { link }),
      ...(visibleToStudents !== undefined && { visibleToStudents }),
      ...(visibleToLecturers !== undefined && { visibleToLecturers }), // Update visibility for lecturers
    };

    const result = await db.collection('resources').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedResource }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.status(200).json({ message: 'Resource updated successfully' });
  } catch (err) {
    console.error('Error updating resource:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Delete a resource
app.delete('/api/resources/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.collection('resources').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (err) {
    console.error('Error deleting resource:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

///////////////////// Category///////////////////

app.get("/api/resources/by-category", async (req, res) => {
  try {
    const data = await db
      .collection("resources")
      .aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $project: { category: "$_id", count: 1, _id: 0 } },
      ])
      .toArray();

    console.log("Aggregated Data:", data); // Debugging
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching resources by category:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch all categories

app.get('/api/categories', async (req, res) => {
  try {
    const { role } = req.query; // Extract role from query parameters

    // Build the query dynamically based on the role
    const query = {};
    if (role === 'Student') {
      query.visibleToStudents = true; // Fetch categories visible to students
    } else if (role === 'Lecturer') {
      query.visibleToLecturers = true; // Fetch categories visible to lecturers
    }

    // Fetch categories based on the query
    const categories = await db.collection('categories').find(query).toArray();
    console.log('Categories fetched:', categories); // Debugging log
    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Add a new category
app.post('/api/categories', async (req, res) => {
  try {
    const {
      name,
      visibleToStudents = true, // Default to true
      visibleToLecturers = true, // Default to true
    } = req.body;

    console.log('Request body:', req.body); // Debugging log

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const newCategory = {
      name,
      visibleToStudents,
      visibleToLecturers, // Include lecturer visibility
      created_at: new Date(),
    };

    console.log('New category to be inserted:', newCategory); // Debugging log

    const result = await db.collection('categories').insertOne(newCategory);

    console.log('Inserted document:', result.ops[0]); // Debugging log

    res.status(201).json(result.ops[0]);
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// Edit a category
app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, visibleToStudents, visibleToLecturers } = req.body;

    const updatedCategory = {
      ...(name && { name }),
      ...(visibleToStudents !== undefined && { visibleToStudents }),
      ...(visibleToLecturers !== undefined && { visibleToLecturers }),
    };

    const result = await db.collection('categories').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedCategory }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(updatedCategory);
  } catch (err) {
    console.error('Error editing category:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Delete a category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.collection('categories').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//////// sent resourcs /////////////////////
// Save a sent resource
app.post('/api/send-resource', async (req, res) => {
  try {
    const {
      email,
      category,
      refName,
      sessionSemester,
      description,
      link,
      sharedBy,
    } = req.body;

    // Validate required fields
    if (!email || !category || !refName || !sessionSemester || !description || !link || !sharedBy) {
      return res.status(400).json({ message: 'Invalid resource data' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Insert the resource into sent_resources collection
    await db.collection('sent_resources').insertOne({
      email,
      category,
      refName,
      sessionSemester,
      description,
      link,
      sharedBy,
      sent_at: new Date(),
    });

    res.status(201).json({ message: 'Resource sent successfully' });
  } catch (err) {
    console.error('Error sending resource:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch resources sent to a specific student
// Fetch resources sent to a specific student or shared by a user
app.get('/api/sent-resources', async (req, res) => {
  try {
    const { sharedBy, email } = req.query;
    console.log('Email received:', email);
    if (!sharedBy && !email) {
      return res.status(400).json({ message: 'Either sharedBy or email is required' });
    }

    const query = sharedBy ? { sharedBy } : { email };
    const sentResources = await db.collection('sent_resources').find(query).toArray();

    res.status(200).json(sentResources);
  } catch (err) {
    console.error('Error fetching sent resources:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



///delete 
app.delete('/api/sent-resources/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('sent_resources').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (err) {
    console.error('Error deleting resource:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});







// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
