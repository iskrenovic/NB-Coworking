const express = require('express');
const router = express.Router();

const {CreateEquipment,DeleteEquipment,GetEquipment,UpdateEquipment} = require('../controllers/equipmentController')

router.get('/getEquipment/:ID', GetEquipment);
router.post('/createEquipment', CreateEquipment);
router.delete('/deleteEquipment/:ID', DeleteEquipment);
router.put('/updateEquipment/:ID', UpdateEquipment);

module.exports = router;