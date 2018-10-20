import { connect } from "react-redux";
import { AUTHENTICATION } from "../store/reducers/authentication.js";

const fetchUserProperties = connect(state => ({
	user: state.getIn([AUTHENTICATION, "user", "payload"])
}));

export default function User(WrappedComponent) {
	return fetchUserProperties(WrappedComponent);
}
