import express, { json } from 'express';
import cors from 'cors';
import connection from './Database/connection.js';

const server = express();
server.use(json());
server.use(cors());

server.get('/categories', async(req, res)=>{
    try{
        const query = await connection.query('select * from categories;');
        res.send(query.rows).status(200);
    } catch {
        res.sendStatus(422);
    }
});

server.listen(4000, ()=> {
    console.log("Listenig on port 4000")
});