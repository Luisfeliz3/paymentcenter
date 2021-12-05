import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom"; //Redirect
import Dashboard from "./pages/Dashboard";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div clasName="Todo-App">
            <BrowserRouter basename={""}>
              <div className="App">
                <Switch>
                  <Route
                    exact
                    path="/"
                    className="App-link"
                    element={<Dashboard />}
                  >
                    <Dashboard />
                  </Route>

                  <Route exact path="/signup" className="App-link"></Route>

                  <Route />
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
