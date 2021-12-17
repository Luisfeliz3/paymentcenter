import React from "react";
// import { Nav } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import App from "../../App";
// import Login from "../../pages/Login";
// import Signup from "../../pages/Signup";
// import NewProject from "../../pages/NewProject";
// import SavedProjects from "../../pages/SavedProjects";
// import logo from "../../static/logo.png";
// // Can change icon below to match explanation slide
// import drop from "../../static/projects.png";

import CardGroup from "../components/CardGroup";
import RecentActivity from "../components/RecentActivity"; 
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
