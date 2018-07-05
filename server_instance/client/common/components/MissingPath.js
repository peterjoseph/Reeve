import React from "react";
import { t } from "shared/translations/i18n";

class MissingPath extends React.Component {
	render() {
		return <div className="page-not-found">{t("error.code.404")}</div>;
	}
}

export default MissingPath;
