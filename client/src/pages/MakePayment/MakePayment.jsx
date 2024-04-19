import React from "react";
import "./style.css";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { useState, useEffect } from "react";
import API from "../../utils/API.js";
import Loading from "../../components/Loading/Loading.js";

const MakePayment = () => {
  const [makePayments, setMakePayments] = useState();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ payment: "0.00" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await API.getBalances();
      setMakePayments(res.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleOnChange = async (event) => {
    const { name, value } = event.target;
    const regex = /^\d*\.?\d{0,2}$/;
    if (
      regex.test(value) ||
      (await value) === " " ||
      (await value) === "0.00" ||
      (await name) === "option"
    ) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    const payment = parseFloat(formData.payment);
    await paymentVerifier(makePayments[0]._id, formData.option, payment);
  };

  const paymentVerifier = async (id, paymentType, payment) => {
    console.log(payment);
    switch (paymentType) {
      case "statement_balance":
        if (payment === (await makePayments[0].statement_balance)) {
          await API.minPayment({
            id: id,
            statement_balance:
              parseFloat(await makePayments[0].statement_balance) - payment,
            minimum_payment: 0,
            total_balance:
              parseFloat(await makePayments[0].total_balance) - payment,
          }).catch((err) => console.log(err.response.data));
        } else {
          alert("Please Pay the Statememnt Balance amount only!");
        }
        break;

      case "minimum_payment":
        if (payment === 40) {
          await API.minPayment({
            id: id,
            minimum_payment:
              parseFloat(await makePayments[0].minimum_payment) - payment,
            total_balance:
              parseFloat(await makePayments[0].total_balance) - payment,
          })
            .then(alert("Thank You For Your Payment!"))
            .catch((err) => console.log(err.response.data));
        } else if ((await makePayments[0].minimum_payment) === 0) {
          alert("Minium Payment Submitted for this Period");
        } else {
          alert("Minium Payment is $40.00");
        }
        break;

      case "total_balance":
        if (parseFloat(await makePayments[0].total_balance) === payment) {
          await API.minPayment({
            id: id,
            total_balance:
              parseFloat(await makePayments[0].total_balance) - payment,
            minimum_payment: 0,
            statement_balance: 0,
          }).catch((err) => console.log(err.response.data));
        } else {
          alert(
            "You can only Pay the Full Amount, If you want to make a custom payment please choose the 'Pay Other Amount' option"
          );
        }
        break;

      case "other_amount":
        if (
          payment > 0 &&
          payment <= parseFloat(await makePayments[0].total_balance)
        ) {
          await API.minPayment({
            id: id,
            total_balance:
              parseFloat(await makePayments[0].total_balance) - payment,
          }).catch((err) => console.log(err.response.data));
        } else {
          alert("Please pay up to to the Total Amount only! ");
        }
        break;
      default:
        alert("Please choose a Payment Option");
    }
  };
  return (
    <div>
      {makePayments ? (
        makePayments.map((bal, i) => (
          <div className="payment-container" key={i}>
            <div className="payment-title">
              <span className="pay-title-label">Pay Your Bill</span>
            </div>

            <div className="payment-message">
              <div className="payment-icon">
                {/* <FaCircleCheck /> */}
                <FaCircleExclamation />
              </div>
              <span className="pay-message-label">
                Please Choose a Payment Below !
              </span>
            </div>

            <div className="payment-method">
              <div className="payment-method-title"> Bank Account</div>
              <div className="payment-entity-label">
                Instant Bank Personal Checking -8976
              </div>

              <div className="payment-amount-title">Amount</div>
              <div className="form">
                <form className="payment-form" onSubmit={handleSubmit}>
                  <div>
                    <input
                      type="radio"
                      name="option"
                      className="minimum"
                      value="minimum_payment"
                      checked={formData.option === "minimum_payment"}
                      onChange={handleOnChange}
                    />
                    <label className="minimum-label">
                      Minimun Payment Due
                      <span className="minimum-amount-label">
                        ${bal.minimum_payment}
                      </span>
                    </label>
                  </div>

                  <div>
                    <input
                      type="radio"
                      name="option"
                      className="remaining"
                      value="statement_balance"
                      checked={formData.option === "statement_balance"}
                      onChange={handleOnChange}
                    />
                    <label className="remaining-label">
                      Pay Statement Balance
                      <span className="remaining-amount-label">
                        ${bal.statement_balance}
                      </span>
                    </label>
                  </div>

                  <div>
                    <input
                      type="radio"
                      name="option"
                      className="total"
                      value="total_balance"
                      checked={formData.option === "total_balance"}
                      onChange={handleOnChange}
                    />
                    <label className="total-label">
                      Pay Total Balance
                      <span className="total-amount-label">
                        ${bal.total_balance}
                      </span>
                    </label>
                  </div>
                  <div className="other-input">
                    <input
                      type="radio"
                      name="option"
                      value="other_amount"
                      checked={formData.option === "other_amount"}
                      onChange={handleOnChange}
                    />

                    <label>Pay Other Amount</label>

                    <div className="dollar-input-container">
                      <span className="dollar-sign">$</span>
                      <input
                        type="text"
                        id="dollarInput"
                        onChange={handleOnChange}
                        className="dollar-input "
                        name="payment"
                        autoFocus={true}
                      />
                    </div>
                  </div>

                  <button className="pay-now btn btn-primary">Pay Now</button>
                </form>
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

export default MakePayment;
