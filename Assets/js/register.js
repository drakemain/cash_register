bigDec = require('bigdecimal');

module.exports = {
  register : {
    taxRate: ".095",

    scanItem: function(item, size, quantity) {
      var scannedItem = {};
      quantity = new bigDec.BigDecimal(quantity);

      if (item.sizes) {
        itemValue = new bigDec.BigDecimal(item.sizes[size]);
      } else {
        itemValue = new bigDec.BigDecimal(item.amt);
      }

      scannedItem.subTotal = this.calcSubTotal(itemValue, quantity);

      if (item.taxable) {
        scannedItem.tax = this.calcTax(scannedItem.subTotal);
      } else {
        scannedItem.tax = new bigDec.BigDecimal("0");
      }

      scannedItem.total = this.calcTotal(scannedItem.subTotal, scannedItem.tax);

      return scannedItem;
    },

    calcSubTotal: function(itemValue, quantity) {
      return itemValue.multiply(quantity);
    },

    calcTax: function(amtToTax) {
      var taxRateBD = new bigDec.BigDecimal(this.taxRate);
      return amtToTax.multiply(taxRateBD);
    },

    calcTotal: function(subTotal, tax) {
      return subTotal.add(tax);
    }
  }
};