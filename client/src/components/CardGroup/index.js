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
console.log(balances)
    fetchData();
  }, []);

  return (
    <div>
      
      {balances ? (
        balances.map((bal, i) => (
          <div className="card-group dashboard" key={i}>
            <div className="card statement">
              <div className="card-body">
                <h5 className="card-title">Statement Balance</h5>
                <p className="sb-value card-text">${bal.statement_balance.toFixed(2)}</p>
                <p className="card-text">
                  <small className="sb-date text">Oct 15 - Nov 12</small>
                </p>
                <a className="sb-button btn btn-outline-primary" href="/activity">
                  View Transactions
                </a>
              </div>
            </div>


        {

bal.minimum_payment.toFixed(2) === "40.00" ?

              <div className="card payment">
              <div className="card-body">
                <h5 className="map-title card-title">Make A Payment</h5>
                <p className="map-title-2 card-text pay">Today</p>
                <p className="card-text">
                  <small className="min-pay-text">
                    Minimum Payment Due 
                  </small>
                  <small className="map-miv-val">${bal.minimum_payment.toFixed(2)}</small>
                </p>
                <button
                  className="map-button btn btn-outline-primary"
                  type="submit"
                  onClick={handleMakePayment}
                >
                  Make a Payment
                </button>
              </div>  
            </div>

         
   :    



   <div className="card payment">
   <div className="card-body">
     <h5 className="map-payed card-title">Account Updated</h5>
     <p className="map-payed-title-2 card-text">Thank You For Your <span className="map-payed-val">Payment!</span></p>
     {/* <p className="card-text">
       <small className="text">
         Minimum Payment Due <span className="map-miv-val">${bal.minimum_payment.toFixed(2)}</span>
       </small>
     </p> */}
     <button
       className="map-button-pay btn btn-outline-primary"
       type="submit"
       onClick={handleMakePayment}
     >
       Make a Payment
     </button>
   </div>  
 </div>



        }



            <div className="card balance">
              <div className="card-body">
                <h5 className="tb-title card-title">Total Balance</h5>
                <p className="tb-value card-text">${bal.total_balance.toFixed(2)}</p>
                <p className="card-text">
                  <small className="text tb-credit-title">
                    Available Credit <span className="tb-credit">${bal.available_credit.toFixed(2)}</span>
                  </small>
                </p>
                <a
                  className="tb-link nav-link active"
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
