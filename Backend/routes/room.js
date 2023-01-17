const express = require('express');
const router = express.Router();

const {CreateRoom,DeleteRoom,GetRoom,UpdateRoom} = require('../controllers/roomController')

router.get('/getRoom/:ID', GetRoom);
router.post('/createRoom', CreateRoom);
router.delete('/deleteRoom/:ID', DeleteRoom);
router.put('/updateRoom/:ID', UpdateRoom);

module.exports = router;