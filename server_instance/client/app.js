import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { BrowserRouter, Switch } from "react-router-dom";
import { t } from "~/shared/translations/i18n";

import RedirectComponent from "./common/components/RedirectComponent";
import AsyncComponent from "./common/components/AsyncComponent";

const Authentication = AsyncComponent(() => import("./modules/authentication"));

class App extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<RedirectComponent exact path="/" render={props => <Authentication />} />
				</Switch>
			</BrowserRouter>
		);
	}
}

function mapStateToProps(state, props) {
	return {};
}

export default connect(mapStateToProps, {})(App);
