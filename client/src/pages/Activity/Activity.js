import React from "react";
import RecentActivity from "../../components/RecentActivity/RecentActivity";
import LeftNav from "../../components/LeftNav/LeftNav";
import ToolTip from "../../components/ToolTips";
import { IoIosInformationCircleOutline } from "react-icons/io";

import "./activityStyle.css";

function Activity() {
  return (
    <div>
      <LeftNav/>

<div className="activity-container">
<div className="activity">
        <div className="actvity-card-group col-md-8">
          <div className="actvity-card vital">
            <div className="actvity-card-body">
              <h5 className="actvity-card-title">
                <div className="charges-tooltip">
                  <ToolTip />
                </div>
                Pendin Charges
              </h5>
              <p className="actvity-card-text">$400.00</p>
            </div>
          </div>
          <div className="actvity-card vital">
            <div className="actvity-card-body">
              <h5 className="actvity-card-title">
                <div className="charges-tooltip">
                  <ToolTip />
                </div>
                Posted Charges
              </h5>
              <p className="actvity-card-text">$40.00</p>
            </div>
          </div>
          <div className="actvity-card vital">
            <div className="actvity-card-body">
              <h5 className="actvity-card-title">
                <div className="charges-tooltip">
                  <ToolTip />
                </div>
                Total Balance
              </h5>
              <p className="actvity-card-text">$54.00</p>
            </div>
          </div>
        </div>
      
      </div>


      <div className="actvity-card-split"></div>
      <div className="actvity-dl-statement"></div>
      <div className="actvity-card-spend"></div>
      <section id="recent-activity">
        <RecentActivity 
        width={733}
        />
      </section>
</div>
    </div>
  );
}

export default Activity;
