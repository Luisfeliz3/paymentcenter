import React, { useState } from "react";
import userAPI from "../../utils/userAPI";
import {  Redirect, Link } from "react-router-dom";


function Signup ({setState, authenticate}) {
 const [user, setUser] = useState({
  email: "",
  username: "",
  password: "",
  passwordConf: ""
})


  
  const handleInputChange = event => {
    const { name, value } = event.target;
    
   setState({
      [name]: value
    });
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    if (user.email && user.password) {
      userAPI.signup({
        username: user.username,
        email: user.email,
        password: user.password,
        passwordConf: user.passwordConf,
      })
      .then(res => {
          if(res.status === 200 ){
            authenticate();
            return <Redirect to="/" />
          }
        })
        .catch(err => console.log(err.response.data));
    }
  };

 
    return (
            <form>
              <input
                value={user.username}
                onChange={handleInputChange}
                name="username"
                placeholder="username (required)"
              />
              <input
                value={user.email}
                onChange={handleInputChange}
                name="email"
                placeholder="email (required)"
              />
              <input
                value={user.password}
                onChange={handleInputChange}
                name="password"
                placeholder="(required)"
                type="password"
              />
              <input
                value={user.passwordConf}
                onChange={handleInputChange}
                name="passwordConf"
                placeholder="(required)"
                type="password"
              />
              
              <button
                // disabled={!(this.state.email && this.state.password)}
                onClick={handleFormSubmit}
              >
                signup
              </button>
              <a to="/">
               <butoon> Login </butoon>
             </a>
            </form>
         
     
    );
  } 


export default Signup;