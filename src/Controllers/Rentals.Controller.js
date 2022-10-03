import connection from "../Database/connection.js";
import joi from "joi";
import dayjs from 'dayjs';

const rentalsSchema = joi.object({
    customerId: joi.number().integer().min(1),
    gameId: joi.number().integer().min(1),
    daysRented: joi.number().integer().min(1),
});

async function getRentals (req, res) {
    const searchCustomer = req.query.customerId;
    const searchGame = req.query.gameId;
    try{
        const rentals = await connection.query('SELECT * FROM rentals ;');
        const customers = await connection.query('SELECT id , name FROM customers ;');
        const games = await connection.query('SELECT games.id, games.name, games."categoryId" , categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;');
        if (searchCustomer){
            const rentalsCustomer = rentals.rows.filter(element => 
                element.customerId == searchCustomer
            );
            const response = rentalsCustomer.map(function (element){
                const customer = customers.rows.filter(e => 
                    e.id == element.customerId
                );
                const game = games.rows.filter(e => 
                    e.id == element.gameId
                );
                return {...element, custumer: customer[0], game: game[0],};
            });
            res.send(response).status(200);
            return;
        };
        if (searchGame){
            const rentalsGame = rentals.rows.filter(element => 
                element.gameId == searchGame
            );
            const response = rentalsGame.map(function (element){
                const customer = customers.rows.filter(e => 
                    e.id == element.customerId
                );
                const game = games.rows.filter(e => 
                    e.id == element.gameId
                );
                return {...element, custumer: customer[0], game: game[0],};
            });
            res.send(response).status(200);
            return;
        };
        const rentalsComplete = rentals.rows.map(function (element){
            const customer = customers.rows.filter(e => 
                e.id == element.customerId
            );
            const game = games.rows.filter(e => 
                e.id == element.gameId
            );
            return {...element, custumer: customer[0], game: game[0],};
        });
        res.send(rentalsComplete).status(200);
    } catch {
        res.sendStatus(422);
    };
};

async function postRentals (req, res) {
    const rental = req.body;
    const validation = rentalsSchema.validate(rental);
    if (validation.error){
        const messageError = validation.error.message;
        res.status(400).send(messageError);
        return;
    };
    try{
        const customers = await connection.query('SELECT * FROM customers;');
        const games = await connection.query('SELECT * FROM games;');
        const rentals = await connection.query('SELECT * FROM rentals WHERE "gameId" = $1 ;',[rental.gameId]);
        const verifCustomerId = await customers.rows.find(element => element.id === rental.customerId);
        const verifGameId = games.rows.find(element => element.id === rental.gameId);
        const rentalsReserved = rentals.rows.find(element => element.returnDate === null);
        let qtdReserved = 0;
        if (!verifCustomerId || !verifGameId){
            res.sendStatus(400)
            return;
        };
        if (rentalsReserved){
            qtdReserved = rentalsReserved.length;
        };
        if (qtdReserved >= verifGameId.stockTotal) {
            res.sendStatus(400)
            return;
        };
        const rentDate = dayjs().format("YYYY/MM/DD");
        const originalPrice = rental.daysRented * verifGameId.pricePerDay;
        const returnDate = null;
        const delayFee = null;
        const insert = await connection.query('INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") VALUES ($1,$2,$3,$4,$5,$6,$7);',
        [rental.customerId, rental.gameId, rental.daysRented, rentDate, originalPrice, returnDate, delayFee]);
        res.sendStatus(201);
    } catch {
        res.sendStatus(422);
    }
};

async function postRentalsReturn (req, res){
    const id = req.params.id;
    const returnDate = dayjs(Date()).$d;

    try {
        const rentals = await connection.query('SELECT rentals.* , games."pricePerDay" FROM rentals JOIN games ON rentals."gameId" = games.id;');
        const rentalsId = rentals.rows.find(element => 
            element.id == id);
        if (!rentalsId){
            res.sendStatus(404);
            return;
        };
        if (rentalsId.returnDate !== null){
            res.sendStatus(400);
            return;
        };
        const diference = returnDate - rentalsId.rentDate;
        const days = Math.floor(diference/(1000*3600*24));
        let delayFee = null;
        if (days > rentalsId.daysRented){
            delayFee = (days - rentalsId.daysRented)*rentalsId.pricePerDay;
        };
        const update = await connection.query('UPDATE rentals SET "returnDate"=$1, "delayFee"=$2  WHERE id = $3 ;',
        [dayjs().format("YYYY/MM/DD"), delayFee, id]);
        res.sendStatus(200);
    } catch {
        res.sendStatus(422);
    };
};

async function deletRentals (req, res){
    const id = req.params.id;
    try{
        const rentals = await connection.query('SELECT * FROM rentals ;');
        const rentalsId = rentals.rows.find(element => 
            element.id == id);
        if (!rentalsId){
            res.sendStatus(404);
            return;
        };
        if (rentalsId.returnDate === null){
            res.sendStatus(400);
            return;
        };
        const deletRental = await connection.query('DELETE FROM rentals WHERE id = $1', [id]);
        res.sendStatus(200);
    } catch {
        res.sendStatus(422);
    };
};

export { postRentals, getRentals, postRentalsReturn, deletRentals };