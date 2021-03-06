import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ children }) => (
   <Route >
      {children.props._id
       ? children
       : <Redirect to='/activity' />}
   </Route>
)
 export default ProtectedRoute;