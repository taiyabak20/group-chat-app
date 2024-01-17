const express = require('express')
const router = express.Router()
const userController = require('../controllers/signup')

router.post('/addUser', userController.createUser)
router.post('/loginUser', userController.loginUser)
module.exports = router;