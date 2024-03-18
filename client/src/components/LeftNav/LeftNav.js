import React from "react";
import "./style.css";


function LeftNav() {
	return (
<div className="wrapper">
        {/* <!-- Sidebar  --> */}
        <nav id="sidebar">
            <div className="sidebar-header">
                <h3>Payment Center</h3>
            </div>

            <ul className="list-unstyled components">
                <p>Recent Activity</p>
                <li className="active">
                    <a href="/homeSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Previous Billing Periods</a>
                    <ul className="collapse list-unstyled" id="homeSubmenu">
                        <li>
                            <a href="/">Home 1</a>
                        </li>
                        <li>
                            <a href="/">Home 2</a>
                        </li>
                        <li>
                            <a href="/">Home 3</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="/">About</a>
                </li>
                <li>
                    <a href="/" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">View By Year</a>
                    <ul className="collapse list-unstyled" id="pageSubmenu">
                        <li>
                            <a href="/">Page 1</a>
                        </li>
                        <li>
                            <a href="/">Page 2</a>
                        </li>
                        <li>
                            <a href="/">Page 3</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="/">Portfolio</a>
                </li>
                <li>
                    <a href="/">PDF Billing Statements</a>
                </li>
            </ul>

            <ul className="list-unstyled CTAs">
                <li>
                    {/* <a href="https://bootstrapious.com/tutorial/files/sidebar.zip" className="download">Download source</a> */}
                </li>
                <li>
                    {/* <a href="https://bootstrapious.com/p/bootstrap-sidebar" className="article">Back to article</a> */}
                </li>
            </ul>
        </nav>

        {/* <!-- Page Content  --> */}

    </div>
	);
}

export default LeftNav;

