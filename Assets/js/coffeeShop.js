module.exports.items = {
	coffee: {
		name: "Coffee",

		sizes: {
			small: 1.50,
			med: 2.00,
			large: 2.25,
		},

		taxable: true
	},

	latte: {
		name: "Latte",

		sizes: {
			small: 2.25,
			med: 2.75,
			large: 3.10,
		},

		taxable: true
	},

	cappuccino: {
		name: "Cappuccino",

		sizes: {
			small: 2.50,
			med: 2.85,
			large: 3.25,
		},

		taxable: true
	},

	bagel: {
		name: "Bagel",

		amt: 3.25,

		taxable: true,
	},

	muffin: {
		name: "Muffin", 

		amt: 3.00,

		taxable: true
	},

	nonTaxItem: {
		name: "A non-taxable item",

		sizes: {
			xsmall: .25,
			small: .50,
			med: 1.00,
			large: 1.40,
			xlarge: 2.00
		},

		taxable: false
	}
};

module.exports.index = {
	1: "coffee",
	2: "latte",
	3: "cappuccino",
	4: "bagel",
	5: "muffin",
	6: "nonTaxItem"
};