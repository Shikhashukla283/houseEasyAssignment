const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const app = express()
app.use(express.json())
const secretKey = process.env.JWT_SECRET
const encryptDecrypt = require('../helpers/encryptDecrypt')

const authenticate = (req, res, next) => {
    // Get the token from the request headers, query parameters, or cookies
    const tokendata = req.headers.authorization
    if (!tokendata) {
        return res.status(401).json({
            error: {
                message: 'Unauthorized',
            },
        })
    }
    const token = tokendata.split(' ')[1]
    try {

        const decryptedData = encryptDecrypt.decrypt(token);
        // Verify and decode the token
        const decoded = jwt.verify(decryptedData, secretKey)
        // Attach the decoded user ID to the request object for further use
        req.email = decoded.email
        // Continue to the next middleware or route handler
       next()
    } catch (error) {
        console.log('error in auth middleware', error)
        return res.status(401).json({
            error: {
                message: 'Invalid token',
            },
        })
    }
}

module.exports = authenticate
