const express = require('express');
const router = express.Router();

const {
    CreatePlace,
    DeletePlace,
    GetPlace,
    UpdatePlace,
    GetPlacesByRoomId,
} = require('../controllers/placeController');
const { route } = require('./room');

router.get('/getPlace/:ID', GetPlace);
router.post('/createPlace', CreatePlace);
router.delete('/deletePlace/:ID', DeletePlace);
router.put('/updatePlace/:ID', UpdatePlace);
router.get('/getPlacesByRoomId/:ID', GetPlacesByRoomId);

module.exports = router;