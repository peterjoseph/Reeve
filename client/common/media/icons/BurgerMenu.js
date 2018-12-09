import React from "react";

const BurgerMenu = props => {
	return (
		<svg {...props} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<line x1="3" x2="21" y1="12" y2="12" />
			<line x1="3" x2="21" y1="6" y2="6" />
			<line x1="3" x2="21" y1="18" y2="18" />
		</svg>
	);
};

export default BurgerMenu;
