const express = require("express");
const router = express.Router()

const {
    CreateCategory,
    DeleteCategory,
    GetAllCategories} = require('../controllers/categoryController');


router.post('/add',CreateCategory); 
router.delete('/delete',DeleteCategory);
router.get('/all', GetAllCategories)

module.exports = router;