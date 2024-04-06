import React from "react";
import "./style.css";
import { FaCircleCheck } from "react-icons/fa6";
import { useState, useEffect } from "react";
import API from "../../utils/API.js";
import Loading from "../../components/Loading/Loading.js";
import CurrencyInput from 'react-currency-input-field';

const MakePayment = () => {
  const [makePayments, setMakePayments] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await API.getBalances();
      setMakePayments(res.data);
      setLoading(false);
    };

    fetchData();
  }, []);



  return (
    <div>
      <div className="payment-container">
        <div className="payment-title">
          <span className="pay-title-label">Pay Your Bill</span>
        </div>

        <div className="payment-message">
          <div className="payment-icon">
            <FaCircleCheck />
          </div>
          <span className="pay-message-label">No Payment At This Time !</span>
        </div>

        <div className="payment-method">
          <div className="payment-method-title"> Bank Account</div>
          <div className="payment-entity-label">
            Instant Bank Personal Checking -8976
          </div>

          <div className="payment-amount-title">Amount</div>
          <div className="form">
            <form className="payment-form">
              <div>
                {" "}
                <input type="radio" name="minimum" className="minimum" />{" "}
                <label className="minimum-label">
                  {" "}
                  Minimun Payment Due{" "}
                  <span className="minimum-amount-label">$40.00</span>
                </label>
              </div>

              <div>
                <input type="radio" name="remaining" className="remaining" />{" "}
                <label className="remaining-label">
                  Remaining Statement Balance
                  <span className="remaining-amount-label">$400.00</span>
                </label>
              </div>

              <div>
                <input type="radio" name="total" className="total" />{" "}
                <label className="total-label">
                  {" "}
                  Total Balance
                  <span className="total-amount-label">$440.00</span>
                </label>
              </div>
              <div className="other-input">
                <input type="radio" name="other" />{" "}
                <label>
                  Other Amount
                  <input
                    type="number"
                    inputMode="decimal"
                    name="amount"
                    className="other-amount-input"
                  />
                      
                  
                </label>
              </div>
              <a className=" pay-now btn btn-primary" href="/activity">
                Pay Now
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePayment;
