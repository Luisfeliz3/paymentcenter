import React from "react";
import CardGroup from "../../components/CardGroup";
import RecentActivity from "../../components/RecentActivity"; 
import "./style.css";

function Dashboard() {
	return (
   <div className = "col-md-10 offset-md-1">
     <CardGroup/>
     <RecentActivity/>
   </div>
	);
}

export default Dashboard;
