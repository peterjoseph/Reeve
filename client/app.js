import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { t } from "./common/translations/i18n";

class App extends React.Component {
  render() {
    return <div>Root {t("label.component")}</div>;
  }
}

function mapStateToProps(state, props) {
  return {};
}

export default connect(mapStateToProps, {})(App)
