module.exports = {
  register : {
    /*
    subTotal: 0.0,
    total: 0.0,
    tax: 0.0,
    scannedItems: 0,*/
    taxRate: .095,

    scanItem: function(item, size, quantity) {
      var scannedItem = {};

      if (item.sizes) {
        itemValue = item.sizes[size];
      } else {
        itemValue = item.amt;
      }

      scannedItem.subTotal = itemValue * quantity;

      //this.addToTotal(totalScannedValue);

      if (item.taxable) {
        scannedItem.tax = this.calcTax(scannedItem.subTotal);
      } else {
        scannedItem.tax = 0;
      }

      scannedItem.total = scannedItem.subTotal + scannedItem.tax;

      return scannedItem;
    },

    /*addToTotal: function(amount) {
      this.subTotal += amount;
    },*/

    calcTax: function(amtToTax) {
      return amtToTax * this.taxRate;
    },

    /*getTransaction: function() {
      console.log(this.transaction);
    },

    getFormatTotals: function() {
      var formattedTotals = "Subtotal: " + this.subTotal.toFixed(2) + "<br>";
      formattedTotals += "Tax: " + this.tax.toFixed(2) + " @ " + (this.taxRate*100)  + "%<br>";
      formattedTotals += "Total: " + this.total.toFixed(2);

      console.log("Subtotal: " + this.subTotal.toFixed(2));
      console.log("Tax: " + this.tax.toFixed(2) + " @ " + (this.taxRate*100)  + "%");
      console.log("Total: " + this.total.toFixed(2));

      return formattedTotals;
    },
   
    calcTotal: function() {
      this.total = this.subTotal + this.tax;
    }*/
  }
};