import { fromJS } from "immutable";
import { REDUX_STATE } from "shared/constants";
import { loadClient as loadClientDetails, updateClient as updateClientDetails } from "client/api/settings.js";

import "./root";

export const SETTINGS = "settings";

export const LOAD_CLIENT_PENDING = SETTINGS + "/LOAD_CLIENT_PENDING";
export const LOAD_CLIENT_FULFILLED = SETTINGS + "/LOAD_CLIENT_FULFILLED";
export const LOAD_CLIENT_REJECTED = SETTINGS + "/LOAD_CLIENT_REJECTED";

export const UPDATE_CLIENT_PENDING = SETTINGS + "/UPDATE_CLIENT_PENDING";
export const UPDATE_CLIENT_FULFILLED = SETTINGS + "/UPDATE_CLIENT_FULFILLED";
export const UPDATE_CLIENT_REJECTED = SETTINGS + "/UPDATE_CLIENT_REJECTED";

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
