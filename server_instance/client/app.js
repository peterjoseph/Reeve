import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { t } from "~/shared/translations/i18n";

import Authentication from "./modules/authentication";

class App extends React.Component {
  render() {
    return <Authentication />;
  }
}

function mapStateToProps(state, props) {
  return {};
}

export default connect(mapStateToProps, {})(App);
