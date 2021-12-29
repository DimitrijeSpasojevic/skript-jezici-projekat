const express = require('express');
const { sequelize } = require('/skript jezici projekat/models');
const products = require('./routes/products');
const users = require('./routes/users');
const categories = require('./routes/categories');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const cors = require('cors');


const app = express();

var corsOptions = {
    origin: 'http://localhost:8000', // za app gui 8000
    optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));
app.use(authToken);
app.use('/admin', products);
app.use('/admin', users);
app.use('/admin', categories);

function getCookies(req) {
    if (req.headers.cookie == null) return {};

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookies = {};

    rawCookies.forEach( rawCookie => {
        const parsedCookie = rawCookie.split('=');
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });

    return parsedCookies;
};

function authToken(req, res, next) {
    const cookies = getCookies(req);
    const token = cookies['token'];
  
    if (token == null) return res.redirect(301, '/login');
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.redirect(301, '/login');
    
        req.user = user;
    
        next();
    });
}

app.post('/register', (req, res) => {

    const obj = {
        first_name: req.body.name,
        last_name: req.body.name,
        email: req.body.email,
        role : req.body.role,
        quantity_of_money: 0,
        password: bcrypt.hashSync(req.body.password, 10)
    };

    if(req.user.role){
        Users.create(obj).then( row => {

            res.json({row});

        }).catch( err => {res.status(500).json(err);
                         console.log(err)});
    }else{
        res.status(401).json(err);
    }
});


app.listen({ port: 8080 }, async () => {
    await sequelize.authenticate();
    console.log(`pokrenuta na portu 8080 rest servis`)
});