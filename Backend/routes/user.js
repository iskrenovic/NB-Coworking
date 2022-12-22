const express = require("express");
const router = express.Router();

const {GetUser} = require('../controllers/userController');


router.get('/:id',GetUser)

module.exports = router;