const express = require("express");
const router = express.Router();

const {GetUser,DeleteUser,CreateUser,UpdateUser} = require('../controllers/userController');

router.get('/getUser/:ID', GetUser);
router.post('/createUser', CreateUser);
router.delete('/deleteUser/:ID', DeleteUser);
router.put('/updateUser/:ID', UpdateUser);

module.exports = router;