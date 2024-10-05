const express = require('express');
const mongoose = require('mongoose');

const app = express();

const port = process.envPORT || 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the e-commerce platform API' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});