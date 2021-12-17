import React from "react";
import RecentActivity from "../components/RecentActivity";
import LeftNav from "../components/LeftNav";

import "./style.css";

function Activity() {
  return (
  <div row-md-2>
      <LeftNav/>
    <div className="activity">
         
      <div className="card-group col-md-8">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Pending</h5>
            <p className="card-text">$400.00</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Posted</h5>
            <p className="card-text">$434.10</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Total Balance</h5>
            <p className="card-text">$834.10</p>
          </div>
        </div>
      </div>
      <div className="recent-pos col-md-8">
      <RecentActivity />
    </div>
    </div>
    </div>
  );
}

export default Activity;
