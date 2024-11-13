// permissionRoutes.js
const authRouter = require('express').Router()
const authController = require('../controllers/authController')
const authenticate = require('../middlewares/authentication')

authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)
authRouter.get('/profile',authenticate, authController.profile)
authRouter.post('/encrypt', authController.encryptData)

module.exports = authRouter
