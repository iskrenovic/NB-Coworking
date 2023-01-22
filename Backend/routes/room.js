const express = require('express');
const router = express.Router();

const {
    CreateRoom,
    DeleteRoom,
    GetRoom,
    UpdateRoom,
    GetRoomsBySpaceId,
} = require('../controllers/roomController');
const { route } = require('./space');

router.get('/getRoom/:ID', GetRoom);
router.post('/createRoom', CreateRoom);
router.delete('/deleteRoom/:ID', DeleteRoom);
router.put('/updateRoom/:ID', UpdateRoom);
router.get('/getRoomsBySpaceId/:ID', GetRoomsBySpaceId);

module.exports = router;