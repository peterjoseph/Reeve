import React, { Component } from "react";
import Pace from "react-pace-progress";

class Loading extends Component {
	render() {
		return (
			<div style={{ zIndex: 9999 }}>
				<Pace color="#0000FF" height={2} />
			</div>
		);
	}
}

export default Loading;
