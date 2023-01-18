const express = require('express');
const router = express.Router();

const {CreateSpace,DeleteSpace,GetSpace,UpdateSpace,GetSpaceByOwnerId,
GetSpacesByCity} = require('../controllers/spaceController');
const { route } = require('./user');

router.get('/getSpace/:ID', GetSpace);
router.post('/createSpace/', CreateSpace);
router.delete('/deleteSpace/:ID', DeleteSpace);
router.put('/updateSpace/:ID', UpdateSpace);
router.get('/getSpaceByOwnerId/:ID', GetSpaceByOwnerId)
router.get('/getSpacesByCity/:city',GetSpacesByCity)

module.exports = router;