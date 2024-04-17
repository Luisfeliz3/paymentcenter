import React from "react";
import "./style.css";
import { FaCircleCheck } from "react-icons/fa6";
import { useState, useEffect } from "react";
import API from "../../utils/API.js";
import Loading from "../../components/Loading/Loading.js";

const MakePayment = () => {
  const [makePayments, setMakePayments] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState(" ");
  const isChecked = async (value) => selectedItems === (await value);
  const [formData, setFormData] = useState({ payment: "0.00" });
  const [minimum, setMinimumPayment] = useState(0)

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
    event.preventDefault();
    const { name, value } = event.target;
    const regex = /^\d*\.?\d{0,2}$/;
    if (
      regex.test(value) ||
      (await value) === "" ||
      (await value) === "0.00" ||
      (await name) === "option"
    ) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    setSelectedItems(formData.option);
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    await paymentVerifier(
      makePayments[0]._id,
      formData.option,
      formData.payment
    );
  };

  const paymentVerifier = async (id, paymentType, payment) => {
    console.log(paymentType + "<<<<<<<");
    switch (paymentType) {
      case "statement_balance":
        await API.minPayment({
          id: id,
          statement_balance:
            (await makePayments[0].statement_balance) - payment,
        }).catch((err) => console.log(err.response.data));
        break;
      case "minimum_payment":
        await API.minPayment({
          id: id,
          minimum_payment: (await makePayments[0].minimum_payment) - payment,
          total_balance: (await makePayments[0].total_balance) - payment,
        }).catch((err) => console.log(err.response.data));
        break;
      case "total_balance":
        await API.minPayment({
          id: id,
          total_balance: (await makePayments[0].total_balance) - payment,
          minimum_payment: (await makePayments[0].minimum_payment) === 0,
        }).catch((err) => console.log(err.response.data));
        break;
      case "pending_charges":
        await API.minPayment({
          id: id,
          pending_charges: (await makePayments[0].pending_charges) - payment,
        }).catch((err) => console.log(err.response.data));
        break;
      case "posted_charges":
        await API.minPayment({
          id: id,
          posted_charges: (await makePayments[0].posted_charges) - payment,
        }).catch((err) => console.log(err.response.data));
        break;
      case "remaining_statement_balance":
        await API.minPayment({
          id: id,
          remaining_statement_balance:
            (await makePayments[0].remaining_statement_balance) - payment,
        }).catch((err) => console.log(err.response.data));
        break;
      case "available_credit":
        await API.minPayment({
          id: id,
          available_credit: (await makePayments[0].available_credit) - payment,
        }).catch((err) => console.log(err.response.data));
        break;
      case "other_amount":
        await API.minPayment({
          id: id,
          other_amount: (await makePayments[0].other_amount) - payment,
        }).catch((err) => console.log(err.response.data));
        break;
      default:
      // code block
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
                <FaCircleCheck />
              </div>
              <span className="pay-message-label">
                No Payment At This Time !
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
                      checked={isChecked(formData.payment)}
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
                      value="remaining_statement_balance"
                      checked={isChecked(formData.payment)}
                      onChange={handleOnChange}
                    />
                    <label className="remaining-label">
                      Remaining Statement Balance
                      <span className="remaining-amount-label">
                        ${bal.remaining_statement_balance}
                      </span>
                    </label>
                  </div>

                  <div>
                    <input
                      type="radio"
                      name="option"
                      className="total"
                      value="total_balance"
                      checked={isChecked(formData.payment)}
                      onChange={handleOnChange}
                    />
                    <label className="total-label">
                      Total Balance
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
                      checked={isChecked(formData.payment)}
                      onChange={handleOnChange}
                    />

                    <label>Other Amount</label>

                    <div className="dollar-input-container">
                      <span className="dollar-sign">$</span>
                      <input
                        type="text"
                        id="dollarInput"
                        // value={formData.payment }
                        onChange={handleOnChange}
                        className="dollar-input  "
                        value={formData.payment} // Initial value
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
