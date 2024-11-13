const express = require('express')
const app = express()
require('dotenv').config()
const errorHandler = require('./errorHandler')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

app.use(
    cors({  
        origin: ['https://api.example.com`'],
    }),
)

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 100 requests per `windowMs`
    handler: (req, res) => {
        res.status(429).json({ message: 'Rate limit exceeded, please try again later.' });
    },
});
app.use(limiter);

// Serve static files from the "public" folder
app.use(express.static('public'))
app.use(express.json())
require('./src/routes/indexRoutes')(app)
app.use(errorHandler)

// Define a simple root route handler
app.get('/', (req, res) => {
    res.send('Hello, World!')
})

module.exports = app;

// Start the server
const port = process.env.PORT || 3004
const host = process.env.HOST || 'localhost'

if (process.env.NODE_ENV !== 'test') {

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(port, host, () => {
    console.log(`Server is running on port ${port} and host ${host}`)
})

}
