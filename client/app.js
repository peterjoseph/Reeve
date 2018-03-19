import React from "react";
import PropTypes from "prop-types";
import { I18n } from "react-i18next";
import i18n from "./common/translations/i18n";

import "./common/styles/entry.scss";

class App extends React.Component {
  render() {
    return <I18n>{t => <div>Root Component {t("name.label")}</div>}</I18n>;
  }
}

export default App;
