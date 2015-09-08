var express = require('express');
var bodyParser = require('body-parser');
var reg = require('./assets/js/register.js');
var merch = require('./assets/js/coffeeShop.js')

app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
  var output = "<html><head><title>Cash Register</title></head><body>";
  output += "<fieldset>" + reg.register.getFormatTotals() + "</fieldset>";
  output += "<p>"
  output += formatMenu();
  output += "<input type='submit' value='Submit'>"
  output += "<input type='submit' value='Reset' formaction='/reset'>"
  output += "</form></p><p><a href='https://github.com/drakemain/cash_register/tree/node-app'>" + 
    "Source</a></body></html>";

  res.send(output);
});

app.post('/form-handler', function(req, res) {
  var selection = JSON.parse(req.body.item);

  if (selection.size === "na") {
    selection.size = '';
  }

  console.log(selection)

  reg.register.scanItem(merch.items[selection.item], selection.size, 1);

  res.redirect('/');
});

app.post('/reset', function(req, res) {
  reg.register.subTotal = 0;
  reg.register.tax = 0;
  reg.register.total = 0;

  res.redirect('/');
});

var formatMenu = function() {
  var i = 1;
  var output = "<form action='/form-handler' method='post'>";

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

app.listen(3000);