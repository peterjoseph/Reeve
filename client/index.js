import React from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";
import i18next from "./common/translations/i18n";

import App from "./app";

ReactDOM.render(
  <I18nextProvider i18n={i18next}>
    <App />
  </I18nextProvider>,
  document.getElementById("app")
);
