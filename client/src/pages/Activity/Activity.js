import React from "react";
import RecentActivity from "../../components/RecentActivity/RecentActivity";
import LeftNav from "../../components/LeftNav/LeftNav";
import ToolTip from "../../components/ToolTips";
import { MdCalendarMonth } from "react-icons/md";
import { GrSplits } from "react-icons/gr";

import "./activityStyle.css";

function Activity() {
  return (
   <div>
      <LeftNav className="sidesbar" />
     <div className="container">
  
      <div className="activity-container">
        <div className="activity">
          <div className="activity-card-group">
            <div className="activity-card vital">
              <div className="activity-card-body">
                <h5 className="activity-card-title">
                  <div className="charges-tooltip">
              
                  </div>
                  Pending Charges
                </h5>
                <p className="activity-card-text">$400.00</p>
              </div>
            </div>
            <div className="activity-card vital">
              <div className="activity-card-body">
                <h5 className="activity-card-title">
                  <div className="charges-tooltip">
              
                  </div>
                  Posted Charges
                </h5>
                <p className="activity-card-text">$40.00</p>
              </div>
            </div>
            <div className="activity-card vital">
              <div className="activity-card-body">
                <h5 className="activity-card-title">
                  <div className="charges-tooltip">
            
                  </div>
                  Total Balance
                </h5>
                <p className="activity-card-text">$834.55</p>
              </div>
            </div>
          </div>
        </div>
{/* <div className="activity-card-spend">

</div> */}
        <div className="activity-card-split">
        
          <span className="split-label">Split up your Spending into monthly payments no extra charges or interest fees.</span>
          <span className="split-terms">TERMS & CONDITIONS</span>
          <div className="split-icon"><GrSplits /></div>
        </div>


        <div className="activity-dl-statement">
       <div className="statement-icon"><MdCalendarMonth /> </div>
       <span className="statement-label">  Download Your Monthly Statements</span>
        </div>


        <div className="activity-card-spend"></div>
        {/* <section id="recent-activity">
          <RecentActivity width={735} />
        </section> */}
      </div>
    </div>
   </div>
  );
}

export default Activity;
