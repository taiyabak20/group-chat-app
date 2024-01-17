const express = require('express')
const router = express.Router()
const userController = require('../controllers/signup')

router.post('/addUser', userController.createUser)

module.exports = router;