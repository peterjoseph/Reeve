import { combineReducers } from "redux-immutable";

import authentication from "./authentication";
import profile from "./profile";
import billing from "./billing";
import language from "./language";
import settings from "./settings";

const rootReducer = combineReducers({
	authentication,
	profile,
	billing,
	language,
	settings
});

export default rootReducer;
