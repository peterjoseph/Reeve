import { fromJS } from "immutable";
import { REDUX_STATE } from "shared/constants";
import { changeUserPassword } from "client/api/profile.js";

import "./root";

export const PROFILE = "profile";

export const CHANGE_PASSWORD_PENDING = PROFILE + "/CHANGE_PASSWORD_PENDING";
export const CHANGE_PASSWORD_FULFILLED = PROFILE + "/CHANGE_PASSWORD_FULFILLED";
export const CHANGE_PASSWORD_REJECTED = PROFILE + "/CHANGE_PASSWORD_REJECTED";

const DEFAULT_STATE = fromJS({});

export default function language(state = DEFAULT_STATE, action) {
	switch (action.type) {
		case CHANGE_PASSWORD_PENDING:
			return state.setIn(["changePassword", "status"], REDUX_STATE.PENDING);
		case CHANGE_PASSWORD_FULFILLED:
			return state.set(
				"changePassword",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case CHANGE_PASSWORD_REJECTED:
			return state.set(
				"changePassword",
				fromJS({
					status: REDUX_STATE.REJECTED,
					payload: {},
					error: action.payload
				})
			);
		default:
			return state;
	}
}

export function changePassword(body) {
	return dispatch => {
		dispatch({
			type: CHANGE_PASSWORD_PENDING
		});

		return changeUserPassword(body).then(
			result => {
				return dispatch({
					type: CHANGE_PASSWORD_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: CHANGE_PASSWORD_REJECTED,
					payload: error
				})
		);
	};
}
