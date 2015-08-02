var merch = require("./coffeeShop");

var register = {

	subTotal : 0.0,

	total : 0.0,

	tax : 0.0,

	taxRate : .095,

	scanItem : function(item, size, quantity) {
		totalScannedValue = item[size] * quantity;

		this.addToTotal(totalScannedValue);

		if (item.taxable) {
			this.addToTax(totalScannedValue);
		}

		this.logItem(item, size, quantity)
	},

	addToTotal : function(amount) {
		this.subTotal += amount;
	},

	addToTax : function(amtToTax) {
		this.tax += amtToTax * this.taxRate;
	},

	logItem : function(item, size, quantity) {
		for (i = 0; i < quantity; i++) {
			console.log(item["name"] + ", " + size + ": " + item[size].toFixed(2))
		}
	},

	getTotal : function() {
		this.total = this.subTotal + this.tax;
		return this.total.toFixed(2);
	}

}


register.scanItem(merch.latte,"small",1);
register.scanItem(merch.coffee,"med",2);


console.log("\nSubtotal: "+register.subTotal);
console.log("Tax: "+register.tax.toFixed(2));
console.log("Total: "+register.getTotal());
