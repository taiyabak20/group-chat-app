const messageControllers = require('../controllers/messages')
const express = require('express');
const auth = require('../middlewares/authentication');
const router = express.Router()

router.post('/sendMessage/:groupId',auth , messageControllers.addMessage)
router.get('/getMessages/:groupId',auth , messageControllers.getMessages)

module.exports = router;