const express = require('express');
const router = express.Router();

const {CreateReservationAsBusiness,CreateReservationAsFreelancer,DeleteReservation,GetReservation,
    AcceptReservation,DenyReservation,GetAcceptedReservationByOwnerId,
    GetPendingReservationByOwnerId} = require('../controllers/reservationController');
const { route } = require('./user');


router.get('/getReservation/:ID', GetReservation);
router.post('/createReservationAsBusiness', CreateReservationAsBusiness);
router.post('/createReservationAsFreelancer',CreateReservationAsFreelancer);
router.delete('/deleteReservation/:ID', DeleteReservation);
router.put('/acceptReservation/:ID', AcceptReservation);
router.put('/denyReservation/:ID', DenyReservation);
router.get('/getAcceptedReservationByOwnerId/:ID', GetAcceptedReservationByOwnerId);
router.get('/getPendingReservationByOwnerId/:ID',GetPendingReservationByOwnerId);

module.exports = router;