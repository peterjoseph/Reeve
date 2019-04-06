import { fromJS } from "immutable";
import { REDUX_STATE } from "shared/constants";
import i18next, { saveLNGToken } from "shared/translations/i18n";
import { changeUserLanguage } from "client/api/language.js";

export const LANGUAGE = "language";

export const CHANGE_LANGUAGE_PENDING = LANGUAGE + "/CHANGE_LANGUAGE_PENDING";
export const CHANGE_LANGUAGE_FULFILLED = LANGUAGE + "/CHANGE_LANGUAGE_FULFILLED";
export const CHANGE_LANGUAGE_REJECTED = LANGUAGE + "/CHANGE_LANGUAGE_REJECTED";

const DEFAULT_STATE = fromJS({});

export default function language(state = DEFAULT_STATE, action) {
	switch (action.type) {
		case CHANGE_LANGUAGE_PENDING:
			return state.setIn(["changeLanguage", "status"], REDUX_STATE.PENDING);
		case CHANGE_LANGUAGE_FULFILLED:
			return state.set(
				"changeLanguage",
				fromJS({
					status: REDUX_STATE.FULFILLED,
					payload: action.payload
				})
			);
		case CHANGE_LANGUAGE_REJECTED:
			return state.set(
				"changeLanguage",
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

export function changeLanguage(language) {
	return dispatch => {
		dispatch({
			type: CHANGE_LANGUAGE_PENDING
		});

		return i18next.changeLanguage(language, (err, t) => {
			if (err) {
				return dispatch({
					type: CHANGE_LANGUAGE_REJECTED
				});
			}

			// Reload i18n resources
			i18next.reloadResources();

			// Store active language in browser
			saveLNGToken(i18next.language);

			return dispatch({
				type: CHANGE_LANGUAGE_FULFILLED,
				payload: { language: i18next.language }
			});
		});
	};
}

export function saveUserLanguage(body) {
	return dispatch => {
		dispatch({
			type: CHANGE_LANGUAGE_PENDING
		});

		return changeUserLanguage(body).then(
			result => {
				return dispatch({
					type: CHANGE_LANGUAGE_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: CHANGE_LANGUAGE_REJECTED,
					payload: error
				})
		);
	};
}
