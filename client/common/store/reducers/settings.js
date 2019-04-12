import { fromJS } from "immutable";
import { REDUX_STATE } from "shared/constants";
import {
	loadClient as loadClientDetails,
	updateClient as updateClientDetails,
	loadClientStyling as loadStyling,
	updateClientStyling as updateStyling,
	resetClientStyling as resetStyling,
	loadLocalization as loadLocalizationDetails,
	updateLocalization as updateLocalizationDetails,
	deleteWorkspace as performDeleteWorkspace,
	generateSignedPhotoURL,
	uploadPhotoToSignedURL
} from "client/api/settings.js";

export const SETTINGS = "settings";

export const LOAD_CLIENT_PENDING = SETTINGS + "/LOAD_CLIENT_PENDING";
export const LOAD_CLIENT_FULFILLED = SETTINGS + "/LOAD_CLIENT_FULFILLED";
export const LOAD_CLIENT_REJECTED = SETTINGS + "/LOAD_CLIENT_REJECTED";

export const UPDATE_CLIENT_PENDING = SETTINGS + "/UPDATE_CLIENT_PENDING";
export const UPDATE_CLIENT_FULFILLED = SETTINGS + "/UPDATE_CLIENT_FULFILLED";
export const UPDATE_CLIENT_REJECTED = SETTINGS + "/UPDATE_CLIENT_REJECTED";

export const LOAD_CLIENT_STYLING_PENDING = SETTINGS + "/LOAD_CLIENT_STYLING_PENDING";
export const LOAD_CLIENT_STYLING_FULFILLED = SETTINGS + "/LOAD_CLIENT_STYLING_FULFILLED";
export const LOAD_CLIENT_STYLING_REJECTED = SETTINGS + "/LOAD_CLIENT_STYLING_REJECTED";

export const UPDATE_CLIENT_STYLING_PENDING = SETTINGS + "/UPDATE_CLIENT_STYLING_PENDING";
export const UPDATE_CLIENT_STYLING_FULFILLED = SETTINGS + "/UPDATE_CLIENT_STYLING_FULFILLED";
export const UPDATE_CLIENT_STYLING_REJECTED = SETTINGS + "/UPDATE_CLIENT_STYLING_REJECTED";

export const RESET_CLIENT_STYLING_PENDING = SETTINGS + "/RESET_CLIENT_STYLING_PENDING";
export const RESET_CLIENT_STYLING_FULFILLED = SETTINGS + "/RESET_CLIENT_STYLING_FULFILLED";
export const RESET_CLIENT_STYLING_REJECTED = SETTINGS + "/RESET_CLIENT_STYLING_REJECTED";

export const LOAD_LOCALIZATION_PENDING = SETTINGS + "/LOAD_LOCALIZATION_PENDING";
export const LOAD_LOCALIZATION_FULFILLED = SETTINGS + "/LOAD_LOCALIZATION_FULFILLED";
export const LOAD_LOCALIZATION_REJECTED = SETTINGS + "/LOAD_LOCALIZATION_REJECTED";

export const UPDATE_LOCALIZATION_PENDING = SETTINGS + "/UPDATE_LOCALIZATION_PENDING";
export const UPDATE_LOCALIZATION_FULFILLED = SETTINGS + "/UPDATE_LOCALIZATION_FULFILLED";
export const UPDATE_LOCALIZATION_REJECTED = SETTINGS + "/UPDATE_LOCALIZATION_REJECTED";

export const DELETE_WORKSPACE_PENDING = SETTINGS + "/DELETE_WORKSPACE_PENDING";
export const DELETE_WORKSPACE_FULFILLED = SETTINGS + "/DELETE_WORKSPACE_FULFILLED";
export const DELETE_WORKSPACE_REJECTED = SETTINGS + "/DELETE_WORKSPACE_REJECTED";

const DEFAULT_STATE = fromJS({});

export default function settings(state = DEFAULT_STATE, action) {
	switch (action.type) {
		case LOAD_CLIENT_PENDING:
			return state.setIn(["loadClient", "status"], REDUX_STATE.PENDING);
		case LOAD_CLIENT_FULFILLED:
			return state.set(
				"loadClient",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case LOAD_CLIENT_REJECTED:
			return state.set(
				"loadClient",
				fromJS({
					status: REDUX_STATE.REJECTED,
					payload: {},
					error: action.payload
				})
			);
		case UPDATE_CLIENT_PENDING:
			return state.setIn(["updateClient", "status"], REDUX_STATE.PENDING);
		case UPDATE_CLIENT_FULFILLED:
			return state.set(
				"updateClient",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case UPDATE_CLIENT_REJECTED:
			return state.set(
				"updateClient",
				fromJS({
					status: REDUX_STATE.REJECTED,
					payload: {},
					error: action.payload
				})
			);
		case LOAD_CLIENT_STYLING_PENDING:
			return state.setIn(["loadClientStyling", "status"], REDUX_STATE.PENDING);
		case LOAD_CLIENT_STYLING_FULFILLED:
			return state.set(
				"loadClientStyling",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case LOAD_CLIENT_STYLING_REJECTED:
			return state.set(
				"loadClientStyling",
				fromJS({
					status: REDUX_STATE.REJECTED,
					payload: {},
					error: action.payload
				})
			);
		case UPDATE_CLIENT_STYLING_PENDING:
			return state.setIn(["updateClientStyling", "status"], REDUX_STATE.PENDING);
		case UPDATE_CLIENT_STYLING_FULFILLED:
			return state.set(
				"updateClientStyling",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case UPDATE_CLIENT_STYLING_REJECTED:
			return state.set(
				"updateClientStyling",
				fromJS({
					status: REDUX_STATE.REJECTED,
					payload: {},
					error: action.payload
				})
			);
		case RESET_CLIENT_STYLING_PENDING:
			return state.setIn(["resetClientStyling", "status"], REDUX_STATE.PENDING);
		case RESET_CLIENT_STYLING_FULFILLED:
			return state.set(
				"resetClientStyling",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case RESET_CLIENT_STYLING_REJECTED:
			return state.set(
				"resetClientStyling",
				fromJS({
					status: REDUX_STATE.REJECTED,
					payload: {},
					error: action.payload
				})
			);
		case LOAD_LOCALIZATION_PENDING:
			return state.setIn(["loadLocalization", "status"], REDUX_STATE.PENDING);
		case LOAD_LOCALIZATION_FULFILLED:
			return state.set(
				"loadLocalization",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case LOAD_LOCALIZATION_REJECTED:
			return state.set(
				"loadLocalization",
				fromJS({
					status: REDUX_STATE.REJECTED,
					payload: {},
					error: action.payload
				})
			);
		case UPDATE_LOCALIZATION_PENDING:
			return state.setIn(["updateLocalization", "status"], REDUX_STATE.PENDING);
		case UPDATE_LOCALIZATION_FULFILLED:
			return state.set(
				"updateLocalization",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case UPDATE_LOCALIZATION_REJECTED:
			return state.set(
				"updateLocalization",
				fromJS({
					status: REDUX_STATE.REJECTED,
					payload: {},
					error: action.payload
				})
			);
		case DELETE_WORKSPACE_PENDING:
			return state.setIn(["deleteWorkspace", "status"], REDUX_STATE.PENDING);
		case DELETE_WORKSPACE_FULFILLED:
			return state.set(
				"deleteWorkspace",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case DELETE_WORKSPACE_REJECTED:
			return state.set(
				"deleteWorkspace",
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

export function loadClient() {
	return dispatch => {
		dispatch({
			type: LOAD_CLIENT_PENDING
		});

		return loadClientDetails().then(
			result => {
				return dispatch({
					type: LOAD_CLIENT_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: LOAD_CLIENT_REJECTED,
					payload: error
				})
		);
	};
}

export function updateClient(body) {
	return dispatch => {
		dispatch({
			type: UPDATE_CLIENT_PENDING
		});

		return updateClientDetails(body).then(
			result => {
				return dispatch({
					type: UPDATE_CLIENT_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: UPDATE_CLIENT_REJECTED,
					payload: error
				})
		);
	};
}

export function loadClientStyling() {
	return dispatch => {
		dispatch({
			type: LOAD_CLIENT_STYLING_PENDING
		});

		return loadStyling().then(
			result => {
				return dispatch({
					type: LOAD_CLIENT_STYLING_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: LOAD_CLIENT_STYLING_REJECTED,
					payload: error
				})
		);
	};
}

export function updateClientStyling(body) {
	return dispatch => {
		dispatch({
			type: UPDATE_CLIENT_STYLING_PENDING
		});

		return updateStyling(body).then(
			result => {
				return dispatch({
					type: UPDATE_CLIENT_STYLING_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: UPDATE_CLIENT_STYLING_REJECTED,
					payload: error
				})
		);
	};
}

export function resetClientStyling() {
	return dispatch => {
		dispatch({
			type: RESET_CLIENT_STYLING_PENDING
		});

		return resetStyling().then(
			result => {
				return dispatch({
					type: RESET_CLIENT_STYLING_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: RESET_CLIENT_STYLING_REJECTED,
					payload: error
				})
		);
	};
}

export function generateSignedURL(body) {
	return dispatch => {
		dispatch({
			type: UPDATE_CLIENT_STYLING_PENDING
		});

		return generateSignedPhotoURL(body).then(
			result => {
				return result;
			},
			error =>
				dispatch({
					type: UPDATE_CLIENT_STYLING_REJECTED,
					payload: error
				})
		);
	};
}

export function uploadToSignedURL(body) {
	return dispatch => {
		dispatch({
			type: UPDATE_CLIENT_STYLING_PENDING
		});

		return uploadPhotoToSignedURL(body).then(
			result => {
				return result;
			},
			error =>
				dispatch({
					type: UPDATE_CLIENT_STYLING_REJECTED,
					payload: error
				})
		);
	};
}

export function loadLocalization() {
	return dispatch => {
		dispatch({
			type: LOAD_LOCALIZATION_PENDING
		});

		return loadLocalizationDetails().then(
			result => {
				return dispatch({
					type: LOAD_LOCALIZATION_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: LOAD_LOCALIZATION_REJECTED,
					payload: error
				})
		);
	};
}

export function updateLocalization(body) {
	return dispatch => {
		dispatch({
			type: UPDATE_LOCALIZATION_PENDING
		});

		return updateLocalizationDetails(body).then(
			result => {
				return dispatch({
					type: UPDATE_LOCALIZATION_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: UPDATE_LOCALIZATION_REJECTED,
					payload: error
				})
		);
	};
}

export function deleteWorkspace(body) {
	return dispatch => {
		dispatch({
			type: DELETE_WORKSPACE_PENDING
		});

		return performDeleteWorkspace(body).then(
			result => {
				return dispatch({
					type: DELETE_WORKSPACE_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: DELETE_WORKSPACE_REJECTED,
					payload: error
				})
		);
	};
}
