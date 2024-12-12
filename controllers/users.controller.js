const Joi = require('joi');
const userService = require('../services/users.service');

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email : Joi.string().email().required(),
    password: Joi.string().required()
});

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'walled_db',
    password: 'password',
    port: 5432,
})

const createUser = async (req, res) => {
    // console.log(req.body, "Request body");
    try{
        const {error, value} = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({error : error.details[0].message});
        }
        const user = await userService.createUser(value);
        res.status(201).json({ data : user});
    } catch (error){
        res.status(error.statusCode || 500).json({error : error.message});
    }
}

const getUsers = (req, res) => {
    pool.query('SELECT (id, name, email, imgurl, balance) FROM users', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        res.status(200).json({data : user});
    } catch (error) {
        res.status(error.statusCode || 500).json({error : error.message});
    }
}

const authenticate = (req, res) => {
    const { email, password } = req.body;
    pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rows.length === 0) {
            res.status(401).json({error : "Invalid email or password"});
            return;
        }
        res.status(200).json(results.rows[0]);
    })
}

    



module.exports = {createUser, getUsers, authenticate, getUserById};
