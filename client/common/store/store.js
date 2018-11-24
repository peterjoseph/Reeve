import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import Raven from "raven-js";
import createRavenMiddleware from "raven-for-redux";

import root from "./reducers/root";

// Determine if React development tools should be enabled or disabled
if (BUILD_ENVIRONMENT === "production" && window.__REACT_DEVTOOLS_GLOBAL_HOOK__ && Object.keys(window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers).length) {
	window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers = {};
}
// Determine if Redux development tools should be enabled or disabled
const composeEnhancers = (BUILD_ENVIRONMENT !== "production" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// Define middleware to be applied
// Environmental variable defined by Webpack DefinePlugin
const middleware = [thunk];
if (SENTRY_ENABLED) {
	Raven.config(SENTRY_DSN).install();
	middleware.push(
		createRavenMiddleware(Raven, {
			release: BUILD_RELEASE,
			environment: BUILD_ENVIRONMENT
		})
	);
}

const store = createStore(root, composeEnhancers(applyMiddleware(...middleware)));

export default store;
