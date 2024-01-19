const express = require('express');
const router = express.Router()
const groupControllers = require('../controllers/group')
const auth = require('../middlewares/authentication');

router.post('/',auth, groupControllers.createGroup)
router.get('/getAllGroups', auth, groupControllers.getGroups)
router.get('/getAll', auth, groupControllers.getAllGroups)
module.exports = router;