import { fromJS } from "immutable";

export default function root(state = fromJS({}), action) {
	if (action.entities) {
		return state.merge(action.entities);
	}
	return state;
}
