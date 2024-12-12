const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Joi = require('joi');
const port = 8080;
const cors = require('cors');
app.use(cors());


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const schema = Joi.object({
    a : Joi.string()
});

const registerSchema = Joi.object({
    name: Joi.string(),
    email : Joi.string().email().required(),
    password: Joi.string()
});

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'walled_db',
    password: 'password',
    port: 5432,
})

const routeHandler = (req, res) => {
    const {error, value} = schema.validate(req.body);
    if (error) {
        res.status(400).json({error : error.message});
        return;
    }
    res.status(200).json({data : transactions});
}

const imgExample = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';
const createUser = (req, res) => {
    // console.log(req.body, "Request body");
    const {error, value} = registerSchema.validate(req.body);
    if (error) {
        res.status(400).json({error : error.details[0].message});
        return;
    }
    const {  name, email, password } = value;
    // console.log(error.message, value, "Error and value");
    pool.query("INSERT INTO users (email, password, name, imgurl, balance) VALUES ($1, $2, $3, $4, $5) RETURNING *", [email, password, name, imgExample, 0],
        (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).json(results.rows[0])
    }
    )
}

const getUsers = (req, res) => {
    pool.query('SELECT (id, name, email, imgurl, balance) FROM users', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
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

const getTransactions = (req, res) => {
    pool.query('SELECT * FROM transactions', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

app.post('/login', authenticate);
app.get('/users', getUsers);
app.post('/users', createUser);
app.get('/transactions', getTransactions);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);