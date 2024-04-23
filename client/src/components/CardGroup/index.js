import { useNavigate } from "react-router-dom";

import "./style.css";
import { useState, useEffect } from "react";
import API from "../../utils/API.js";
import Loading from "../Loading/Loading.js";



const CardGroup = () => {
  const [balances, setBalances] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleMakePayment = (e) => {
    e.preventDefault();
    navigate("/payment");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await API.getBalances();
      setBalances(res.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      
      {balances ? (
        balances.map((bal, i) => (
          <div className="card-group dashboard">
            <div className="card statement">
              <div className="card-body">
                <h5 className="card-title">Statement Balance</h5>
                <p className="card-text">${bal.statement_balance.toFixed(2)}</p>
                <p className="card-text">
                  <small className="text">Oct 15 - Nov 12</small>
                </p>
                <a className="btn btn-outline-primary" href="/activity">
                  View Transactions
                </a>
              </div>
            </div>
            <div className="card payment">
              <div className="card-body">
                <h5 className="card-title">Make A Payment</h5>
                <p className="card-text">Today</p>
                <p className="card-text">
                  <small className="text">
                    Minimum Payment Due ${bal.minimum_payment.toFixed(2)}
                  </small>
                </p>
                <button
                  className="btn btn-outline-primary"
                  type="submit"
                  onClick={handleMakePayment}
                >
                  Make a Payment
                </button>
              </div>
            </div>
            <div className="card balance">
              <div className="card-body">
                <h5 className="card-title">Total Balance</h5>
                <p className="card-text">${bal.total_balance.toFixed(2)}</p>
                <p className="card-text">
                  <small className="text">
                    Available Credit ${bal.available_credit.toFixed(2)}
                  </small>
                </p>
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="#balancedetails"
                >
                  Balance Details
                </a>
              </div>
            </div>
          </div>
        ))
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default CardGroup;
