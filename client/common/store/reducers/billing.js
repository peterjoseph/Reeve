import { fromJS } from "immutable";
import { REDUX_STATE } from "shared/constants";
import { clientSubscriptionDetails } from "client/api/billing.js";

import "./root";

export const BILLING = "billing";

export const LOAD_CLIENT_SUBSCRIPTION_DETAILS_PENDING = BILLING + "/LOAD_CLIENT_SUBSCRIPTION_DETAILS_PENDING";
export const LOAD_CLIENT_SUBSCRIPTION_DETAILS_FULFILLED = BILLING + "/LOAD_CLIENT_SUBSCRIPTION_DETAILS_FULFILLED";
export const LOAD_CLIENT_SUBSCRIPTION_DETAILS_REJECTED = BILLING + "/LOAD_CLIENT_SUBSCRIPTION_DETAILS_REJECTED";

const DEFAULT_STATE = fromJS({});

export default function language(state = DEFAULT_STATE, action) {
	switch (action.type) {
		case LOAD_CLIENT_SUBSCRIPTION_DETAILS_PENDING:
			return state.setIn(["subscriptionDetails", "status"], REDUX_STATE.PENDING);
		case LOAD_CLIENT_SUBSCRIPTION_DETAILS_FULFILLED:
			return state.setIn(["subscriptionDetails", "status"], REDUX_STATE.FULFILLED);
		case LOAD_CLIENT_SUBSCRIPTION_DETAILS_REJECTED:
			return state.set(
				"subscriptionDetails",
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

export function loadSubscriptionDetails() {
	return dispatch => {
		dispatch({
			type: LOAD_CLIENT_SUBSCRIPTION_DETAILS_PENDING
		});

		return clientSubscriptionDetails().then(
			result => {
				return dispatch({
					type: LOAD_CLIENT_SUBSCRIPTION_DETAILS_FULFILLED,
					payload: result
				});
			},
			error =>
				dispatch({
					type: LOAD_CLIENT_SUBSCRIPTION_DETAILS_REJECTED,
					payload: error
				})
		);
	};
}
