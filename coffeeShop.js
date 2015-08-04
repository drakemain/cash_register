module.exports = {
	coffee: {
		name: "Coffee",

		pricedBySize: true,
		
		sizes: {
			small: 1.50,
			med: 2.00,
			large: 2.25,
		},

		taxable: true
	},

	latte: {
		name: "Latte",

		pricedBySize: true,

		sizes: {
			small: 1.50,
			med: 2.00,
			large: 2.25,
		},

		taxable: true
	},

	cappuccino: {
		name: "Cappuccino",

		pricedBySize: true,

		sizes: {
			small: 1.50,
			med: 2.00,
			large: 2.25,
		},

		taxable: true
	},

	bagel: {
		name: "Bagel",

		pricedBySize: false,

		amt: 3.25,

		taxable: true,
	},

	muffin: {
		name: "Muffin", 

		pricedBySize: false,

		amt: 3.00,

		taxable: true
	}
};