const express = require('express');
const router = express.Router();

const { CreateOwner,CreateBusiness,CreateFreelancer } = require('../controllers/registerController');

router.post('/createOwner',CreateOwner);     
router.post('/createBusiness',CreateBusiness);
router.post('/createFreelancer',CreateFreelancer);

module.exports = router;