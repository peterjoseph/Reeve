import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Offline } from "react-detect-offline";

import Header from "client/modules/header";
import GlobalStyling from "common/components/GlobalStyling";
import AppOffline from "common/components/AppOffline";

class DefaultLayout extends Component {
	render() {
		const { history, children } = this.props;

		return (
			<GlobalStyling>
				<Fragment>
					<Header key={history.location.key} />
					<TransitionGroup component="main" className="page-main">
						<CSSTransition
							key={history.location.key}
							timeout={500}
							classNames="fade"
							appear
							onExit={node => {
								node.style.top = window.scrollY + "px";
							}}
						>
							<div key={history.location.key}>
								<Offline>
									<AppOffline navMargin={true} />
								</Offline>
								{children}
							</div>
						</CSSTransition>
					</TransitionGroup>
				</Fragment>
			</GlobalStyling>
		);
	}
}

DefaultLayout.propTypes = {
	history: PropTypes.object,
	children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default withRouter(DefaultLayout);
