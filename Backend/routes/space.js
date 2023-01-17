const express = require('express');
const router = express.Router();

const {CreateSpace,DeleteSpace,GetSpace,UpdateSpace} = require('../controllers/spaceController')

router.get('/getSpace/:ID', GetSpace);
router.post('/createSpace', CreateSpace);
router.delete('/deleteSpace/:ID', DeleteSpace);
router.put('/updateSpace/:ID', UpdateSpace);

module.exports = router;