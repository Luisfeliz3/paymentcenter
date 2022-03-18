import React, { useEffect, useState } from "react";
import LeftNav from "../../components/LeftNav";
import Pagination from "../../components/pagination/Pagination";
import API from "../../utils/API";
import FeedTitleBar from "../../components/FeedTitleBar"
import "./style.css";



function Activity() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    API.getTransactions()
      .then((res) => setTransactions(res))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <LeftNav />
      <div className="activity">
        <div className="card-group col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Pending</h5>
              <p className="card-text">$400.00</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Posted</h5>
              <p className="card-text">$434.10</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Balance</h5>
              <p className="card-text">$834.10</p>
            </div>
          </div>
        </div>
        <div className="recent-pos col-md-12">
        <FeedTitleBar/>
        </div>
        <div className="recent-pos col-md-8">
          {(
            transactions.data && transactions.data.length > 0
              ? transactions.data.length
              : 0
          ) ? (
            <>
              <Pagination
                transactions={transactions}
                dataLimit={5}
                pageLimit={5}
              />
            </>
          ) : (
            <h1>No transactions to display</h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default Activity;
