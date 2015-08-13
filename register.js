var readlineSync = require("readline-sync");
var merch = require("./coffeeShop");

var main = function() {
  var scanningItems = true;

  clearConsole();
  
  while (scanningItems) {
  scanningItems = scanPrompt();
  }
};

var printItemMenu = function() {
  var i = 1;

  for (var item in merch.items) {
    console.log(i + ": " + merch.items[item].name + ":");
    
    if (merch.items[item].sizes) {
      for (var size in merch.items[item].sizes) {
        console.log("  " + size + ": $" + merch.items[item].sizes[size].toFixed(2));
      }
    } else {
      console.log("  $" + merch.items[item].amt.toFixed(2));
    }
    console.log('');
    i++;
  }
};

var printSizes = function(sizesArray) {
  for (i = 0; i < getObjectSize(sizesArray); i++) {
    console.log((i + 1) + ": " + sizesArray[i]);
  }
};

var taskPrompt = function() {
  var selection;
  var tasks = [];
  tasks[0] = "Scan an item";

  for (i = 0; i < getObjectSize(tasks); i++) {
    console.log((i + 1) + ". " + tasks[1]);
  }

  selection = getUserSelection("Select task: ");

  selection = parseInput(1, 1, null, selection);

};

var scanPrompt = function() {
  var subMenu = "item";
  var escapeChar = 'x';
  var handlerReturn;
  var selection;
  var selectedItem;
  var selectedSize = '';
  var selectedQuantity;

  while (subMenu != "break"){
    switch (subMenu) {

      case "item":
        handlerReturn = itemHandler(escapeChar);

        selectedItem = handlerReturn.item;
        subMenu = handlerReturn.sub;
        break;

      case "size":
        handlerReturn = sizeHandler(selectedItem, escapeChar);

        selectedSize = handlerReturn.size;
        subMenu = handlerReturn.sub;
        break;

      case "quantity":
        handlerReturn = quantityHandler(selectedSize, escapeChar);

        selectedQuantity = handlerReturn.qty;
        subMenu = handlerReturn.sub;
        break;

    }//switch
  }//loop

  if (selectedItem != escapeChar) {
    register.scanItem(merch.items[selectedItem], selectedSize, selectedQuantity);
    return true;
  } else {
    return false;
  }
};

var itemHandler = function(escapeChar) {
  var selection;
  var subMenu = "item";

  clearConsole();
  printItemMenu();

  selection = getUserSelection("\nSelect an item: (x to cancel)");

  selection = parseInput(1, getObjectSize(merch.index), escapeChar, selection);

  if (selection !== false) {
    if (selection === escapeChar) {
      return {item: selection, sub: "break"};
    } else {
      selection = merch.index[selection];
    }

    if (merch.items[selection].sizes) {
      subMenu = "size";
    } else {
      subMenu = "quantity";
    }
  }
  return {item: selection, sub: subMenu};
};

var sizeHandler = function(item, escapeChar) {
  var selection;
  var subMenu = "size";
  var sizes = getItemSizes(merch.items[item]);

  clearConsole();
  console.log("Selected: " + merch.items[item].name + '\n');        
  printSizes(sizes);

  selection = getUserSelection("\nSelect size: (x to cancel)");

  selection = parseInput(1, getObjectSize(sizes), escapeChar, selection);

  if (selection !== false) {
    if (selection == escapeChar) {
      subMenu = "item";
      return {size: selection, sub: subMenu};
    } else {
      selection = sizes[selection - 1];
      subMenu = "quantity";
    }
  }

  return {size: selection, sub: subMenu};
};

var quantityHandler = function(selectedSize, escapeChar) {
  selection = getUserSelection("\nQuantity: (x to cancel)")

  selection = parseInput(0, 99, escapeChar, selection);

  if (selection !== false) {
    if (selection === escapeChar) {
      if (selectedSize === '') {
        subMenu = "item";
        return {qty: selection, sub: subMenu};
      } else {
        subMenu = "size";
        return {qtry: selection, sub: subMenu};
      }
    }

    subMenu = "break";
    return {qty: selection, sub: subMenu};
  }
};

var getItemSizes = function(item) {
  i = 0;
  sizes = [];

  for (var size in item.sizes) {
    sizes[i] = size;
    i++
  }

  return sizes;
};

var register = {
  subTotal: 0.0,
  total: 0.0,
  tax: 0.0,
  taxRate: .095,
  scannedItems: 0,

  scanItem: function(item, size, quantity) {
    if (item.sizes) {
      itemValue = item.sizes[size];
    } else {
      itemValue = item.amt;
    }

    totalScannedValue = itemValue * quantity;

    this.addToTotal(totalScannedValue);

    if (item.taxable) {
      this.addToTax(totalScannedValue);
    }
  },

  addToTotal: function(amount) {
    this.subTotal += amount;
  },

  addToTax: function(amtToTax) {
    this.tax += amtToTax * this.taxRate;
  },

  getTransaction: function() {
    console.log(this.transaction);
  },

  printTotals: function() {
    console.log("Subtotal: " + this.subTotal.toFixed(2));
    console.log("Tax: " + this.tax.toFixed(2) + " @ " + (this.taxRate*100)  + "%");
    console.log("Total: " + this.getTotal());
  },

  getTotal: function() {
    this.total = this.subTotal + this.tax;
    return this.total.toFixed(2);
  }
};

var getUserSelection = function(writeToUser) {
  var selection = readlineSync.question(writeToUser);

  return selection;
};

var parseInput = function(lowerBound, upperBound, escape, input) {
  if (input === escape) {
    return input;
  }
 
  input = Number(input);

  if (input >= lowerBound && input <= upperBound) {
    return input;
  } else {
    return false;
  }
};

var getObjectSize = function(obj) {
  var i = 0;

  for (var objKey in obj) {
    if (obj.hasOwnProperty(objKey)) {
      i++;
    }
  }
  return i;
};

var clearConsole = function() {
  console.log('\033c');
};

main();


register.printTotals();
