import React from "react";

const OverviewIcon = props => {
	return (
		<svg {...props} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
			<line x1="3" x2="21" y1="9" y2="9" />
			<line x1="9" x2="9" y1="21" y2="9" />
		</svg>
	);
};

export default OverviewIcon;
