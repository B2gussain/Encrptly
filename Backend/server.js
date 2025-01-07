
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
require("dotenv").config(); // Load environment variables
const app = express();
const passwordRoutes = require('./routes/password'); // Add this
// app.use('/api/password', passwordRoutes); // Add this



// Middleware
app.use(express.json());
// app.use(cors());


const corsOptions = {
  origin: 'http://localhost:5173/', // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

app.use(cors(corsOptions));
// Routes
app.use("/api/auth", authRoutes);
app.use('/api/password', passwordRoutes); // Add this


// Check environment variables
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in .env file");
  process.exit(1);
}

if (!process.env.Port) {
  console.error("PORT is not defined in .env file");
  process.exit(1);
}

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.Port, () => console.log(`Server running on http://localhost:${process.env.Port}`));
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
