var express = require('express');
var path = require('path');
var app = express();

// MongoDB Client setup
const { MongoClient } = require("mongodb");
const uri = "mongodb://test:password@127.0.0.1:27017/mydb";  // Assuming no username or password for simplicity

// Create a new MongoClient
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
    console.log("Calculating price");
    console.log(s);
    console.log(d);
    let finalPrice = 0;
    let dailyRate = s / 365;
    let price = Math.round(dailyRate * d);
    let roundToNearest = 50;
    let roundedPrice = Math.round((price + roundToNearest) / roundToNearest) * roundToNearest;  // Always round up
    res.send("" + roundedPrice);
});

// Updated /api/storeQuote endpoint to store data in MongoDB
app.get('/api/storeQuote', async function(req, res) {
    var quoteName = req.query.quoteName;
    var salary = req.query.salary;
    var days = req.query.days;
    var finalPrice = req.query.finalPrice;

    console.log("Received quote store request:");
    console.log("Quote Name:", quoteName);
    console.log("Salary:", salary);
    console.log("Days:", days);
    console.log("Final Price:", finalPrice);

    try {
        await client.connect();
        console.log("Connected to database");
        const database = client.db("mydb");  // Database name
        const quotes = database.collection("quotes");  // Collection name

        // Create a document to insert
        const doc = {
            quoteName: quoteName,
            salary: parseInt(salary),
            days: parseInt(days),
            finalPrice: parseInt(finalPrice)
        };

        const result = await quotes.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        res.send(`Quote '${quoteName}' stored successfully with ID: ${result.insertedId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error storing the quote");
    } finally {
        await client.close();
    }
});

app.use(express.static(dir, options));

app.use(function(req, res, next) {
    res.status(404).send('This page does not exist!');
});

app.listen(8000, function () {
    console.log('Listening on http://localhost:8000/');
});
