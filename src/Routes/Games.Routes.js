import express from 'express';
import * as GamesController from '../Controllers/Games.Controller.js';

const router = express.Router();

router.get('/games', GamesController.getGames);
router.post('/games', GamesController.postGames);

export default router;