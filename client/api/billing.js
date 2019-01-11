import fetch from "common/fetch";

// Load Client Subscription Details
export function clientSubscriptionDetails() {
	return fetch.perform("/api/client_subscription_details/", {
		method: "GET"
	});
}

// Load List of available subscriptions
export function availableSubscriptions() {
	return fetch.perform("/api/available_subscriptions", {
		method: "GET"
	});
}
