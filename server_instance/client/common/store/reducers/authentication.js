import { fromJS } from "immutable";
import { REDUX_STATE } from "shared/constants";
import { clientRegistration, userLogin, userLoad, workspaceURLValidation } from "client/api/authentication.js";

import "./root";

export const AUTHENTICATION = "authentication";

export const VALIDATE_WORKSPACE_URL_PENDING = AUTHENTICATION + "/VALIDATE_WORKSPACE_URL_PENDING";
export const VALIDATE_WORKSPACE_URL_FULFILLED = AUTHENTICATION + "/VALIDATE_WORKSPACE_URL_FULFILLED";
export const VALIDATE_WORKSPACE_URL_REJECTED = AUTHENTICATION + "/VALIDATE_WORKSPACE_URL_REJECTED";

export const LOGIN_PENDING = AUTHENTICATION + "/LOGIN_PENDING";
export const LOGIN_FULFILLED = AUTHENTICATION + "/LOGIN_FULFILLED";
export const LOGIN_REJECTED = AUTHENTICATION + "/LOGIN_REJECTED";

export const LOAD_USER_PENDING = AUTHENTICATION + "/LOAD_USER_PENDING";
export const LOAD_USER_FULFILLED = AUTHENTICATION + "/LOAD_USER_FULFILLED";
export const LOAD_USER_REJECTED = AUTHENTICATION + "/LOAD_USER_REJECTED";

export const REGISTER_PENDING = AUTHENTICATION + "/REGISTER_PENDING";
export const REGISTER_FULFILLED = AUTHENTICATION + "/REGISTER_FULFILLED";
export const REGISTER_REJECTED = AUTHENTICATION + "/REGISTER_REJECTED";

const DEFAULT_STATE = fromJS({});

export default function authentication(state = DEFAULT_STATE, action) {
	switch (action.type) {
		case LOGIN_PENDING:
			return state.setIn(["userLogin", "status"], REDUX_STATE.PENDING);
		case LOGIN_FULFILLED:
			return state.set(
				"userLogin",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case LOGIN_REJECTED:
			return state.set(
				"userLogin",
				fromJS({
					status: REDUX_STATE.REJECTED,
					payload: {},
					error: action.payload
				})
			);
		case LOAD_USER_PENDING:
			return state.setIn(["user", "status"], REDUX_STATE.PENDING);
		case LOAD_USER_FULFILLED:
			return state.set(
				"user",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case LOAD_USER_REJECTED:
			return state.set(
				"user",
				fromJS({
					status: REDUX_STATE.REJECTED,
					payload: {},
					error: action.payload
				})
			);
		case REGISTER_PENDING:
			return action;
		case REGISTER_FULFILLED:
			return action;
		case REGISTER_REJECTED:
			return action;
		case VALIDATE_WORKSPACE_URL_PENDING:
			return state.setIn(["workspaceURL", "status"], REDUX_STATE.PENDING);
		case VALIDATE_WORKSPACE_URL_FULFILLED:
			return state.set(
				"workspaceURL",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case VALIDATE_WORKSPACE_URL_REJECTED:
			return state.set(
				"workspaceURL",
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

export function validateWorkspaceURL(body) {
	return dispatch => {
		dispatch({
			type: VALIDATE_WORKSPACE_URL_PENDING
		});

		return workspaceURLValidation(body).then(
			result => {
				return dispatch({
					type: VALIDATE_WORKSPACE_URL_FULFILLED,
					payload: result.style
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
					payload: error
				})
		);
	};
}

export function loadUser() {
	return dispatch => {
		dispatch({
			type: LOAD_USER_PENDING
		});

		return userLoad().then(
			result => {
				return dispatch({
					type: LOAD_USER_FULFILLED,
					payload: result.user
				});
			},
			error =>
				dispatch({
					type: LOAD_USER_REJECTED,
					payload: error
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
					payload: error
				})
		);
	};
}
