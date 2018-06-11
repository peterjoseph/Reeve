import React, { Component } from "react";
import PropTypes from "prop-types";
import { t } from "~/shared/translations/i18n";

import WorkspaceURLField from "../../../common/components/inputs/WorkspaceURLField";

class WorkspaceURL extends Component {
	render() {
		const { workspaceURL, changeField, changeSubdomain, errors } = this.props;

		return (
			<div className="w-100 mb-3">
				<span className="h3">{t("action.signIn")}</span>
				<div className="mt-4 mb-4">
					<span>{t("components.authentication.getStarted")}</span>
				</div>
				<WorkspaceURLField value={workspaceURL} onChange={changeField} disabled={false} error={errors} />
				<div>
					<span>
						<a href="#">{t("components.authentication.whatIsWorkspaceURL")}</a>
					</span>
				</div>
				<button type="button" className={"btn btn-primary btn-lg btn-block mt-4 p-3"} onClick={changeSubdomain} disabled={false}>
					{t("action.continue")}
				</button>
				<div className="mt-4">
					<span>{t("components.authentication.noAccount")}</span> <a href="#">{t("action.register")}</a>
				</div>
			</div>
		);
	}
}

WorkspaceURL.propTypes = {
	workspaceURL: PropTypes.string,
	changeSubdomain: PropTypes.func,
	changeField: PropTypes.func,
	errors: PropTypes.object
};

export default WorkspaceURL;