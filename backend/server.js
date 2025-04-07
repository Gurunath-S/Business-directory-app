const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// CORS configuration to allow access from your React Native app
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*', // Set specific domains in production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define User model
const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  sessionId: String,
  firstName: String,
  lastName: String,
  username: String,
  email: String,
  phoneNumber: String,
  imageUrl: {
    type: String,
    required: true,
  },
  hasImage: Boolean,
  lastSignInAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

// Define Category model
const categorySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true, // Ensure the ID is unique
  },
  name: {
    type: String,
    required: true,
  },
  icon: String,  // Field for category image/icon URLs
  description: String, // Optional description for the category
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model('Category', categorySchema);

const sliderSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  // Add other fields as necessary
});

const Slider = mongoose.model('Slider', sliderSchema);

// Define Business model
const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  website: String,
  about: String,
  category: String,
  username: String,
  userEmail: String,
  userImage: String,
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Business = mongoose.model('Business', businessSchema);


// User routes
const userRoutes = express.Router();

// Save user route
userRoutes.post('/saveUser', async (req, res) => {
  const { id, sessionId, firstName, lastName, username, email, imageUrl, hasImage, lastSignInAt, phoneNumber } = req.body;

  try {
    let user = await User.findOne({ id });

    if (user) {
      return res.status(200).json({ message: 'User ID already exists' });
    } else {
      user = new User({ id, sessionId, firstName, lastName, username, email, imageUrl, hasImage, lastSignInAt, phoneNumber });
      await user.save();
    }

    res.status(200).json({ message: 'User details saved successfully' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Category routes
const categoryRoutes = express.Router();

// Fetch all categories route
categoryRoutes.get('/Category', async (req, res) => {
  try {
    const categories = await Category.find();
    console.log('Categories fetched from MongoDB:', categories);
    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
}});

// Add a new category route
categoryRoutes.post('/Category', async (req, res) => {
  const { id, name, icon, description } = req.body;

  try {
    // Check if the category ID already exists
    let category = await Category.findOne({ id });

    if (category) {
      return res.status(400).json({ message: 'Category ID already exists' });
    }

    category = new Category({ id, name, icon, description });
    await category.save();

    res.status(201).json({ message: 'Category added successfully', category });
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Slider routes
const sliderRoutes = express.Router();

// Fetch all sliders route
sliderRoutes.get('/slider', async (req, res) => {
  try {
    const sliders = await Slider.find();
    res.status(200).json(sliders);
  } catch (err) {
    console.error('Error fetching sliders:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// Business routes
const businessRoutes = express.Router();

// Add a new business route
businessRoutes.post('/business', async (req, res) => {
  const { name, address, contact, website, about, category, username, userEmail, userImage, imageUrl } = req.body;

  try {
    const business = new Business({ name, address, contact, website, about, category, username, userEmail, userImage, imageUrl });
    await business.save();

    res.status(201).json({ message: 'Business added successfully', business });
  } catch (err) {
    console.error('Error adding business:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fetch all users or a specific user by ID
userRoutes.get('/users', async (req, res) => {
  const userId = req.query.id; // Optional query parameter for specific user

  try {
    let users;

    if (userId) {
      // Fetch a specific user by ID
      users = await User.findOne({ id: userId });

      if (!users) {
        return res.status(404).json({ message: 'User not found' });
      }
    } else {
      // Fetch all users
      users = await User.find();
    }

    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



// Use the business routes
app.use('/api', businessRoutes);


// Use the slider routes
app.use('/api', sliderRoutes);
// Use the user and category routes
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});







// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');

// dotenv.config();

// const app = express();

// // Middleware to parse JSON requests
// app.use(express.json());

// // CORS configuration to allow requests from all origins
// app.use(cors({
//   origin: '*', // For development, allow all origins. In production, specify the exact domain(s).
//   methods: ['GET', 'POST'], // Allowed HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
// }));

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected...'))
// .catch((err) => console.error('MongoDB connection error:', err));

// // Define User model
// const userSchema = new mongoose.Schema({
// id: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   sessionId: {
//     type: String,
//   },
//   firstName: {
//     type: String,
//   },
//   lastName: {
//     type: String,
//   },
//   fullName: {
//     type: String,
//     // required: true,
//   },
//   username: {
//     type: String,
//   },
//   email: {
//     type: String,
//     // required: true,
//   },
//   phoneNumber: {
//     type: String || null,
//     // required: true,
//   },
//   imageUrl: {
//     type: String,
//     required: true,
//   },
//   hasImage: {
//     type: Boolean,
//   },
//   lastSignInAt: {
//     type: Date,
//   },
//   createdAt: {
//     type: Date,
//   },
//   updatedAt: {
//     type: Date,
//   },
// });


// const User = mongoose.model('User', userSchema);

// // Define routes
// const userRoutes = express.Router();

// userRoutes.post('/saveUser', async (req, res) => {
//   console.log('Request body:', req.body); // Log incoming data

//   const { id, sessionId, firstName, lastName , username , email , imageUrl , hasImage , lastSignInAt , phoneNumber} = req.body;

//   try {
//     let user = await User.findOne({ id });

//     if (user) {
//       return res.status(200).json({ message: 'User ID already exists' });
//     } else {
//       user = new User({ id, sessionId, firstName, lastName , username , email , imageUrl , hasImage , lastSignInAt , phoneNumber });
//     }

//     await user.save();

//     res.status(200).json({ message: 'User details saved successfully' });
//   } catch (err) {
//     console.error('Server error:', err.stack); // More detailed error logging
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // Use the user routes
// app.use('/api', userRoutes);

// // Server setup
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
