const jwt = require('jsonwebtoken')
const errorHandler = require('../../errorHandler')
const User = require('../models/User')
const UserToken = require('../models/UserToken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const encryptDecrypt = require('../helpers/encryptDecrypt')
const { json } = require('body-parser')
const encKey = process.env.ENCRYPTION_KEY
const ivKey = process.env.IV_KEY
const secretKey = process.env.JWT_SECRET

const register = async (req, res, next) => {
    const { data } = req.body;  // Assuming 'data' is base64-encoded encrypted user info and 'iv' is hex
    try {
        const decryptedData = encryptDecrypt.decrypt(data);
        const jsonData = JSON.parse(decryptedData);

        const email = jsonData.email
        const name = jsonData.name
        const password = jsonData.password
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error('User already exist!!');
            error.statusCode = 409;
            return next(error);  // Pass the error to the error handler

        //   return res.status(400).json({ error: 'Email already exists' });
        }
      
        const hashedPassword = await bcrypt.hash(password, 10);
      
        const newUser = new User({ email: email, password: hashedPassword, name });
        await newUser.save();
      
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const login = async (req, res, next) => {
    const { data } = req.body;  // Assuming 'data' is base64-encoded encrypted user info and 'iv' is hex
    try {
        const decryptedData = encryptDecrypt.decrypt(data);
        const jsonData = JSON.parse(decryptedData);

        const email = jsonData.email
        const password = jsonData.password

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            const error = new Error('User not Found!!');
            error.statusCode = 404;
            return next(error);  // Pass the error to the error handler
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid credentials!');
            error.statusCode = 401;
            return next(error);
        }
        
        const accessToken = jwt.sign({ email: existingUser.email }, secretKey, { expiresIn: '45m' })

        const tokenData = {
            email: existingUser.email,
            token: accessToken,
        }
        let refreshTokenRecord = await UserToken.findOne({ email: existingUser.email }); // Replace `userId` with the actual field name used for storing user ID

        if (!refreshTokenRecord) {
            // If refresh token record doesn't exist, create it
            refreshTokenRecord = new UserToken({
                email: existingUser.email,
                token: accessToken,
            });
            await refreshTokenRecord.save();  // Save the new record
        } else {
            // update the token record if it's already created
            refreshTokenRecord.token = accessToken;
            await refreshTokenRecord.save();  // Save the updated record
        }

        const encryptedData = encryptDecrypt.encrypt(accessToken);

        return res.status(200).json(encryptedData)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const profile = async (req, res, next) => {
    const email = req.email
console.log(email)
    try {
        const existingUser = await User.findOne({ email }).select('name');

        if (!existingUser) {
            const error = new Error('User does not exist!!');
            error.statusCode = 404;
            return next(error);  // Pass the error to the error handler
        }
        console.log("existingUser",existingUser)

        const encryptedData = encryptDecrypt.encrypt(existingUser);
        const response={
            encryptedData,
            decryptedData : existingUser
        }
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const encryptData = async (req, res, next) => {
    let text=req.body
    const key = Buffer.from(encKey, 'hex'); // Convert key to Buffer
    const iv = Buffer.from(ivKey, 'hex'); // Convert IV to Buffer

    // Ensure the input is a string
    if (typeof text !== 'string') {
        text = JSON.stringify(text); // Serialize object to JSON string
    }

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv); // Create cipher
    let encrypted = cipher.update(text, 'utf8', 'base64'); // Encrypt
    encrypted += cipher.final('base64'); // Finalize encryption
    return res.status(200).json(encrypted)
};

module.exports = {
    register, login, profile, encryptData
}
