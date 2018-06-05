import { fromJS } from "immutable";
import { clientRegistration, userLogin, workspaceURLValidation } from "~/client/api/authentication.js";

import "./root";

export const AUTHENTICATION = "authentication";

export const VALIDATE_WORKSPACE_URL_PENDING = AUTHENTICATION + "/VALIDATE_WORKSPACE_URL_PENDING";
export const VALIDATE_WORKSPACE_URL_FULFILLED = AUTHENTICATION + "/VALIDATE_WORKSPACE_URL_FULFILLED";
export const VALIDATE_WORKSPACE_URL_REJECTED = AUTHENTICATION + "/VALIDATE_WORKSPACE_URL_REJECTED";

export const LOGIN_PENDING = AUTHENTICATION + "/LOGIN_PENDING";
export const LOGIN_FULFILLED = AUTHENTICATION + "/LOGIN_FULFILLED";
export const LOGIN_REJECTED = AUTHENTICATION + "/LOGIN_REJECTED";

export const REGISTER_PENDING = AUTHENTICATION + "/REGISTER_PENDING";
export const REGISTER_FULFILLED = AUTHENTICATION + "/REGISTER_FULFILLED";
export const REGISTER_REJECTED = AUTHENTICATION + "/REGISTER_REJECTED";

const DEFAULT_STATE = fromJS({});

export default function authentication(state = DEFAULT_STATE, action) {
	switch (action.type) {
		case LOGIN_PENDING:
			return action;
		case LOGIN_FULFILLED:
			return action;
		case LOGIN_REJECTED:
			return action;
		case REGISTER_PENDING:
			return action;
		case REGISTER_FULFILLED:
			return action;
		case REGISTER_REJECTED:
			return action;
		case VALIDATE_WORKSPACE_URL_PENDING:
			return action;
		case VALIDATE_WORKSPACE_URL_FULFILLED:
			return action;
		case VALIDATE_WORKSPACE_URL_REJECTED:
			return action;
		default:
			return state;
	}
}

export function validateWorkspaceURL(body) {
	return dispatch => {
		dispatch({
			type: VALIDATE_WORKSPACE_URL_PENDING
		});

		return workspaceURLValidation(body).then(
			result => {
				return dispatch({
					type: VALIDATE_WORKSPACE_URL_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: VALIDATE_WORKSPACE_URL_REJECTED,
					payload: error
				})
		);
	};
}

export function loginUser(body) {
	return dispatch => {
		dispatch({
			type: LOGIN_PENDING
		});

		return userLogin(body).then(
			result => {
				return dispatch({
					type: LOGIN_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: LOGIN_REJECTED,
					payload: error.response
				})
		);
	};
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
