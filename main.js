var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var reg = require('./assets/js/register.js');
var merch = require('./assets/js/coffeeShop.js');

app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

/*app.get('/hbtest', function(req, res) {
  res.render('hbtest', {
    title: "test"
  });

  console.log('test');
});*/

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
  var operator = database[userID];

  if (!operator) {
    res.redirect('/');
  }

  console.log(merch.items.coffee);

  res.render('register', {
    title: "Cash Register",
    operator: database[req.params.user],
    menu: merch.items
  });
  /*res.render('register', (function () {
    return {
      title: "Cash Register",
      operator: operator,
    };
  })());*/


  /*
  var output = "<html><head><title>Cash Register</title></head><body>";
  output += "<h2>Operator: " + operator.user + "</h2>";
  output += "<fieldset>" + formatTotals(userID) + "</fieldset>";
  output += "<p>"
  output += formatMenu(userID);
  output += "<input type='submit' value='Submit'>";
  output += "<input type='submit' value='Reset' formaction='/reset/" + userID +"'>";
  output += "<a href='/'>Logout</a>";
  output += "</form></p><p><a href='https://github.com/drakemain/cash_register/tree/node-app'>" + 
    "Source</a></body></html>";

  res.send(output);*/
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

    console.log("New user " + userID + " created.");
  } else {
    console.log("Returning user " + userID + " logged in.");
  }

  res.redirect('/register/' + userID);
  //res.send("Data submitted<br><a href='/'>Back</a>");
});

app.post('/form-handler/:user', function(req, res) {
  
  var selection = JSON.parse(req.body.item);

  if (selection.size === "na") {
    selection.size = '';
  }

  console.log(selection)

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

var generateMenu = function(userID) {
  var i = 1;
  var output;

  for(var item in merch.items) {
    if (merch.items[item].sizes) {
      output += "<br>" + merch.items[item].name + ":<br>";

      for (size in merch.items[item].sizes) {
        output += "<input type='radio' name='item' value='{\"item\": \""
          + item + "\", \"size\": \"" + size + "\"}'>";
        output += size + ": $" + merch.items[item].sizes[size].toFixed(2) + "<br>";
      }
    } else {
      output += "<br><input type='radio' name='item' value='{\"item\": \"" 
        + item + "\", \"size\": \"na\"}'>" + merch.items[item].name + ": $"
        + merch.items[item].amt.toFixed(2) + "<br>";
    }
  }
  return output;
}

var formatTotals = function(userID) {
  formattedTotals = "Subtotal: " + database[userID].subTotal.toFixed(2) + "<br>";
  formattedTotals += "Tax: " + database[userID].tax.toFixed(2) + " @ " + (reg.register.taxRate*100)  + "%<br>";
  formattedTotals += "Total: " + database[userID].total.toFixed(2);

  console.log("Subtotal: " + database[userID].subTotal.toFixed(2));
  console.log("Tax: " + database[userID].tax.toFixed(2) + " @ " + (reg.register.taxRate*100)  + "%");
  console.log("Total: " + database[userID].total.toFixed(2));

  return formattedTotals;
}

var fetchDB = function() {
  console.log("Initializing database.");

  fs.exists('data/userDB.json', function(exists) {
    if (exists) {
      console.log("Existing database found. Fetching..");

      fs.readFile('data/userDB.json', function(err, data) {
        database = JSON.parse(data);

        console.log("Database fetched.\n");

        console.log(database);
      });
    } else {
      console.log("Database doesn't exist! Creating..");

      fs.writeFile('data/userDB.json', '{}', function(err) {
        console.log("Database file created. Fetching..");

        fs.readFile('data/userDB.json', function(err, data) {
          console.log(data);

          database = JSON.parse(data);

          console.log("Database fetched.\n");

          console.log(database);
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