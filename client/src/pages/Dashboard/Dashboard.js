import React from "react";
import CardGroup from "../../components/CardGroup/index";
import RecentActivity from "../../components/RecentActivity/RecentActivity"; 
import "./style.css";

function Dashboard() {
	return (
   <div>
     <CardGroup/>
     <RecentActivity/>
   </div>
	);
}

export default Dashboard;
