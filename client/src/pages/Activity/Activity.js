import React from "react";
import RecentActivity from "../../components/RecentActivity/RecentActivity";
import LeftNav from "../../components/LeftNav/LeftNav";
import ToolTip from "../../components/ToolTips";
// import { MdCalendarMonth } from "react-icons/md";
import { GrSplits } from "react-icons/gr";

import "./activityStyle.css";

function Activity() {
  return (
    <div>
      <LeftNav />

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
                <p className="actvity-card-text">$834.55</p>
              </div>
            </div>
          </div>
        </div>

        <div className="actvity-card-split">
        <div className="split-icon"><GrSplits /></div>
          <span className="split-label">Split up your Spending into monthly payments no extra charges or interest fees.</span>
          <span className="split-terms">TERMS & CONDITIONS</span>
        </div>


        <div className="actvity-dl-statement">
       {/* <div className="statement-icon"><MdCalendarMonth /> </div> */}
       <span className="statement-label">  Download Your Monthly Statements</span>
        </div>


        <div className="actvity-card-spend"></div>
        <section id="recent-activity">
          <RecentActivity width={733} />
        </section>
      </div>
    </div>
  );
}

export default Activity;
