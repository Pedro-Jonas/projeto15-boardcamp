import connection from "../Database/connection.js";
import joi from 'joi';

const categoriesSchema = joi.object({
    name: joi.string().required().min(1).trim(),
});

async function getCategories (req, res) {
    try{
        const categories = await connection.query('SELECT * FROM categories;');
        res.send(categories.rows).status(200);
    } catch {
        res.sendStatus(422);
    }
};

async function postCategories (req, res) {
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
        const categories = await connection.query('SELECT * FROM categories;');
        const verif = categories.rows.find(element => element.name === categorie.name);
        if (verif){
            res.sendStatus(409)
            return;
        };
        const insert = await connection.query(`INSERT INTO categories (name) VALUES ($1);`, 
        [categorie.name]);
        res.sendStatus(201);
    } catch {
        res.sendStatus(422);
    };
};

export { getCategories, postCategories };