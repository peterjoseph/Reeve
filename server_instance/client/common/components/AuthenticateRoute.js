import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router";
import { Redirect } from "react-router-dom";

class AuthenticateRoute extends React.Component {
  render() {
    const { path, user, role } = this.props;

    // Show register page if user is not logged in
    if (
      path === "/register" &&
      (user.token == null && user.loggedIn === false)
    ) {
      return <Route {...this.props} />;
    }

    // Redirect if user is not logged in and tries to access restricted page
    if (path !== "/login" && (user.token == null && user.loggedIn === false)) {
      return <Redirect to="/login" />;
    }

    if (role != null && role.indexOf(user.userType) === -1) {
      return <Redirect to="/" />;
    } else {
      return <Route {...this.props} />;
    }
  }
}

AuthenticateRoute.propTypes = {
  user: PropTypes.object,
  role: PropTypes.oneOfType([PropTypes.array])
};

export default AuthenticateRoute;
