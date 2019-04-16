import { connect } from "react-redux";
import { AUTHENTICATION } from "../store/reducers/authentication.js";
import { LANGUAGE } from "../store/reducers/language.js";

const fetchUserProperties = connect(state => ({
	user: state.getIn([AUTHENTICATION, "user", "payload"]),
	userStatus: state.getIn([AUTHENTICATION, "user", "status"]),
	language: state.getIn([LANGUAGE, "changeLanguage", "payload"]),
	languageStatus: state.getIn([LANGUAGE, "changeLanguage", "status"])
}));

export default function User(WrappedComponent) {
	return fetchUserProperties(WrappedComponent);
}
