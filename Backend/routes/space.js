const express = require('express');
const router = express.Router();

const {CreateSpace,DeleteSpace,GetSpace,UpdateSpace,GetSpaceByOwnerId} = require('../controllers/spaceController');
const { route } = require('./user');

router.get('/getSpace/:ID', GetSpace);
router.post('/createSpace/', CreateSpace);
router.delete('/deleteSpace/:ID', DeleteSpace);
router.put('/updateSpace/:ID', UpdateSpace);
router.get('/getSpaceByOwnerId/:userID', GetSpaceByOwnerId)

module.exports = router;