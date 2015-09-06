var express = require('express');
//var bodyParser = require('body-parser');
var reg = require('./assets/js/register.js');
var merch = require('./assets/js/coffeeShop.js')

app = express();

//app.use(express.bodyParser());

app.get('/', function (req, res) {
  var output = "<html><head><title>Cash Register</title><head><body>";
  
  output += "<fieldset>" + reg.register.getFormatTotals() + "</fieldset>";

  output += "<p>"

  output += formatMenu();

  output += "<input type='submit' value='Submit'>"

  output += "</form></p></body></html>";
  res.send(output);
});
/*
app.post('/form-handler', function(req, res) {
  res.send(req.body.name);
})
*/
var formatMenu = function() {
  var i = 1;
  var output = "<form action='form-handler' method='post'>";

  for(var item in merch.items) {
    if (merch.items[item].sizes) {
      output += "<br>" + merch.items[item].name + ":<br>";
      for (size in merch.items[item].sizes) {
        
        output += "<input type='radio' name='item' value='{item: "
          + item + ", size: " + size + "}'>";
        output += size + ": $" + merch.items[item].sizes[size].toFixed(2) + "<br>";
      }
    } else {
      output += "<br><input type='radio' name='item' value='{item: " 
        + item + ", size: na}'>" + merch.items[item].name + ": $"
        + merch.items[item].amt.toFixed(2) + "<br>";
    }
  }
  return output;
}

app.listen(3000);