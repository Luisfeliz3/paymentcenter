import React from "react";
import CardGroup from "../../components/CardGroup/index";
import RecentActivity from "../../components/RecentActivity/RecentActivity"; 
import "./style.css";

function Dashboard() {
	return (
   <div>
     <CardGroup/>
    
     <RecentActivity
     width={840}
     top={70} 
     />
    
    <div className="recent-activity-trsx-header">

    Recent Transactions (Since Mar 15. Closing Apr 12)    All Transactions
</div>
   
   </div>
	);
}

export default Dashboard;
