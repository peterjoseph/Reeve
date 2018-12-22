import { fromJS } from "immutable";

import "./root";

const DEFAULT_STATE = fromJS({});

export default function language(state = DEFAULT_STATE, action) {
	switch (action.type) {
		default:
			return state;
	}
}
