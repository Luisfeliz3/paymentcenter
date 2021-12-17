const router = require("express").Router();
// const commentRoutes = require("./comments");

const transactionRoutes = require("./transactions");


// transaction routes
router.use("/transactions", transactionRoutes);


module.exports = router;
