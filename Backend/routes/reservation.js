const express = require('express');
const router = express.Router();

const {CreateReservationAsBusiness,CreateReservationAsFreelancer,DeleteReservation,GetReservation,UpdateReservation} = require('../controllers/reservationController')

router.get('/getReservation/:ID', GetReservation);
router.post('/createReservationAsBusiness', CreateReservationAsBusiness);
router.post('/createReservationAsFreelancer',CreateReservationAsFreelancer);
router.delete('/deleteReservation/:ID', DeleteReservation);
router.put('/updateReservation/:ID', UpdateReservation);

module.exports = router;