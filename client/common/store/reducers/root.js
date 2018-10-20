import { combineReducers } from "redux-immutable";

import authentication from "./authentication";
import language from "./language";

const rootReducer = combineReducers({
	authentication,
	language
});

export default rootReducer;
