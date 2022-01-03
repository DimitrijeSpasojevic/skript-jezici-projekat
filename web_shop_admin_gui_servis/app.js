const express = require('express');
const { sequelize } = require('../models');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors(corsOptions));


var corsOptions = {
    origin: "*", 
    optionsSuccessStatus: 200
}

app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './static' });
});

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
  
    if (token == null) return res.send({msg : "token je null kaze app_gui"});
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err)  return res.send({msg : "token nije dobar ali nije null, kaze app_gui"});
    
        req.user = user;
    
        next();
    });
}

/*app.get('/register', (req, res) => {
    res.sendFile('register.html', { root: './static' });
});



app.get('/category',authToken, (req, res) => {
    res.sendFile('category.html', { root: './static' });
});

app.get('/order',authToken, (req, res) => {
    res.sendFile('order.html', { root: './static' });
});

app.get('/product',authToken, (req, res) => {
    res.sendFile('product.html', { root: './static' });
});

app.get('/user',authToken, (req, res) => {
    res.sendFile('user.html', { root: './static' });
});
*/
app.use(express.static(path.join(__dirname, 'static')));

app.listen({ port: 8000 }, async () => {
    await sequelize.authenticate();
    console.log("pokrenuta na portu 8000 gui servis")
});