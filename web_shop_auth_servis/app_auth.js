const express = require('express');
const { sequelize, Users } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();



var corsOptions = {
    origin: 'http://localhost:8000',
    optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));


app.post('/register', (req, res) => {

    const obj = {
        first_name: req.body.name,
        last_name: req.body.name,
        email: req.body.email,
        role : req.body.role,
        quantity_of_money: 0,
        password: bcrypt.hashSync(req.body.password, 10)
    };

    Users.create(obj).then( row => {
        
        const usr = {
            userId: row.id,
            role: row.role
        };
       
        const token = jwt.sign(usr, process.env.ACCESS_TOKEN_SECRET);
        
        res.json({ token: token });

    }).catch( err => {res.status(500).json(err) 
                     console.log(err)});
});

app.post('/login', (req, res) => {
    
    Users.findOne({ where: { email: req.body.email} })
        .then( row => {
            if (bcrypt.compareSync(req.body.password, row.password)) {
                const usr = {
                    userId: row.id,
                    role: row.role
                };
        
                const token = jwt.sign(usr, process.env.ACCESS_TOKEN_SECRET); 
                
                res.json({ token: token });
            } else {
                res.status(400).json({ msg: "Invalid credentials"});
            }
        })
        .catch( err => {    
            //res.status(500).json(err)
            res.status(400).json({ msg: "User ne postoji"});
        } );
});

app.listen({ port: 9000 }, async () => {
    await sequelize.authenticate();
    console.log(`Pokrenut na portu 9000 auth servis`)
});