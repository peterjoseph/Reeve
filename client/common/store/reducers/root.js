import { combineReducers } from "redux-immutable";

import authentication from "./authentication";
import profile from "./profile";
import billing from "./billing";
import language from "./language";

const rootReducer = combineReducers({
	authentication,
	profile,
	billing,
	language
});

export default rootReducer;
