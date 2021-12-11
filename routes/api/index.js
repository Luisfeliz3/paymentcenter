const router = require("express").Router();
// const commentRoutes = require("./comments");

const transactionRoutes = require("./transactions");


// pricing routes
router.use("/transactions", transactionRoutes);


module.exports = router;
