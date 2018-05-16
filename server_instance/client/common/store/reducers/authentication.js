import { fromJS } from "immutable";
import { clientRegistration } from "~/client/api/authentication.js";

import "./root";

export const REGISTER = "register";

export const REGISTER_PENDING = REGISTER + "/REGISTER_PENDING";
export const REGISTER_FULFILLED = REGISTER + "/REGISTER_FULFILLED";
export const REGISTER_REJECTED = REGISTER + "/REGISTER_REJECTED";

const DEFAULT_STATE = fromJS({});

export default function authentication(state = DEFAULT_STATE, action) {
	switch (action.type) {
		case REGISTER_PENDING:
			return action;
		case REGISTER_FULFILLED:
			return action;
		default:
			return state;
	}
}

export function registerClient(body) {
	return dispatch => {
		dispatch({
			type: REGISTER_PENDING
		});

		return clientRegistration(body).then(
			result => {
				return dispatch({
					type: REGISTER_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: REGISTER_REJECTED,
					payload: error.response
				})
		);
	};
}
