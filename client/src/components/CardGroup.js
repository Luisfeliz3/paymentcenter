import React from "react";
import "./style.css";


function CardGroup() {
	return (
<div className="card-group">
  
  <div className="card">
    <div className="card-body">
      <h5 className="card-title">Statement Balance</h5>
      <p className="card-text">$834.10</p>
      <p className="card-text"><small className="text-muted">Oct 15 - Nov 12</small></p>
      <button className="btn btn-outline-success" type="submit">View Transactions</button>
    </div>
  </div>
  <div className="card">
    <div className="card-body">
      <h5 className="card-title">Make A Payment</h5>
      <p className="card-text">Today</p>
      <p className="card-text"><small className="text-muted">Minimum Payment Due $40.00</small></p>
      <button className="btn btn-outline-success" type="submit">Make a Payment</button>
    </div>
  </div>
  <div className="card">
    <div className="card-body">
      <h5 className="card-title">Total Balance</h5>
      <p className="card-text">$834.10</p>
      <p className="card-text"><small className="text-muted">Available Credit $10,205.00</small></p>
      <a className="nav-link active" aria-current="page" href="#balancedetails">Balance Details</a>
    </div>
  </div>
</div>
	);
}

export default CardGroup;