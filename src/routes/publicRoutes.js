// permissionRoutes.js
const publicRouter = require('express').Router()
const publicController = require('../controllers/publicController')
const userAgent = require('../middlewares/userAgent')

publicRouter.get('/', userAgent,publicController.public)

module.exports = publicRouter
