import { combineReducers } from "redux-immutable";

import authentication from "./authentication";

const rootReducer = combineReducers({
	authentication
});

export default rootReducer;
