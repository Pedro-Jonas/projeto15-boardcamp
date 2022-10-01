import express, { json } from 'express';
import cors from 'cors';
import connection from './Database/connection.js';
import joi from 'joi';

const server = express();
server.use(json());
server.use(cors());

const categoriesSchema = joi.object({
    name: joi.string().required().min(1),
});

server.get('/categories', async (req, res)=>{
    try{
        const categories = await connection.query('select * from categories;');
        res.send(categories.rows).status(200);
    } catch {
        res.sendStatus(422);
    }
});

server.post('/categories', async (req, res)=>{
    const categorie = req.body;
    const validation = categoriesSchema.validate(categorie);

    if (validation.error){
        const messageError = validation.error.message;
        if (messageError === '"name" is not allowed to be empty'){
            res.status(400).send(messageError);
            return;
        }
        res.status(400).send(messageError);
        return;
    };
    
    try{
        const categories = await connection.query('select * from categories;');
        const verif = categories.rows.find(element => element.name === categorie.name);
        if (verif){
            res.sendStatus(409);
            return;
        };
        const insert = await connection.query(`INSERT INTO categories (name) VALUES ($1);`, 
        [categorie.name]);
        res.sendStatus(201);
    } catch {
        res.sendStatus(422);
    };
});


server.listen(4000, ()=> {
    console.log("Listenig on port 4000")
});