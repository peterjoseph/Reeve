import { fromJS } from "immutable";
import { REDUX_STATE } from "shared/constants";
import {
	loadClient as loadClientDetails,
	updateClient as updateClientDetails,
	loadLocalization as loadLocalizationDetails,
	updateLocalization as updateLocalizationDetails
} from "client/api/settings.js";

import "./root";

export const SETTINGS = "settings";

export const LOAD_CLIENT_PENDING = SETTINGS + "/LOAD_CLIENT_PENDING";
export const LOAD_CLIENT_FULFILLED = SETTINGS + "/LOAD_CLIENT_FULFILLED";
export const LOAD_CLIENT_REJECTED = SETTINGS + "/LOAD_CLIENT_REJECTED";

export const UPDATE_CLIENT_PENDING = SETTINGS + "/UPDATE_CLIENT_PENDING";
export const UPDATE_CLIENT_FULFILLED = SETTINGS + "/UPDATE_CLIENT_FULFILLED";
export const UPDATE_CLIENT_REJECTED = SETTINGS + "/UPDATE_CLIENT_REJECTED";

export const LOAD_LOCALIZATION_PENDING = SETTINGS + "/LOAD_LOCALIZATION_PENDING";
export const LOAD_LOCALIZATION_FULFILLED = SETTINGS + "/LOAD_LOCALIZATION_FULFILLED";
export const LOAD_LOCALIZATION_REJECTED = SETTINGS + "/LOAD_LOCALIZATION_REJECTED";

export const UPDATE_LOCALIZATION_PENDING = SETTINGS + "/UPDATE_LOCALIZATION_PENDING";
export const UPDATE_LOCALIZATION_FULFILLED = SETTINGS + "/UPDATE_LOCALIZATION_FULFILLED";
export const UPDATE_LOCALIZATION_REJECTED = SETTINGS + "/UPDATE_LOCALIZATION_REJECTED";

const DEFAULT_STATE = fromJS({});

export default function language(state = DEFAULT_STATE, action) {
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
