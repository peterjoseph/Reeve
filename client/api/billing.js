import fetch from "common/fetch";
import { generateQueryStringURL } from "shared/utilities/queryStrings";

// Load Client Subscription Details
export function clientSubscriptionDetails() {
	return fetch.perform("/api/v1.0/client_subscription_details/", {
		method: "GET"
	});
}

// Load List of available subscriptions
export function availableSubscriptions(parameters = {}) {
	return fetch.perform(generateQueryStringURL("/api/v1.0/available_subscriptions/", parameters), {
		method: "GET"
	});
}
