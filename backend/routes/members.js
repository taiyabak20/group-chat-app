const membersControllers = require('../controllers/members')
const express = require('express');
const auth = require('../middlewares/authentication');
const router = express.Router()

router.post('/makeAdmin', membersControllers.makeAdmin)
router.post('/removeMember', membersControllers.removeMember)
router.post('/joinGrp',auth, membersControllers.joinGrp)
router.get('/notMembers/:groupId',auth, membersControllers.notMembers)
router.post('/addToGroup/:groupId',auth, membersControllers.addToGroup)

module.exports = router;