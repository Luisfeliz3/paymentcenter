import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userAPI from "../..//utils/userAPI";
import "./styles.css"

const Login = ({ authenticate, setUserState }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = (event) => {
    // console.log(event.target.value);

    event.preventDefault();
    if (formData.email && formData.password) {
      console.log(formData.email, formData.password);

      userAPI
        .loginUser({
          email: formData.email,
          password: formData.password,
        })
        .then((res) => {
          if (res.status === 200) {
            setUserState(res.data);
            navigate("/dashboard");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div>
      <div id="login">
        <div className="login-header">
          <h3 className="login-header-title">Login to Account</h3>
        </div>

        <form className="login-form" onSubmit={handleFormSubmit}>
          User Id

          <div>
          <input
            value={formData.email}
            type="email"
            name="email"
            placeholder="Email (required)"
            className="email-input"
            onChange={handleInputChange}
          />
          </div>
         


          Password
         <div>
         <input
            value={formData.password}
            name="password"
            placeholder="Password (required)"
            type="password"
            className="password-input"
            onChange={handleInputChange}
          />
         </div>
          <button 
          className="login-now btn btn-primary"
          disabled={!(formData.email && formData.password)}>
            Log in
          </button>
          <Link to="/signup" className="signup-now btn btn-primary">
            <button
            className="login-now{ btn btn-primary"
            > Signup </button>
          </Link>
        </form>
        <div className="login-iframe">

        <iframe src="https://giphy.com/embed/TMZm4bE4M74TJBgeZm" width="280" height="280" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/inako-inlifesheroes-inakoinlife-TMZm4bE4M74TJBgeZm"></a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
 