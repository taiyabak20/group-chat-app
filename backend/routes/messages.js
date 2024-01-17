const messageControllers = require('../controllers/messages')
const express = require('express');
const auth = require('../middlewares/authentication');
const router = express.Router()

router.post('/sendMessage',auth , messageControllers.addMessage)

module.exports = router;