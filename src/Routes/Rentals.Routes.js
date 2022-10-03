import express from 'express';
import * as RentalsController from '../Controllers/Rentals.Controller.js';

const router = express.Router();

router.get('/rentals', RentalsController.getRentals);
router.post('/rentals', RentalsController.postRentals);

export default router;