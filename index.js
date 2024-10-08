const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/products');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/products', productRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the e-commerce platform API' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});