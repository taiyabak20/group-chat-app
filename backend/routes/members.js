const membersControllers = require('../controllers/members')
const express = require('express');
const auth = require('../middlewares/authentication');
const router = express.Router()

router.post('/makeAdmin', membersControllers.makeAdmin)

module.exports = router;