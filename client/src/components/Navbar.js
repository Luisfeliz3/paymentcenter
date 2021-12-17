import React from "react";
// import { Nav } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import App from "../../App";
// import Login from "../../pages/Login";
// import Signup from "../../pages/Signup";
// import NewProject from "../../pages/NewProject";
// import SavedProjects from "../../pages/SavedProjects";
// import logo from "../../static/logo.png";
// // Can change icon below to match explanation slide
// import drop from "../../static/projects.png";
import "./style.css";

function Nav() {
	return (
    <nav className="navbar navbar-expand-lg bg-light">
    <div className="container-fluid">
      <a className="navbar-brand" href="/paymentcenter">Payment Center</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="/activity">Activity</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#accountservices">Account Services</a>
          </li>
        </ul>
        <a className="nav-link" href="#accountservices">Help</a>
          <button className="btn btn-outline-success" type="submit">Log In</button>
      </div>
    </div>
  </nav>
	);
}

export default Nav;
