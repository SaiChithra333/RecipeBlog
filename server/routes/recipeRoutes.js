const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

router.get('/',recipeController.homepage)

router.get('/categories',recipeController.exploreCategories)

router.get('/categories/:id',recipeController.exploreCategoriesById)

router.get('/recipe/:id',recipeController.exploreRecipe)

router.get('/explore-latest',recipeController.exploreLatest)

router.get('/explore-random',recipeController.exploreRandom)

router.post('/search',recipeController.searchRecipe)

router.get('/submit-recipe', recipeController.submitRecipe);

router.post('/submit-recipe', recipeController.submitRecipeOnPost);

router.get('/contact', recipeController.Contact);

router.get('/about', recipeController.About);
router.get('/submit-recipe/signup',recipeController.signup)

router.get('/recipe/:id/deleteOne',recipeController.deleterecipe)
router.post('/recipe/:id/deleteOnPost',recipeController.deleteOnPost)

// Add routes for edit and update
router.get('/recipe/:id/edit', recipeController.editRecipe);

router.post('/recipe/:id/update', recipeController.updateRecipe);

module.exports = router;