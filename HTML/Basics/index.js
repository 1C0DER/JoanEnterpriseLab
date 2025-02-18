//https://stackoverflow.com/questions/5823722/how-to-serve-an-image-using-nodejs

var path = require('path');
var express = require('express');
var app = express();

var options = {
    index: "myWebPage.html"
};

var dir = path.join(__dirname);

app.get('/api', function(req, res){
    res.send("Yes we have an API now")
});

// e.g. test using:
//http://127.0.0.1:8000/api/getPrice?salary=2000&days=20
app.get('/api/getPrice', function(req, res){
    //res.send("Hello world!")
    // Copied from front end
    var s = req.query.salary;
    var d = req.query.days;
    console.log("Calculating price")
    console.log(s)
    console.log(d)
    let finalPrice = 0;
    dailyRate = s/365;
    price = Math.round(dailyRate * d);
    var roundToNearest = 50;
    roundedPrice = Math.round((price+roundToNearest)/roundToNearest) * roundToNearest // Always round up
    res.send(""+roundedPrice)
});

app.use(express.static(dir, options));

// 404 page
app.use(function ( req, res, next) {
    res.send('This page does not exist!')
});

app.listen(8000, function () {
    console.log('Listening on http://localhost:8000/');
});

// Add this new API endpoint alongside your other routes
app.get('/api/storeQuote', function(req, res) {
    // Retrieve the query parameters
    var quoteName = req.query.quoteName;
    var salary = req.query.salary;
    var days = req.query.days;
    var finalPrice = req.query.finalPrice;

    // Log the received details to the console
    console.log("Received quote store request:");
    console.log("Quote Name:", quoteName);
    console.log("Salary:", salary);
    console.log("Days:", days);
    console.log("Final Price:", finalPrice);

    // For now, simply return the quote name as a response
    res.send("Quote '" + quoteName + "' stored successfully.");
});
