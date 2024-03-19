import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"; //Navigate
import Dashboard from "./pages/Dashboard/Dashboard";
import Activity from "./pages/Activity/Activity";
import Navbar from "./components/NavBar/Navbar";
import userAPI from "./utils/userAPI";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import MakePayment from "./pages/MakePayment/MakePayment";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  const [userState, setUserState] = useState();

  useEffect(() => {
    // auth user on first render
    authenticate();
  }, []);

  //user authentication
  //user authentication
  const authenticate = async () => {
    try {
      const { data } = await userAPI.authenticateUser();
      console.log("user:", data);
      setUserState(data);
    } catch (err) {
      return console.log("registered user:", err.response);
    }
  };

  return (
    <div>
      <div  >
        <BrowserRouter>
          <div>
            <Navbar />
            <Routes>
              <Route
                exact
                path="/login"
                element={
                  <Login
                    setUserState={setUserState}
                    authenticate={authenticate}
                  />
                }
              ></Route>

              <Route exact path="/dashboard" element={<Dashboard />}></Route>

              <Route
                exact
                path="/signup"
                element={
                  <Signup authenticate={authenticate} user={userState} />
                }
              >
 
              </Route>

              <Route
                exact
                path="/activity"
                element={<Activity {...userState} />}
              ></Route>
              <Route exact path="/payment" element={<MakePayment />}></Route>
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
