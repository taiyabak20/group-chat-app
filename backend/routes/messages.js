const messageControllers = require('../controllers/messages')
const express = require('express');
const auth = require('../middlewares/authentication');
const router = express.Router()

router.post('/sendMessage/:groupId',auth , messageControllers.addMessage)
router.post('/getMessages/:id',auth , messageControllers.getMessages)

module.exports = router;