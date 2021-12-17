import React, { Component } from "react";
import { BrowserRouter, Route, Switch ,Redirect} from "react-router-dom"; //Redirect
import Dashboard from "./pages/Dashboard";
import Activity from "./pages/Activity";
import Navbar from "./components/Navbar";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="payment-app">
            <BrowserRouter basename={""}>
              <div className="App">
              <Navbar/>
                <Switch>
                  <Route
                    exact path="/"
                    className="App-link"
                    component={Dashboard} 
                  >
                  
                  </Route>
                  <Route exact path="/signup" className="App-link"></Route>
                  <Route exact path="/activity" className="App-link" component={Activity} ></Route>
                  <Route path="*" render={() => <Redirect to="/" />} />
                </Switch>
              </div>
            </BrowserRouter>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
