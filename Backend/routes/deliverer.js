const express = require("express");
const router = express.Router();

const {  GetDelivererByID, ChangeVehicle }= require('../controllers/delivererController');

router.get('/get/:id',GetDelivererByID);
router.put('/vehicle/change/:id',ChangeVehicle);

module.exports = router;