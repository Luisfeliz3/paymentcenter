import db from "../models/index.js";

export default {
	findAll: function (req, res) {
		db.Balances.find(req.query).sort({_id: -1})
			.then((balances) => {
				console.log(balances)
				res.json(balances);
			})
			.catch((err) => res.status(422).json(err));
	},
};


