import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import root from "./reducers/root";

// Determine if React development tools should be enabled or disabled
if (process.env.NODE_ENV === "production" && window.__REACT_DEVTOOLS_GLOBAL_HOOK__ && Object.keys(window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers).length) {
	window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers = {};
}

// Determine if Redux development tools should be enabled or disabled
const composeEnhancers = (process.env.NODE_ENV !== "production" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const store = createStore(root, composeEnhancers(applyMiddleware(thunk)));

export default store;
