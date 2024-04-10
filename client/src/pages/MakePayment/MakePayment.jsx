import React from "react";
import "./style.css";
import { FaCircleCheck } from "react-icons/fa6";
import { useState, useEffect } from "react";
import API from "../../utils/API.js";
import Loading from "../../components/Loading/Loading.js";
import { CurrencyInput, Currencies, Locales } from "input-currency-react";
import MyCustomCurrencyInput from "../../components/CurrencyInput/CurrencyInput.js";

const MakePayment = () => {
  const [makePayments, setMakePayments] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState();
  const isChecked = (value) => selectedItems === value;
  const [formData, setFormData] = useState({
    payment: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await API.getBalances();
      setMakePayments(res.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleOnChange = (e) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setSelectedItems(formData.option);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

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
            <form className="payment-form" onSubmit={handleSubmit}>
              <div>
                <input
                  type="radio"
                  name="option"
                  className="minimum"
                  value="minimum_payment"
                  checked={isChecked("minimum_payment")}
                  onChange={handleOnChange}
                />
                <label className="minimum-label">
                  Minimun Payment Due
                  <span className="minimum-amount-label">$40.00</span>
                </label>
              </div>

              <div>
                <input
                  type="radio"
                  name="option"
                  className="remaining"
                  value="remaining_statement_balance"
                  checked={isChecked("remaining_statement_balance")}
                  onChange={handleOnChange}
                />
                <label className="remaining-label">
                  Remaining Statement Balance
                  <span className="remaining-amount-label">$400.00</span>
                </label>
              </div>

              <div>
                <input
                  type="radio"
                  name="option"
                  className="total"
                  value="total_balance"
                  checked={isChecked("total_balance")}
                  onChange={handleOnChange}
                />
                <label className="total-label">
                  Total Balance
                  <span className="total-amount-label">$440.00</span>
                </label>
              </div>
              <div className="other-input">
                <input
                  type="radio"
                  name="option"
                  value="other_amount"
                  checked={isChecked("other_amount")}
                  onChange={handleOnChange}
                />

                <label>
                  Other Amount
                  <MyCustomCurrencyInput
                    value={formData.payment} // Initial value
                    name="payment"
                    options={{
                      precision: 2,
                      style: "currency",

                      locale: Locales["English (United States)"], // Format Type
                      i18nCurrency: Currencies["US Dollar"], // Symbol
                    }}
                    autoFocus={true}
                    onChange={handleOnChange}
                  />
                </label>
              </div>
              <button className=" pay-now btn btn-primary">Pay Now</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePayment;
