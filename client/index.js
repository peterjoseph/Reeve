import React from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";
import i18next from "./common/translations/i18n";
import { Provider } from "react-redux";

import App from "./app";
import store from "./common/store/store";

import "./common/styles/entry.scss";

ReactDOM.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </Provider>,
  document.getElementById("app")
);
