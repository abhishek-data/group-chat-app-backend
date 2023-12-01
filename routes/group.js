const express = require('express')
const {authenticate} = require('../middleware/auth')
const groupController = require('../controllers/groupController')

const router = express.Router()

router.post('/create-group', authenticate, groupController.createGroup)

router.delete('/delete-group/:groupId', authenticate, groupController.deleteGroup)

router.get('/get-groups', authenticate, groupController.getGroups)

router.get('/get-users/:groupId', authenticate, groupController.getUsers)

router.post('/add-user/:groupId', authenticate, groupController.addUserToGroup)

router.post('/make-admin', authenticate, groupController.makeAdmin)

router.post('/remove-user/:groupId', authenticate, groupController.removeUserFromGroup)


module.exports = router