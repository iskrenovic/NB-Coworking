const express = require('express');
const router = express.Router();

const {CreatePlace,DeletePlace,GetPlace,UpdatePlace} = require('../controllers/placeController')

router.get('/getPlace/:ID', GetPlace);
router.post('/createPlace', CreatePlace);
router.delete('/deletePlace/:ID', DeletePlace);
router.put('/updatePlace/:ID', UpdatePlace);

module.exports = router;