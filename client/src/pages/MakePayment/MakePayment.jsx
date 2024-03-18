import React from "react";
import "./style.css";
import { Button } from "bootstrap";

const MakePayment = () => {
  return (
    <div>
      <div className="payment-card">
        <h1 className="pay-title">Make A Payment</h1>
        <div className="payment-not-required line-break">
          <div>Payment Due!</div>
        </div>
        <div className="bank-acount-line-break">
          <div>Bank Account</div>

          <a>Manage Bank Accounts</a>
        </div>
        <div className="amount-line-break">
          <div>Amount</div>

          <div>
            <input type="checkbox" label="Bank Account"></input>
            <a>Payment Due</a>
          </div>
          <div>
            <input type="checkbox" label="Bank Account"></input>
            <a>Total Balance</a>
          </div>
          <div>
            <input type="checkbox" label="Bank Account"></input>
            <a>Other Amount</a>
          </div>
        </div>
        <div className="term-conditions-line-break">
          <div>Pay Bills Term & Conditions</div>
          <a className="btn btn-outline-success" href="/activity">
            Submit Payment
          </a>
        </div>
      </div>

      <div className="bottom-section">

        <div className="payment-history">

        </div>

        <div className="useful-links">
          
        </div>


      </div>
    </div>
  );
};

export default MakePayment;
