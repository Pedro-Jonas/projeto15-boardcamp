import express, { json } from 'express';
import cors from 'cors';

import CategoriesRouter from './Routes/Categories.Routes.js';
import GamesRouter from './Routes/Games.Routes.js';

const server = express();
server.use(json());
server.use(cors());

server.use(CategoriesRouter);
server.use(GamesRouter);

server.listen(4000, ()=> {
    console.log("Listenig on port 4000")
});