const Joi = require('joi');
const userService = require('../services/users.service');
const {UserResponse} = require('../dto/userResponse')

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email : Joi.string().email().required(),
    password: Joi.string().required()
});

const loginSchema = Joi.object({
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
            return res.status(400).json({error : error.message});
        }
        const user = await userService.createUser(value);
        res.status(201).json({ data : new UserResponse(user)});
    } catch (error){
        res.status(error.statusCode || 500).json({error : 'chuaks'});
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
    // console.log(req.user, "relr");
    try {
        const { id } = req.user;
        const user = await userService.getUserById(Number(id));
        res.status(200).json({data : new UserResponse(user)});
    } catch (error) {
        if(error.message === "user not found"){
            return res.status(404).json({error : error.message});
        }
        res.status(error.statusCode || 500).json({error : error.message});
    }
}

const login = async (req, res) => {
    try{
        const {error, value} = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({error : error.message});
        }
        const token = await userService.login(value);
        res.status(200).json({ data : {token : token}});
    } catch (error){
        if(error.message === "404"){
            return res.status(404).json({error : "user doesnt exist"});
        }
        if(error.message === "401"){
            return res.status(401).json({error : "email or password not valid"})
        }
            
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

    



module.exports = {createUser, getUsers, authenticate, login,  getUserById};
