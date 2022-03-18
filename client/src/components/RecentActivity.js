import React, { useState, useEffect } from "react";
import API from "../utils/API";
import ActivityTransactions from "../components/ActivityTransactions";
import FeedTitleBar from "./FeedTitleBar";

function RecentActivity() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    API.getTransactions()
      .then((res) => setTransactions(res))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <FeedTitleBar />

      {transactions.data ? (
        transactions.data.map((result, index) => (
          <div className="col-md-8">
            <ActivityTransactions data={result} key={index} />
          </div>
        ))
      ) : (
        <h1>No transactions to display</h1>
      )}
    </div>
  );
}

export default RecentActivity;
