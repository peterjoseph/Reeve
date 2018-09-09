import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import i18next from "shared/translations/i18n";
import ReactTooltip from "react-tooltip";
import Notifications from "react-notify-toast";
import Raven from "raven-js";

import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";

import App from "./App";
import store from "./common/store/store";

import "./common/styles/entry.scss";

// Load Sentry error reporting
/* eslint-disable */
if (SENTRY_ENABLED) {
	Raven.config(SENTRY_DNS, {
		release: SENTRY_RELEASE,
		environment: SENTRY_ENVIRONMENT
	}).install();
}
/* eslint-enable */

ReactDOM.render(
	<Provider store={store}>
		<I18nextProvider i18n={i18next}>
			<Fragment>
				<Notifications />
				<App />
				<ReactTooltip />
			</Fragment>
		</I18nextProvider>
	</Provider>,
	document.getElementById("app")
);
