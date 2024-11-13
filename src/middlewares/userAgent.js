const express = require('express')
const app = express()

const checkUserAgent = (req, res, next) => {
    const userAgent = req.get('User-Agent');
    if (userAgent && userAgent.includes('Dart')) {
        next(); // Proceed if user-agent is "Dart"
    } else {
        res.status(403).send('Forbidden: Not a valid Dart user-agent.');
    }
};

module.exports = checkUserAgent
