const express = require('express')
const userController = require('../controller/userController')
const authentication = require('../middlewares/authentication')
const router = express.Router()
router.post('/signup',userController.signup)
router.post('/signin',userController.login)
router.get('/get-leave-data',authentication,userController.getLeaveData)
router.post('/submitleave',authentication,userController.submitLeaveData)
router.get('/restricted-dates',authentication,userController.fetchRestrictedDates)

module.exports = router