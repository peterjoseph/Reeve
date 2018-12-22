import { combineReducers } from "redux-immutable";

import authentication from "./authentication";
import billing from "./billing";
import language from "./language";

const rootReducer = combineReducers({
	authentication,
	billing,
	language
});

export default rootReducer;
