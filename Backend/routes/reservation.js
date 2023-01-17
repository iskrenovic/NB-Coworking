const express = require('express');
const router = express.Router();

const {CreateReservation,DeleteReservation,GetReservation,UpdateReservation} = require('../controllers/reservationController')

router.get('/getReservation/:ID', GetReservation);
router.post('/createReservation', CreateReservation);
router.delete('/deleteReservation/:ID', DeleteReservation);
router.put('/updateReservation/:ID', UpdateReservation);

module.exports = router;