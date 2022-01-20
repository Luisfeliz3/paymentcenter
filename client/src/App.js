import React, { useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"; //Redirect
import Dashboard from "./pages/Dashboard/Dashboard";
import Activity from "./pages/Activity/Activity";
import Navbar from "./components/Navbar";
import userAPI from "./utils/userAPI";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import API from "./utils/API";

import "./App.css";

function App() {
  const [userState, setUserState] = useState({});

  //user authentication
  function authenticate() {
    return userAPI
      .authenticateUser()
      .then(({ data }) => {
        console.log("user:", data);
        setUserState(data);
      })
      .catch((err) => console.log("registered user:", err.response));
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="payment-app">
          <BrowserRouter>
            <div className="App">
              <Navbar />
              <Switch>
                <Route exact path="/login" className="App-link">
                  <Login userState={userState} setUserState={setUserState} />
                </Route>
                <Route
                  exact
                  path="/dashboard"
                  className="App-link"
                  component={Dashboard}
                ></Route>
                <Route exact path="/signup" className="App-link">
                  <Signup authenticate={authenticate} user={userState} />
                </Route>
                <Route exact path="/signup" className="App-link"></Route>
                <Route exact path="/activity" className="App-link">
                  <Activity {...userState} />
                </Route>
              </Switch>
            </div>
            {userState.email ? <Redirect to="/activity" /> : <></>}
          </BrowserRouter>
        </div>
      </header>
    </div>
  );
}

export default App;
