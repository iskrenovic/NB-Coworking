const express = require('express');
const router = express.Router();

const {
    CreateEquipment,
    DeleteEquipment,
    GetEquipment,
    UpdateEquipment,
    GetEquipmentBySpaceId,
    GetAllEquipment
} = require('../controllers/equipmentController');
const { route } = require('./space');

router.get('/getEquipment/:ID', GetEquipment);
router.post('/createEquipment', CreateEquipment);
router.delete('/deleteEquipment/:ID', DeleteEquipment);
router.put('/updateEquipment/:ID', UpdateEquipment);
router.get('/getEquipmentBySpaceId/:ID', GetEquipmentBySpaceId);
router.get('/allEquipment',GetAllEquipment);

module.exports = router;