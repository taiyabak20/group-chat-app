const messageControllers = require('../controllers/messages')
const express = require('express');
const auth = require('../middlewares/authentication');
const router = express.Router()
const upload = require('../utils/multer')

router.post('/sendMessage/:groupId',auth , messageControllers.addMessage)
router.get('/getMessages/:groupId',auth , messageControllers.getMessages)
router.get('/oldChats/:groupId',auth , messageControllers.oldChats)
router.post('/uploadFile/:groupId',auth ,upload.single('file'), messageControllers.uploadFile)

module.exports = router;