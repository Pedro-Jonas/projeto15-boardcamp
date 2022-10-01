import express from "express";
import * as CategoriesController from '../Controllers/Categories.Controller.js';

const router = express.Router();

router.get('/categories', CategoriesController.getCategories);
router.post('/categories', CategoriesController.postCategories);

export default router;