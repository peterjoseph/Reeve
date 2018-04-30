import React from "react";
import { Route } from "react-router";

class RedirectComponent extends React.Component {
  render() {
    return <Route {...this.props} />;
  }
}

export default RedirectComponent;
