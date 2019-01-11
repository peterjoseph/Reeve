import fetch from "common/fetch";
import { generateQueryStringURL } from "shared/utilities/queryStrings";

// Load Client Subscription Details
export function clientSubscriptionDetails() {
	return fetch.perform("/api/client_subscription_details/", {
		method: "GET"
	});
}

// Load List of available subscriptions
export function availableSubscriptions(parameters = {}) {
	return fetch.perform(generateQueryStringURL("/api/available_subscriptions/", parameters), {
		method: "GET"
	});
}
