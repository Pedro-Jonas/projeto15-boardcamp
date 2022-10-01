import connection from "../Database/connection.js";
import joi from 'joi';


const gamesSchema = joi.object({
    name: joi.string().required().min(1).trim(),
    image: joi.string().uri().required(),
    stockTotal: joi.number().integer().min(1),
    categoryId: joi.number().integer().min(1),
    pricePerDay: joi.number().integer().min(1),
});

async function getGames (req, res) {
    const search = req.query.name;
    try{
        const games = await connection.query('SELECT * FROM games');
        if (search){
            const searchGames = games.rows.filter(element => 
                element.name.slice(0, search.length) === search || element.name.slice(0, search.length) === search[0].toUpperCase() + search.substring(1)
            )
            res.send(searchGames).status(200);
            return;
        };
        res.send(games.rows).status(200);
    } catch {
        res.sendStatus(422);
    };
};

async function postGames (req, res) {
    const game = req.body;
    const validation = gamesSchema.validate(game);
    if (validation.error){
        const messageError = validation.error.message;
        res.send(messageError).status(400);
        return;
    };
    try {
        const categories = await connection.query('SELECT * FROM categories');
        const games = await connection.query('SELECT * FROM games;');
        const verifId = categories.rows.find(element => element.id === game.categoryId);
        const verifName = games.rows.find(element => element.name === game.name);
        if (!verifId || verifName ){
            res.sendStatus(400)
            return;
        };
        const insert = await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1,$2,$3,$4,$5);'
        ,[game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay]);
        res.sendStatus(201);
    } catch {
        res.sendStatus(422);
    };
};

export { getGames, postGames };