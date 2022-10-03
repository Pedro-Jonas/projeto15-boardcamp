import connection from "../Database/connection.js";
import joi from 'joi';


const customersSchema = joi.object({
    name: joi.string().required().min(1).trim(),
    phone: joi.string().required().min(10).max(11).trim(),
    cpf: joi.string().required().min(11).max(11).trim(),
    birthday: joi.date().iso().required(),
});


async function getCustomers (req, res) {
    const search = req.query.cpf;
    try{
        const customers = await connection.query('SELECT * FROM customers');
        if (search){
            const searchCustomers = customers.rows.filter(element => 
                element.cpf.slice(0, search.length) === search 
            );
            res.send(searchCustomers).status(200);
            return;
        };
        res.send(customers.rows).status(200);
    } catch {
        res.sendStatus(422);
    };
};

async function getCustomersId (req, res) {
    const id = req.params.id;
    try {
        const customers = await connection.query('SELECT * FROM customers');
        const customerId = customers.rows.filter(element => 
            element.id == id 
        )
        if (customerId) {
            res.send(customerId).status(200);
            return;
        } else {
            res.sendStatus(404);
            return;
        };
    } catch {
        res.sendStatus(422);
    }
};

async function postCustomers (req, res) {
    const customer = req.body;
    const validation = customersSchema.validate(customer);
    if (validation.error){
        const messageError = validation.error.message;
        res.status(400).send(messageError);
        return;
    };

    try {
        const customers = await connection.query('SELECT * FROM customers;');
        const verifCpf = customers.rows.find(element => 
            element.cpf === customer.cpf);
        if (verifCpf) {
            res.sendStatus(409);
            return;
        };
        const insert = await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4);'
        ,[customer.name, customer.phone, customer.cpf, customer.birthday]);
        res.sendStatus(201);
    } catch {
        res.sendStatus(422);
    };
};

async function putCustomers (req, res) {
    const customer = req.body;
    const id = req.params.id;
    const validation = customersSchema.validate(customer);
    if (validation.error){
        const messageError = validation.error.message;
        res.status(400).send(messageError);
        return;
    };
    try {
        const customers = await connection.query('SELECT * FROM customers');
        const verifCpf = customers.rows.find(element => 
            element.cpf === customer.cpf);
        if (verifCpf) {
            res.sendStatus(409);
            return;
        };
        console.log(customer)
        const update = await connection.query('UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5 ;',
        [customer.name, customer.phone, customer.cpf, customer.birthday, id]);
        res.sendStatus(200);
    } catch {
        res.sendStatus(422);
    };
};

export { getCustomers, getCustomersId, postCustomers, putCustomers };