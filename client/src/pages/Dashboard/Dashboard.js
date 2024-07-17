import React from "react";
import CardGroup from "../../components/CardGroup/index";
import RecentActivity from "../../components/RecentActivity/RecentActivity";
import "./style.css";
import Dropdown from '../../components/DropDowns/DropDown.js';
import Popup from '../../components/Popup/Popup.js'
 

function Dashboard() {


  const options = [
    { value: '1', label: 'Balance' },
    { value: '2', label: 'Credit' },
    { value: '3', label: 'Payment' },
  ];
  return (
    <div  className="dash-container">
      {/* <Popup/> */}
      <CardGroup />
      
      <RecentActivity width={800} top={70} />

      <div className="recent-activity-trsx-header">
       <span className="trsx-label"> Recent Transactions <span className="trsx-date">(Since Mar 15. Closing Apr 12)</span> All Transactions</span>
      </div>
      {/* <Dropdown options={options} placeholder="Select an option" /> */}
    </div>
  );
}

export default Dashboard;
