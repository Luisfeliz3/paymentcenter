import React from "react";
import RecentActivity from "../../components/RecentActivity/RecentActivity";
import LeftNav from "../../components/LeftNav/LeftNav";
import ToolTip from "../../components/ToolTips";

import "./activityStyle.css";

function Activity() {
  return (
  <div>
      <LeftNav/>

   

    <div className="activity">
         
      <div className="actvity-card-group col-md-8">
        <div className="actvity-card vital">
          <div className="actvity-card-body">
            <h5 className="actvity-card-title">Pending</h5>
            <p className="actvity-card-text">$400.00</p>
          </div>
        </div>
        <div className="actvity-card vital">
          <div className="actvity-card-body">
            <h5 className="actvity-card-title">Posted</h5>
            <p className="actvity-card-text">$434.10</p>
          </div>
        </div>
        <div className="actvity-card vital">
          <div className="actvity-card-body">
            <h5 className="actvity-card-title">Total Balance</h5>
            <p className="actvity-card-text">$834.10</p>
          </div>
        </div>
      </div>
      <div className="recent-pos col-md-8">
    </div>

    </div>
   <section id="recent-activity">
   <RecentActivity />
   </section>

    </div>
  );
}

export default Activity;
