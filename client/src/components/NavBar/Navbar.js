import React from "react";
import "./style.css";

function Nav() {
	return (
<div>


    <nav  className="nav-container">

      <div className="nav-box">

      <a className="nav-title" href="/dashboard">Payment Center</a>
      <a className="nav-link active box"  href="/activity">Activity</a>
      <a className="nav-link box link-2" href="#accountservices">Account Services</a>
      <a className="nav-link box help" href="#accountservices">Help</a>
      <a className="btn btn-outline-primary nav-box-button" href="/login" type="submit">Log In</a>
      </div>
    </nav>


{/* 

<nav className="navbar main navbar-expand-lg bg-light">
    <div className="container-fluid">

      <div className="collapse navbar-collapse nav-link-container" id="navbarSupportedContent">
      <a className="navbar-brand" href="/dashboard">Payment Center</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="/activity">Activity</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#accountservices">Account Services</a>
          </li>
        </ul>
        <a className="nav-link help" href="#accountservices">Help</a>
          <a className="btn btn-outline-primary" href="/login" type="submit">Log In</a>
      </div>


      
    </div>
  </nav> */}


  
</div>
	);
}

export default Nav;
