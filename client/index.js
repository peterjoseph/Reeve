import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import i18next from "shared/translations/i18n";
import ReactTooltip from "react-tooltip";
import Notifications from "react-notify-toast";
import { Online } from "react-detect-offline";
import Raven from "raven-js";
import GoogleAnalytics from "common/components/GoogleAnalytics";

import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";

import "./common/styles/entry.scss";

import App from "./App";
import store from "./common/store/store";

/* eslint-disable */

// Load Google Analytics Tracking
GoogleAnalytics.initialize();

// Load Sentry error reporting
if (SENTRY_ENABLED) {
	Raven.config(SENTRY_DSN, {
		release: BUILD_RELEASE,
		environment: BUILD_ENVIRONMENT
	}).install();
}

/* eslint-enable */

ReactDOM.render(
	<Provider store={store}>
		<I18nextProvider i18n={i18next}>
			<Fragment>
				<Notifications options={{ animationDuration: 0 }} />
				<App />
				<ReactTooltip />
			</Fragment>
		</I18nextProvider>
	</Provider>,
	document.getElementById("app")
);
