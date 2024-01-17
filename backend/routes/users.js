const express = require('express')
const router = express.Router()
const userController = require('../controllers/signup')
const auth = require('../middlewares/authentication')
router.post('/addUser', userController.createUser)
router.post('/loginUser', userController.loginUser)
router.get('/getAllUsers',auth, userController.getAll)
module.exports = router;