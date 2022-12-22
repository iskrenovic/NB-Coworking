const express = require("express");

const router = express.Router()

const {
    CreateMeal,
    GetMealsByRestaurant,
    AddToCategory,
    GetMealById,
    GetCategory,
    DeleteMeal,
    Top5Meals
} = require('../controllers/mealController');

router.get('/top5',Top5Meals);
router.post('/create',CreateMeal); 
router.get('/get/restaurant/:id',GetMealsByRestaurant)
router.post('/addToCategory',AddToCategory)
router.get('/get/:id',GetMealById)
router.get('/getCategories/:id',GetCategory)
router.delete('/delete/:id',DeleteMeal)
module.exports = router;