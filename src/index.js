const express = require('express');
const pasth = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended: false}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    const data = {
        name: req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    const existingUser = await collection.findOne({name: data.name});
    if(existingUser) {
        res.send("Šis vardas jau užimtas, pasirinkite kitą vardą");
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;

        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }

});

app.post ("/login", async (req, res) => {
    try {
        const check = await collection.findOne({name: req.body.username});
        if(!check) {
            res.send("Vartotojas nerastas");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch) {
            res.render("home");
        } else {
            res.send("Neteisingas slaptažodis");
        }
    } catch {
        res.send("Neteisingi duomenys");
    }
});


const port = 5000;
app.listen(port, () => {
    console.log('Server running on Port: ${port}');
});