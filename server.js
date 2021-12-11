const { mongoOptions, sessionOptions } = require("./utils/config");
const session = require("express-session");
const mongoose = require("mongoose");
const express = require("express");
const routes = require("./routes");
const logger = require("morgan");
const cors = require('cors')
const app = express();
// const seed = require("./utils/seedLocalDB");


// Requiring passport as we've configured it
// const passport = require("./utils/passport");

const PORT = process.env.PORT || 3001;

// logging (development)
app.use(logger("dev"));
app.use(cors())
// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets from react build
app.use(express.static("client/build"));

// We need to use sessions to keep track of our user's login status
app.use(session(sessionOptions));
// app.use(passport.initialize());
// app.use(passport.session());

// Add routes, both API and view
app.use(routes);

// Connect to the Mongo DB
// mongoose.createConnection(`mongodb+srv://user1:password1234@cluster0.k6ma6.mongodb.net/paymentcenter?retryWrites=true&w=majority`, mongoOptions);
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/paymentcenter", mongoOptions);
var connection = mongoose.connection;
mongoose.connection.on('connected', ()=>{
  if (process.env.NODE_ENV === 'production') seed.seed();
  console.log('Mongoose is connected !')
})



if (process.env.NODE_ENV === 'production' ){

  app.use(express.static('client/build'));
}
// Start the API server
app.listen(PORT, function () {
	console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});