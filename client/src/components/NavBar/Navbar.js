import React from "react";
import "./style.css";
import logo from "../../Images/logo192.png"

function Nav() {
	return (
<div>




<div className="pay-nav-container">
    <div className="pay-nav-bar">

        <div className="nav-contents">
          
        <a className=" " href="/dashboard"><img className="app_logo" src={logo} alt="app_logo" /></a>
        <a className="navbar-brand" href="/dashboard">Payment Center</a>
    <a className="nav-link activity" aria-current="page" href="/activity">Activity</a>
    <a className="nav-link services" href="#accountservices">Account Services</a>
    <a className="nav-link help" href="#accountservices">Help</a>
    <a className="nav-login btn btn-outline-primary" href="/login" type="submit">Log In</a>
        </div>
    
    </div>
</div>










 



{/* <nav className="navbar navbar-expand-lg bg-light">
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
