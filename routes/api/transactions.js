const router = require("express").Router();
const transactionsController = require("../../controllers/transactionsController");

// Matches with "/api/transactions" from API.js
router.route("/")
    .get(transactionsController.findAll);

module.exports = router;
