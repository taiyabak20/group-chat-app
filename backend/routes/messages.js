const messageControllers = require('../controllers/messages')
const express = require('express');
const auth = require('../middlewares/authentication');
const router = express.Router()

router.post('/sendMessage',auth , messageControllers.addMessage)
router.get('/getMessages',auth , messageControllers.getMessages)

module.exports = router;