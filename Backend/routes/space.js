const express = require('express');
const router = express.Router();

const {CreateSpace,DeleteSpace,GetSpace,UpdateSpace} = require('../controllers/spaceController')

router.get('/getSpace/:id', GetSpace);
router.post('/createSpace', CreateSpace);
router.delete('/deleteSpace/:id', DeleteSpace);
router.put('/updateSpace/:id', UpdateSpace);

module.exports = router;