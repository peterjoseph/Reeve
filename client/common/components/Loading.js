import React, { Component } from "react";
import Pace from "react-pace-progress";

class Loading extends Component {
	render() {
		return (
			<div className="loading-pacer">
				<Pace color="#4bbf73" height={3} />
			</div>
		);
	}
}

export default Loading;
