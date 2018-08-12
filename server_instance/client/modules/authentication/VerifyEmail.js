import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { REDUX_STATE } from "shared/constants";
import { extractSubdomain } from "shared/utilities/subdomain";

import { AUTHENTICATION, VERIFY_EMAIL_REJECTED, validateWorkspaceURL, verifyUserEmail } from "../../common/store/reducers/authentication.js";

class VerifyEmail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			serverError: null
		};

		this.verify = this.verify.bind(this);
	}

	componentDidMount() {
		// Validate workspace url and retrieve client information
		if (this.props.workspaceURLStatus !== REDUX_STATE.FULFILLED) {
			const subdomain = extractSubdomain(window.location.href);
			this.props.validateWorkspaceURL(subdomain);
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.workspaceURLStatus === prevState.workspaceURLStatus) {
			return null;
		}
		// Store subdomain in state if valid
		if (nextProps.workspaceURLStatus === REDUX_STATE.FULFILLED) {
			const subdomain = extractSubdomain(window.location.href);
			return {
				workspaceURL: subdomain
			};
		}
		return null;
	}

	verify(evt) {
		evt.preventDefault(); // Prevent page refresh
	}

	render() {
		return null;
	}
}

VerifyEmail.propTypes = {
	history: PropTypes.object,
	validateWorkspaceURL: PropTypes.func,
	verifyUserEmail: PropTypes.func,
	workspaceURLStatus: PropTypes.string,
	verifyEmailStatus: PropTypes.string
};

function mapStateToProps(state) {
	return {
		workspaceURLStatus: state.getIn([AUTHENTICATION, "workspaceURL", "status"]),
		verifyEmailStatus: state.getIn([AUTHENTICATION, "verifyEmail", "status"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		verifyUserEmail: bindActionCreators(verifyUserEmail, dispatch),
		validateWorkspaceURL: bindActionCreators(validateWorkspaceURL, dispatch)
	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VerifyEmail));
