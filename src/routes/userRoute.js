// permissionRoutes.js
const userRouter = require('express').Router()
const userController = require('../controllers/userController')
const authenticate = require('../middlewares/authentication')
const userAgent = require('../middlewares/userAgent')

userRouter.get('/:id',authenticate,userAgent, userController.detail)

module.exports = userRouter
