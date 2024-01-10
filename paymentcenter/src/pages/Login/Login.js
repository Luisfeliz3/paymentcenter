import React, { useState } from "react";
import userAPI from "../..//utils/userAPI";


function Login({ setState, setUserState }) {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
// console.log(user);

  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, email } = event.target;
   
    setUser({
        name: name,
        user: email,
      });
    // setState({
    //   [name]: value,
    // });
  };

  const handleFormSubmit = (event) => {
    console.log(event.target.value);

    event.preventDefault();
    if (user.email && user.password) {
      userAPI
        .loginUser({
          email: user.email,
          password: user.password,
        })
        .then((res) => {
          if (res.status === 200) {
            setUserState(res.data);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
 
     
        <div className="wrapper">


        {/* <!-- Sidebar  --> */}
        <div id="sidebar">
            <div className="sidebar-header">
                <h3>User Login</h3>
            </div>

            <form className="main">
        Email
        <input 
          value={user.email}
        //   onChange={(e)=>handleInputChange}
          name="email"
          placeholder="Email (required)"
          className="main-button"
          onChange={(event) =>
            setUser({ ...user, email: event.target.value })
          }
        />
        Password
        <input
          value={user.password}
        //   onChange={(e)=>handleInputChange}
          name="password"
          placeholder="Password (required)"
          type="password"
          className="main-button"
          onChange={(event) =>
            setUser({ ...user, password: event.target.value })
          }
        />
        <button
          disabled={!(user.email && user.password)}
          onClick={handleFormSubmit}
          className="main-button"
        >
          Log in
        </button>
        <a to="/signup">
          <button className="main-button"> Signup </button>
        </a>
        </form>

          
        </div>

    </div>
     




 
  );
}

export default Login;
