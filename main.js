var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var bigDec = require('bigdecimal');
var sqlite = require('sqlite3').verbose();
//"reg" is the register object. it calculates item values based on "merch" object
var reg = require('./assets/js/register.js');
//"merch" is the merchandise information. It can be swapped out with another file, and more
//items can be added to the file and will be displayed appropriately. (see views/register.handlebars)
var merch = require('./assets/js/coffeeShop.js');

app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//initialize a database file. currently a JSON object, but will b replaced with sqlite
var database; 

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

//renders index page, prompting a user to log in (views/index.handlebars)
app.get('/', function (req, res) {
  res.render('index', {
    title: "Login"
  });
});

//allows a logged in user to add items to their account. Keeps running 
//subtotal/tax/total (views/register.handlebars).
app.get('/register/:user', function (req, res) {
  var userID = req.params.user;

  //if :user doesn't exist (ie if typed manually into address bar and
  //misspelled), redirects to login page.
  if (!database[userID]) {
    res.redirect('/');
  } else {
  
    res.render('register', {
      title: "Cash Register",
      operator: database[req.params.user],
      menu: merch.items
    });
  }
});

//displays entire user database
app.get('/users', function(req, res) {
  res.send(database);
});

//displays database entry on specific user
app.get('/users/:user', function(req, res) {
  if (database[req.params.user]){
    res.send(database[req.params.user]);
  } else {
    res.send("No data exists for user " + req.params.user + ".");
  }
});

//creates a new entry in the user db
app.post('/users', function(req, res) {
  var userID = req.body.userID;

  if (!database[userID]) {
    database[userID] = {
      "user": userID,
      "subTotal": "0",
      "tax": "0",
      "total": "0"
    };

    writeDB();

    console.log("New user " + userID + " created.\n");
  } else {
    console.log("Returning user " + userID + " logged in.\n");
  }

  res.redirect('/register/' + userID);
});

//handles data sent from views/register.handlebars form. updates user db and
//interfaces with Assets/js/register.js to run calculations
app.post('/form-handler/:user', function(req, res) {
  if (req.body.item === undefined) {
    //if empty form is submitted, logs to console
    console.log(database[req.params.user].user + " submitted empty form.")

    res.redirect('/register/' + req.params.user);
  } else {
    var selection = JSON.parse(req.body.item);
    
    //if item is not priced by size, register.js expects an empty string
    if (selection.size === "na") {
      selection.size = '';
    }
  
    console.log(req.params.user + " Selection.item: " + selection.item);
  
    //passes selected item information to register.js scanItem method, which calculates tax 
    //and total based on item value, quantity, and size (if available). Returns object with BigDecimal values.
    var scannedItem = reg.register.scanItem(merch.items[selection.item], selection.size, "1");
    
    //gets the current totals from the user database (stored as strings) and converts them to
    //BigDecimal so that the new totals can be calculated.
    var currentSubTotal = new bigDec.BigDecimal(database[req.params.user].subTotal);
    var currentTax = new bigDec.BigDecimal(database[req.params.user].tax);
    var currentTotal = new bigDec.BigDecimal(database[req.params.user].total);
  
    //Adds the current totals to the selected item values
    var newSubTotal = currentSubTotal.add(scannedItem.subTotal);
    var newTax = currentTax.add(scannedItem.tax);
    var newTotal = currentTotal.add(scannedItem.total);
    
    //rounds to 2 decimal places
    newSubTotal = newSubTotal.setScale(2, bigDec.BigDecimal.ROUND_FLOOR);
    newTax = newTax.setScale(2, bigDec.BigDecimal.ROUND_FLOOR);
    newTotal = newTotal.setScale(2, bigDec.BigDecimal.ROUND_FLOOR);
  
    //stores the updated totals as strings
    database[req.params.user].subTotal = newSubTotal.toString();
    database[req.params.user].tax = newTax.toString();
    database[req.params.user].total = newTotal.toString();
  
    writeDB();
  
    res.redirect('/register/' + req.params.user);
  }
});

//resets a users running totals
app.post('/reset/:user', function(req, res) {
  var user = req.params.user;

  database[user].subTotal = "0";
  database[user].tax = "0";
  database[user].total = "0";

  writeDB();

  res.redirect('/register/' + req.params.user);
});

//fetches the database from disk, or creates a new database
//if none exists
var fetchDB = function() {
  console.log("Initializing database..");

  fs.exists('data/userDB.json', function(exists) {
    if (exists) {
      console.log("Existing database found. Fetching..");

      fs.readFile('data/userDB.json', function(err, data) {
        database = JSON.parse(data);

        console.log("Database fetched.\n");
      });
    } else {
      console.log("Database doesn't exist! Creating..");

      fs.writeFile('data/userDB.json', '{}', function(err) {
        console.log("Database file created. Fetching..");

        fs.readFile('data/userDB.json', function(err, data) {
          console.log(data);

          database = JSON.parse(data);

          console.log("Database fetched.\n");
        });
      });
    }
  });
}

//writes the database to disk
var writeDB = function() {
  var stringDatabase = JSON.stringify(database);

  fs.writeFile('data/userDB.json', stringDatabase, function(err) {
    console.log("Database updated\n");
  });
}

//runs fetchDB function on startup
fetchDB();

//listens on port 3000
app.listen(3000);