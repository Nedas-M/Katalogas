const express = require('express');

const app = express();

const port = process.envPORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the e-commerce platform API' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});