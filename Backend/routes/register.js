const express = require('express')
const router = express.Router()

const { CreateCustomer } = require('../controllers/customerController');
const { CreateDeliverer } = require('../controllers/delivererController');
const { CreateStore } = require('../controllers/storeController');



router.post('/customer',CreateCustomer)     
router.post('/deliverer',CreateDeliverer)
router.post('/store',CreateStore)

module.exports = router