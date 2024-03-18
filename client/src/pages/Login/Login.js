import React, { useState} from "react";
import { useNavigate, Link } from 'react-router-dom'
import userAPI from "../..//utils/userAPI";

const Login = ({ authenticate, setUserState }) => {
  const [formData, setFormData] = useState({
    email:" ",
    password:" ",
  });


  const navigate = useNavigate();



  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target
    setFormData((prevData)=>({...prevData, [name]:value}));
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
            navigate('/dashboard')
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="wrapper">
   
      <div id="sidebar">
        <div className="sidebar-header">
          <h3>User Login</h3>
        </div>

        <form className="main"  onSubmit={handleFormSubmit}>
          Email
          <input
            value={formData.email}
            type="email"
            name="email"
            placeholder="Email (required)"
            className="main-button"
            onChange={handleInputChange}
          />
          Password
          <input
            value={formData.password}
            name="password"
            placeholder="Password (required)"
            type="password"
            className="main-button"
            onChange={handleInputChange}
          />
          <button
            disabled={!(formData.email && formData.password)}
            className="main-button"
          >
            Log in
          </button>
          <Link to="/signup">
            <button className="main-button"> Signup </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
