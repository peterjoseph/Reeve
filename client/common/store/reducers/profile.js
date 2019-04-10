import { fromJS } from "immutable";
import { REDUX_STATE } from "shared/constants";
import {
	loadPersonalProfile,
	updatePersonalProfile,
	changeUserPassword,
	verifyEmailChange,
	saveUserProfilePhoto,
	deleteUserProfilePhoto,
	generateSignedProfilePhotoURL,
	uploadProfilePhotoToSignedURL
} from "client/api/profile.js";

export const PROFILE = "profile";

export const LOAD_PROFILE_PENDING = PROFILE + "/LOAD_PROFILE_PENDING";
export const LOAD_PROFILE_FULFILLED = PROFILE + "/LOAD_PROFILE_FULFILLED";
export const LOAD_PROFILE_REJECTED = PROFILE + "/LOAD_PROFILE_REJECTED";

export const UPDATE_PROFILE_PENDING = PROFILE + "/UPDATE_PROFILE_PENDING";
export const UPDATE_PROFILE_FULFILLED = PROFILE + "/UPDATE_PROFILE_FULFILLED";
export const UPDATE_PROFILE_REJECTED = PROFILE + "/UPDATE_PROFILE_REJECTED";

export const CHANGE_PASSWORD_PENDING = PROFILE + "/CHANGE_PASSWORD_PENDING";
export const CHANGE_PASSWORD_FULFILLED = PROFILE + "/CHANGE_PASSWORD_FULFILLED";
export const CHANGE_PASSWORD_REJECTED = PROFILE + "/CHANGE_PASSWORD_REJECTED";

export const VERIFY_EMAIL_CHANGE_PENDING = PROFILE + "/VERIFY_EMAIL_CHANGE_PENDING";
export const VERIFY_EMAIL_CHANGE_FULFILLED = PROFILE + "/VERIFY_EMAIL_CHANGE_FULFILLED";
export const VERIFY_EMAIL_CHANGE_REJECTED = PROFILE + "/VERIFY_EMAIL_CHANGE_REJECTED";

export const SAVE_PROFILE_PHOTO_PENDING = PROFILE + "/SAVE_PROFILE_PHOTO_PENDING";
export const SAVE_PROFILE_PHOTO_FULFILLED = PROFILE + "/SAVE_PROFILE_PHOTO_FULFILLED";
export const SAVE_PROFILE_PHOTO_REJECTED = PROFILE + "/SAVE_PROFILE_PHOTO_REJECTED";

export const DELETE_PROFILE_PHOTO_PENDING = PROFILE + "/DELETE_PROFILE_PHOTO_PENDING";
export const DELETE_PROFILE_PHOTO_FULFILLED = PROFILE + "/DELETE_PROFILE_PHOTO_FULFILLED";
export const DELETE_PROFILE_PHOTO_REJECTED = PROFILE + "/DELETE_PROFILE_PHOTO_REJECTED";

const DEFAULT_STATE = fromJS({});

export default function profile(state = DEFAULT_STATE, action) {
	switch (action.type) {
		case LOAD_PROFILE_PENDING:
			return state.setIn(["loadProfile", "status"], REDUX_STATE.PENDING);
		case LOAD_PROFILE_FULFILLED:
			return state.set(
				"loadProfile",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case LOAD_PROFILE_REJECTED:
			return state.set(
				"loadProfile",
				fromJS({
					status: REDUX_STATE.REJECTED,
					payload: {},
					error: action.payload
				})
			);
		case UPDATE_PROFILE_PENDING:
			return state.setIn(["updateProfile", "status"], REDUX_STATE.PENDING);
		case UPDATE_PROFILE_FULFILLED:
			return state.set(
				"updateProfile",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case UPDATE_PROFILE_REJECTED:
			return state.set(
				"updateProfile",
				fromJS({
					status: REDUX_STATE.REJECTED,
					payload: {},
					error: action.payload
				})
			);
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
		case SAVE_PROFILE_PHOTO_PENDING:
			return state.setIn(["saveProfilePhoto", "status"], REDUX_STATE.PENDING);
		case SAVE_PROFILE_PHOTO_FULFILLED:
			return state.set(
				"saveProfilePhoto",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case SAVE_PROFILE_PHOTO_REJECTED:
			return state.set(
				"saveProfilePhoto",
				fromJS({
					status: REDUX_STATE.REJECTED,
					payload: {},
					error: action.payload
				})
			);
		case DELETE_PROFILE_PHOTO_PENDING:
			return state.setIn(["deleteProfilePhoto", "status"], REDUX_STATE.PENDING);
		case DELETE_PROFILE_PHOTO_FULFILLED:
			return state.set(
				"deleteProfilePhoto",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case DELETE_PROFILE_PHOTO_REJECTED:
			return state.set(
				"deleteProfilePhoto",
				fromJS({
					status: REDUX_STATE.REJECTED,
					payload: {},
					error: action.payload
				})
			);
		case VERIFY_EMAIL_CHANGE_PENDING:
			return state.setIn(["verifyEmailChange", "status"], REDUX_STATE.PENDING);
		case VERIFY_EMAIL_CHANGE_FULFILLED:
			return state.setIn(["verifyEmailChange", "status"], REDUX_STATE.FULFILLED);
		case VERIFY_EMAIL_CHANGE_REJECTED:
			return state.setIn(["verifyEmailChange", "status"], REDUX_STATE.REJECTED);
		default:
			return state;
	}
}

export function loadProfile() {
	return dispatch => {
		dispatch({
			type: LOAD_PROFILE_PENDING
		});

		return loadPersonalProfile().then(
			result => {
				return dispatch({
					type: LOAD_PROFILE_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: LOAD_PROFILE_REJECTED,
					payload: error
				})
		);
	};
}

export function updateProfile(body) {
	return dispatch => {
		dispatch({
			type: UPDATE_PROFILE_PENDING
		});

		return updatePersonalProfile(body).then(
			result => {
				return dispatch({
					type: UPDATE_PROFILE_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: UPDATE_PROFILE_REJECTED,
					payload: error
				})
		);
	};
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

export function verifyUserEmailChange(body) {
	return dispatch => {
		dispatch({
			type: VERIFY_EMAIL_CHANGE_PENDING
		});

		return verifyEmailChange(body).then(
			result => {
				return dispatch({
					type: VERIFY_EMAIL_CHANGE_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: VERIFY_EMAIL_CHANGE_REJECTED,
					payload: error
				})
		);
	};
}

export function generateSignedURL(body) {
	return dispatch => {
		dispatch({
			type: SAVE_PROFILE_PHOTO_PENDING
		});

		return generateSignedProfilePhotoURL(body).then(
			result => {
				return result;
			},
			error =>
				dispatch({
					type: SAVE_PROFILE_PHOTO_REJECTED,
					payload: error
				})
		);
	};
}

export function uploadToSignedURL(body) {
	return dispatch => {
		dispatch({
			type: SAVE_PROFILE_PHOTO_PENDING
		});

		return uploadProfilePhotoToSignedURL(body).then(
			result => {
				return result;
			},
			error =>
				dispatch({
					type: SAVE_PROFILE_PHOTO_REJECTED,
					payload: error
				})
		);
	};
}

export function saveProfilePhoto(body) {
	return dispatch => {
		dispatch({
			type: SAVE_PROFILE_PHOTO_PENDING
		});

		return saveUserProfilePhoto(body).then(
			result => {
				return dispatch({
					type: SAVE_PROFILE_PHOTO_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: SAVE_PROFILE_PHOTO_REJECTED,
					payload: error
				})
		);
	};
}

export function deleteExistingProfilePhoto() {
	return dispatch => {
		dispatch({
			type: DELETE_PROFILE_PHOTO_PENDING
		});

		return deleteUserProfilePhoto().then(
			result => {
				return dispatch({
					type: DELETE_PROFILE_PHOTO_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: DELETE_PROFILE_PHOTO_REJECTED,
					payload: error
				})
		);
	};
}
