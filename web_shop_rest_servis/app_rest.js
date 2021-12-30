const express = require('express');
const { sequelize, Users} = require('/skript jezici projekat/models');
const products = require('./routes/products');
const users = require('./routes/users');
const categories = require('./routes/categories');
const orders = require('./routes/orders');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const cors = require('cors');


const app = express();

var corsOptions = {
    origin: "http://localhost:8000", // za app gui 8000
    optionsSuccessStatus: 200
}


app.use(cors(corsOptions));
app.use(express.json());



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
  
    if (token == null) return res.redirect(301, 'http://localhost:8000/login');
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.redirect(301, 'http://localhost:8000/login');
    
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


     Users.create(obj).then( row => {
         res.json(row);
     }).catch( err => {res.status(500).json(err);
                      console.log(err)});

});

//app.use(authToken);

app.use('/admin', products);
app.use('/admin', users);
app.use('/admin', categories);
app.use('/admin', orders);

app.listen({ port: 8080 }, async () => {
    await sequelize.authenticate();
    console.log(`pokrenuta na portu 8080 rest servis`)
});