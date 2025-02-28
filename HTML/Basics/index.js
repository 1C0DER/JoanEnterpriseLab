require('dotenv').config();  // This line loads the environment variables from the .env file
var express = require('express');
var path = require('path');
var app = express();

// MongoDB Client setup
const { MongoClient } = require("mongodb");
const uri = process.env.DBURI;  // Use environment variable for the MongoDB URI

// Create a new MongoClient using the URI from the environment variable
const client = new MongoClient(uri);

var options = {
    index: "myWebPage.html"
};

var dir = path.join(__dirname);
app.use(express.static(dir, options));

app.get('/api', function(req, res){
    res.send("Yes we have an API now")
});

app.get('/api/getPrice', function(req, res){
    var s = req.query.salary;
    var d = req.query.days;
    let dailyRate = s / 365;
    let price = Math.round(dailyRate * d);
    let roundToNearest = 50;
    let roundedPrice = Math.round((price + roundToNearest) / roundToNearest) * roundToNearest;
    res.send("" + roundedPrice);
});

app.get('/api/storeQuote', async function(req, res) {
    var quoteName = req.query.quoteName;
    var salary = req.query.salary;
    var days = req.query.days;
    var finalPrice = req.query.finalPrice;

    try {
        await client.connect();
        const database = client.db("mydb");
        const quotes = database.collection("quotes");

        const doc = {
            quoteName: quoteName,
            salary: parseInt(salary),
            days: parseInt(days),
            finalPrice: parseInt(finalPrice)
        };

        const result = await quotes.insertOne(doc);
        res.send(`Quote '${quoteName}' stored successfully with ID: ${result.insertedId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error storing the quote");
    } finally {
        await client.close();
    }
});

app.use(function(req, res, next) {
    res.status(404).send('This page does not exist!');
});

const PORT = process.env.PORT || 8000;  // Use the PORT environment variable with a default of 8000
app.listen(PORT, function () {
    console.log(`Listening on http://localhost:${PORT}/`);
});
