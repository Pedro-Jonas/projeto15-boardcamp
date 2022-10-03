import express from 'express';
import * as CustomersController from '../Controllers/Customers.Controller.js';

const router = express.Router();

router.get('/customers', CustomersController.getCustomers);
router.get('/customers/:id', CustomersController.getCustomersId);
router.post('/customers', CustomersController.postCustomers);
router.put('/customers/:id', CustomersController.putCustomers);

export default router;