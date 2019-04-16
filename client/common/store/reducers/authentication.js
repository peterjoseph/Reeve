import { fromJS } from "immutable";
import { REDUX_STATE } from "shared/constants";
import {
	validateWorkspaceURL as workspaceURLValidation,
	userLogin,
	userLogout,
	userLoad,
	clientRegistration,
	forgotAccountDetails,
	resetPasswordCodeValidation,
	resetPassword,
	verifyEmail,
	resendVerifyEmail as resendEmail
} from "client/api/authentication.js";

export const AUTHENTICATION = "authentication";

export const VALIDATE_WORKSPACE_URL_PENDING = AUTHENTICATION + "/VALIDATE_WORKSPACE_URL_PENDING";
export const VALIDATE_WORKSPACE_URL_FULFILLED = AUTHENTICATION + "/VALIDATE_WORKSPACE_URL_FULFILLED";
export const VALIDATE_WORKSPACE_URL_REJECTED = AUTHENTICATION + "/VALIDATE_WORKSPACE_URL_REJECTED";

export const LOGIN_PENDING = AUTHENTICATION + "/LOGIN_PENDING";
export const LOGIN_FULFILLED = AUTHENTICATION + "/LOGIN_FULFILLED";
export const LOGIN_REJECTED = AUTHENTICATION + "/LOGIN_REJECTED";

export const LOGOUT_PENDING = AUTHENTICATION + "/LOGOUT_PENDING";
export const LOGOUT_FULFILLED = AUTHENTICATION + "/LOGOUT_FULFILLED";
export const LOGOUT_REJECTED = AUTHENTICATION + "/LOGOUT_REJECTED";

export const LOAD_USER_PENDING = AUTHENTICATION + "/LOAD_USER_PENDING";
export const LOAD_USER_FULFILLED = AUTHENTICATION + "/LOAD_USER_FULFILLED";
export const LOAD_USER_REJECTED = AUTHENTICATION + "/LOAD_USER_REJECTED";

export const REGISTER_PENDING = AUTHENTICATION + "/REGISTER_PENDING";
export const REGISTER_FULFILLED = AUTHENTICATION + "/REGISTER_FULFILLED";
export const REGISTER_REJECTED = AUTHENTICATION + "/REGISTER_REJECTED";

export const FORGOT_ACCOUNT_PENDING = AUTHENTICATION + "/FORGOT_ACCOUNT_PENDING";
export const FORGOT_ACCOUNT_FULFILLED = AUTHENTICATION + "/FORGOT_ACCOUNT_FULFILLED";
export const FORGOT_ACCOUNT_REJECTED = AUTHENTICATION + "/FORGOT_ACCOUNT_REJECTED";

export const VALIDATE_RESET_PASSWORD_CODE_PENDING = AUTHENTICATION + "/VALIDATE_RESET_PASSWORD_CODE_PENDING";
export const VALIDATE_RESET_PASSWORD_CODE_FULFILLED = AUTHENTICATION + "/VALIDATE_RESET_PASSWORD_CODE_FULFILLED";
export const VALIDATE_RESET_PASSWORD_CODE_REJECTED = AUTHENTICATION + "/VALIDATE_RESET_PASSWORD_CODE_REJECTED";

export const RESET_PASSWORD_PENDING = AUTHENTICATION + "/RESET_PASSWORD_PENDING";
export const RESET_PASSWORD_FULFILLED = AUTHENTICATION + "/RESET_PASSWORD_FULFILLED";
export const RESET_PASSWORD_REJECTED = AUTHENTICATION + "/RESET_PASSWORD_REJECTED";

export const VERIFY_EMAIL_PENDING = AUTHENTICATION + "/VERIFY_EMAIL_PENDING";
export const VERIFY_EMAIL_FULFILLED = AUTHENTICATION + "/VERIFY_EMAIL_FULFILLED";
export const VERIFY_EMAIL_REJECTED = AUTHENTICATION + "/VERIFY_EMAIL_REJECTED";

export const RESEND_VERIFY_EMAIL_PENDING = AUTHENTICATION + "/RESEND_VERIFY_EMAIL_PENDING";
export const RESEND_VERIFY_EMAIL_FULFILLED = AUTHENTICATION + "/RESEND_VERIFY_EMAIL_FULFILLED";
export const RESEND_VERIFY_EMAIL_REJECTED = AUTHENTICATION + "/RESEND_VERIFY_EMAIL_REJECTED";

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
		case LOGOUT_PENDING:
			return state.setIn(["userLogout", "status"], REDUX_STATE.PENDING);
		case LOGOUT_FULFILLED:
			return state.setIn(["userLogout", "status"], REDUX_STATE.FULFILLED);
		case LOGOUT_REJECTED:
			return state.setIn(["userLogout", "status"], REDUX_STATE.REJECTED);
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
			return state.setIn(["clientRegistration", "status"], REDUX_STATE.PENDING);
		case REGISTER_FULFILLED:
			return state.setIn(["clientRegistration", "status"], REDUX_STATE.FULFILLED);
		case REGISTER_REJECTED:
			return state.setIn(["clientRegistration", "status"], REDUX_STATE.REJECTED);
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
		case FORGOT_ACCOUNT_PENDING:
			return state.setIn(["forgotAccount", "status"], REDUX_STATE.PENDING);
		case FORGOT_ACCOUNT_FULFILLED:
			return state.setIn(["forgotAccount", "status"], REDUX_STATE.FULFILLED);
		case FORGOT_ACCOUNT_REJECTED:
			return state.setIn(["forgotAccount", "status"], REDUX_STATE.REJECTED);
		case VALIDATE_RESET_PASSWORD_CODE_PENDING:
			return state.setIn(["resetPasswordCode", "status"], REDUX_STATE.PENDING);
		case VALIDATE_RESET_PASSWORD_CODE_FULFILLED:
			return state.set(
				"resetPasswordCode",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case VALIDATE_RESET_PASSWORD_CODE_REJECTED:
			return state.set(
				"resetPasswordCode",
				fromJS({
					status: REDUX_STATE.REJECTED,
					payload: {},
					error: action.payload
				})
			);
		case RESET_PASSWORD_PENDING:
			return state.setIn(["resetPassword", "status"], REDUX_STATE.PENDING);
		case RESET_PASSWORD_FULFILLED:
			return state.set(
				"resetPassword",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case RESET_PASSWORD_REJECTED:
			return state.set(
				"resetPassword",
				fromJS({
					status: REDUX_STATE.REJECTED,
					payload: {},
					error: action.payload
				})
			);
		case VERIFY_EMAIL_PENDING:
			return state.setIn(["verifyEmail", "status"], REDUX_STATE.PENDING);
		case VERIFY_EMAIL_FULFILLED:
			return state.setIn(["verifyEmail", "status"], REDUX_STATE.FULFILLED);
		case VERIFY_EMAIL_REJECTED:
			return state.setIn(["verifyEmail", "status"], REDUX_STATE.REJECTED);
		case RESEND_VERIFY_EMAIL_PENDING:
			return state.setIn(["resendVerifyEmail", "status"], REDUX_STATE.PENDING);
		case RESEND_VERIFY_EMAIL_FULFILLED:
			return state.setIn(["resendVerifyEmail", "status"], REDUX_STATE.FULFILLED);
		case RESEND_VERIFY_EMAIL_REJECTED:
			return state.setIn(["resendVerifyEmail", "status"], REDUX_STATE.REJECTED);
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

export function logoutUser() {
	return dispatch => {
		dispatch({
			type: LOGOUT_PENDING
		});

		return userLogout().then(
			result => {
				return dispatch({
					type: LOGOUT_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: LOGOUT_REJECTED,
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

export function forgotAccount(body) {
	return dispatch => {
		dispatch({
			type: FORGOT_ACCOUNT_PENDING
		});

		return forgotAccountDetails(body).then(
			result => {
				return dispatch({
					type: FORGOT_ACCOUNT_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: FORGOT_ACCOUNT_REJECTED,
					payload: error
				})
		);
	};
}

export function validateResetPasswordCode(body) {
	return dispatch => {
		dispatch({
			type: VALIDATE_RESET_PASSWORD_CODE_PENDING
		});

		return resetPasswordCodeValidation(body).then(
			result => {
				return dispatch({
					type: VALIDATE_RESET_PASSWORD_CODE_FULFILLED,
					payload: result.style
				});
			},
			error =>
				dispatch({
					type: VALIDATE_RESET_PASSWORD_CODE_REJECTED,
					payload: error
				})
		);
	};
}

export function resetUserPassword(body) {
	return dispatch => {
		dispatch({
			type: RESET_PASSWORD_PENDING
		});

		return resetPassword(body).then(
			result => {
				return dispatch({
					type: RESET_PASSWORD_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: RESET_PASSWORD_REJECTED,
					payload: error
				})
		);
	};
}

export function verifyUserEmail(body) {
	return dispatch => {
		dispatch({
			type: VERIFY_EMAIL_PENDING
		});

		return verifyEmail(body).then(
			result => {
				return dispatch({
					type: VERIFY_EMAIL_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: VERIFY_EMAIL_REJECTED,
					payload: error
				})
		);
	};
}

export function resendVerifyEmail() {
	return dispatch => {
		dispatch({
			type: RESEND_VERIFY_EMAIL_PENDING
		});

		return resendEmail().then(
			result => {
				return dispatch({
					type: RESEND_VERIFY_EMAIL_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: RESEND_VERIFY_EMAIL_REJECTED,
					payload: error
				})
		);
	};
}
