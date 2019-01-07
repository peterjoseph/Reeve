import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import { t } from "shared/translations/i18n";

class Progress extends Component {
	render() {
		const { step } = this.props;

		return (
			<div className="mt-4 pt-4 mb-3">
				<ul className="progress-panel">
					<li className={step == 1 ? "is-active" : null}>{t("components.billing.selectAPlan")}</li>
					<li className={step == 2 ? "is-active" : null}>{t("components.billing.billingDetails")}</li>
					<li className={step == 3 ? "is-active" : null}>{t("label.finish")}</li>
				</ul>
			</div>
		);
	}
}

Progress.propTypes = {
	step: PropTypes.number
};

export default Progress;