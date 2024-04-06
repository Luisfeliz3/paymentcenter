import React from "react";
import CardGroup from "../../components/CardGroup/index";
import RecentActivity from "../../components/RecentActivity/RecentActivity";
import "./style.css";

function Dashboard() {
  return (
    <div>
      <CardGroup />

      <RecentActivity width={840} top={70} />

      <div className="recent-activity-trsx-header">
       <span className="trsx-label"> Recent Transactions <span className="trsx-date">(Since Mar 15. Closing Apr 12)</span> All Transactions</span>
      </div>
    </div>
  );
}

export default Dashboard;
