var readlineSync = require("readline-sync");
var merch = require("./coffeeShop");

var merchIndex = {
	1: "coffee",
	2: "latte",
	3: "cappuccino",
	4: "bagel",
	5: "muffin"
}

var main = function() {
	displayMenuKey(merch, "name");

	var itemToScan = selectItem();
	var itemToScanSize = '';
	var itemToScanQuantity;

	if (itemToScan.pricedBySize) {
		itemToScanSize = selectSize(itemToScan);
	}

	itemToScanQuantity = getUserSelection("Quantity: ")

	register.scanItem(itemToScan, itemToScanSize, itemToScanQuantity);
}

var selectItem = function() {
	var selection = getUserSelection("Select a menu item. ");
	var selectedItem;

	selection = Number(selection);
	
	if (selection > 0 & selection <= getObjectSize(merchIndex)) {
		selectedItem = merch[merchIndex[selection]];
	}
	return selectedItem;
}

var selectSize = function(item) {
	var sizes = Object.keys(item.sizes);
	var size;
	var selection;

	for (i = 0; i < getObjectSize(sizes); i++) {
		console.log((i + 1) + ". " + sizes[i]);
	}

	selection = getUserSelection("Select size. ");
	selection = Number(selection);

	size = sizes[selection - 1];

	console.log(size);

	return size;
}

var register = {
	subTotal: 0.0,
	total: 0.0,
	tax: 0.0,
	taxRate: .095,

	scanItem: function(item, size, quantity) {
		if (item.pricedBySize) {
			itemValue = item.sizes[size];
		} else {
			itemValue = item["amt"];
		}

		totalScannedValue = itemValue * quantity;

		this.addToTotal(totalScannedValue);

		if (item.taxable) {
			this.addToTax(totalScannedValue);
		}

		this.logItem(item["name"], size, itemValue, quantity);
	},

	addToTotal : function(amount) {
		this.subTotal += amount;
	},

	addToTax : function(amtToTax) {
		this.tax += amtToTax * this.taxRate;
	},

	logItem : function(itemName, itemSize, itemValue, itemQuantity) {
		for (var i = 0; i < itemQuantity; i++) {
			console.log(itemName + ", " + itemSize + ": " + itemValue.toFixed(2));
		}
	},

	getTotal : function() {
		this.total = this.subTotal + this.tax;
		return this.total.toFixed(2);
	}

}

var displayMenuKey = function(menu,keyToDisplay) {
	var i = 1;

	for (var menuKey in menu) {

		if (menu.hasOwnProperty(menuKey)) {
			console.log(i +". "+ menu[menuKey][keyToDisplay]);
			i++;
		}
	}
}
/*
var displayMenu = function(menu) {
	var i = 1;

	for (var menuKey in menu) {

		if (menu.hasOwnProperty(menuKey)) {
			console.log(i +". "+ menu[menuKey]);
			i++;
		}
	}
}
*/
var getUserSelection = function(writeToUser) {
	var selection = readlineSync.question(writeToUser);

	return selection;
}

var getObjectSize = function(obj) {
	var i = 0;

	for (var objKey in obj) {
		if (obj.hasOwnProperty(objKey)) {
			i++;
		}
	}
	return i;
}

main();

console.log("\nSubtotal: "+register.subTotal.toFixed(2));
console.log("Tax: "+register.tax.toFixed(2));
console.log("Total: "+register.getTotal());