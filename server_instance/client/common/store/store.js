import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import root from "./reducers/root";

const composeEnhancers = (process.env.NODE_ENV !== "production" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const store = createStore(root, composeEnhancers(applyMiddleware(thunk)));

export default store;
