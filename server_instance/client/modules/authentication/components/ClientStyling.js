import { css } from "emotion";
import { REDUX_STATE } from "shared/constants";

export function clientStyling(workspaceURLStatus, clientStyle) {
	const style = { button: "", links: "", background: "" };
	if (workspaceURLStatus == REDUX_STATE.FULFILLED && clientStyle != null && clientStyle.size > 0) {
		style.button = css`
			&,
			&:hover,
			&:active,
			&:visited,
			&:focus {
				background-color: ${clientStyle.get("primaryColor")} !important;
				border-color: ${clientStyle.get("primaryColor")} !important;
			}
			&:hover:not([disabled]) {
				opacity: 0.9;
			}
		`;
		style.links = css`
			a,
			a:active,
			a.visited {
				color: ${clientStyle.get("primaryColor")};
			}
			a:hover {
				color: ${clientStyle.get("primaryColor")};
			}
		`;
		style.background = css(
			Object.assign(
				{},
				clientStyle.get("backgroundColor") != null && { backgroundColor: `${clientStyle.get("backgroundColor")} !important` },
				clientStyle.get("backgroundImage") && { backgroundImage: `url('${clientStyle.get("backgroundImage")}') !important` }
			)
		);
	}
	return style;
}
