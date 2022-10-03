import express from 'express';
import * as RentalsController from '../Controllers/Rentals.Controller.js';

const router = express.Router();

router.get('/rentals', RentalsController.getRentals);
router.post('/rentals', RentalsController.postRentals);
router.post('/rentals/:id/return', RentalsController.postRentalsReturn);
router.delete('/rentals/:id', RentalsController.deletRentals);

export default router;