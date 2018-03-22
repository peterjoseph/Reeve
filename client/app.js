import React from "react";
import PropTypes from "prop-types";
import { t } from "./common/translations/i18n";

import "./common/styles/entry.scss";

class App extends React.Component {
  render() {
    return <div>Root {t("label.component")}</div>;
  }
}

export default App;
