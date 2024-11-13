const jwt = require('jsonwebtoken')
const errorHandler = require('../../errorHandler')
const User = require('../models/User')
const UserToken = require('../models/UserToken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const encryptDecrypt = require('../helpers/encryptDecrypt')
const { json } = require('body-parser')
const mongoose = require('mongoose');
const encKey = process.env.ENCRYPTION_KEY
const ivKey = process.env.IV_KEY
const secretKey = process.env.JWT_SECRET

const detail = async (req, res, next) => {
    const id = req.params.id
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ObjectId');
          }
          const existingUser = await User.findById(id).select('name');
        if (!existingUser) {
            const error = new Error('User does not exist!!');
            error.statusCode = 404;
            return next(error);  // Pass the error to the error handler
        }
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
module.exports = {
    detail
}
