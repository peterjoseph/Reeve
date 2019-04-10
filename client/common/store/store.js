import { createStore, applyMiddleware, compose } from "redux";
import { combineReducers } from "redux-immutable";
import thunk from "redux-thunk";
import Raven from "raven-js";
import createRavenMiddleware from "raven-for-redux";

import authentication from "./reducers/authentication";
import language from "./reducers/language";

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

// Create default reducer object with combined authentication and language reducers
const createReducer = asyncReducers =>
	combineReducers({
		authentication,
		language,
		...asyncReducers
	});

// Inject async reducers
export const injectReducer = (store, key, asyncReducer) => {
	store.asyncReducers[key] = asyncReducer;
	store.replaceReducer(createReducer(store.asyncReducers));
};

export default (() => {
	const store = createStore(createReducer(), composeEnhancers(applyMiddleware(...middleware)));

	store.asyncReducers = {};
	return store;
})();
