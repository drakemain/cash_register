var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var reg = require('./assets/js/register.js');
var merch = require('./assets/js/coffeeShop.js');

app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var database;

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', function (req, res) {
  res.render('index', {
    title: "Login"
  });
});

app.get('/register/:user', function (req, res) {
  var userID = req.params.user;

  if (!database[userID]) {
    res.redirect('/');
  }

  res.render('register', {
    title: "Cash Register",
    operator: database[req.params.user],
    menu: merch.items
  });
});

app.get('/showUserData/:user', function(req, res) {
  if (database[req.params.user]){
    res.send(database[req.params.user]);
  } else {
    res.send("No data exists for user " + req.params.user + ".");
  }
});

app.get('/showDB', function(req, res) {
  res.send(database);
});

app.post('/login', function(req, res) {
  var userID = req.body.userID;
  //var redirect = "/showUserData/" + userID;

  if (!database[userID]) {
    database[userID] = {
      "user": userID,
      "subTotal": 0,
      "tax": 0,
      "total": 0
    };

    writeDB();

    console.log("New user " + userID + " created.\n");
  } else {
    console.log("Returning user " + userID + " logged in.\n");
  }

  res.redirect('/register/' + userID);
});

app.post('/form-handler/:user', function(req, res) {
  
  var selection = JSON.parse(req.body.item);

  if (selection.size === "na") {
    selection.size = '';
  }

  console.log("Selection.item: " + selection.item);

  var scannedItem = reg.register.scanItem(merch.items[selection.item], selection.size, 1);

  console.log(scannedItem);

  database[req.params.user].subTotal += scannedItem.subTotal;
  database[req.params.user].tax += scannedItem.tax;
  database[req.params.user].total += scannedItem.total;

  writeDB();

  res.redirect('/register/' + req.params.user);
});

app.post('/reset/:user', function(req, res) {
  database[req.params.user].subTotal = 0;
  database[req.params.user].tax = 0;
  database[req.params.user].total = 0;

  res.redirect('/register/' + req.params.user);
});

var fetchDB = function() {
  console.log("Initializing database.");

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

var writeDB = function() {
  var stringDatabase = JSON.stringify(database);

  fs.writeFile('data/userDB.json', stringDatabase, function(err) {
    console.log("Database updated\n");
  });
}

fetchDB();

app.listen(3000);