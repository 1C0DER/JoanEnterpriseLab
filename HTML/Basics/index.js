var express = require('express');
var path = require('path');
var app = express();

// MongoDB Client setup
const { MongoClient } = require("mongodb");
const uri = process.env.DBURI || "mongodb://test:password@127.0.0.1:27017/mydb";  // Use environment variable or default
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Persist connection across requests
let dbConnection;

async function connectToMongo() {
    if (!dbConnection) {
        try {
            await client.connect();
            dbConnection = client.db("mydb");  // Database name
            console.log("Connected to database");
        } catch (err) {
            console.error("Could not connect to DB: ", err);
        }
    }
    return dbConnection;
}

var dir = path.join(__dirname);
var options = {
    index: "myWebPage.html"
};

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
    let roundedPrice = Math.round((price + roundToNearest) / roundToNearest) * roundToNearest;  // Always round up
    res.send("" + roundedPrice);
});

app.get('/api/storeQuote', async function(req, res) {
    var quoteName = req.query.quoteName;
    var salary = parseInt(req.query.salary);
    var days = parseInt(req.query.days);
    var finalPrice = parseInt(req.query.finalPrice);

    try {
        const db = await connectToMongo();
        const quotes = db.collection("quotes");

        const doc = {
            quoteName: quoteName,
            salary: salary,
            days: days,
            finalPrice: finalPrice
        };

        const result = await quotes.insertOne(doc);
        res.send(`Quote '${quoteName}' stored successfully with ID: ${result.insertedId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error storing the quote");
    }
});

app.use(function(req, res, next) {
    res.status(404).send('This page does not exist!');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, function () {
    console.log(`Listening on http://localhost:${PORT}/`);
});