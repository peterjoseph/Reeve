import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Global, css } from "@emotion/core";
import { variableExists } from "shared/utilities/filters";

import User from "common/components/User";

class GlobalStyling extends Component {
	loadPCS(color) {
		return `
            a {
                color: ${color};
            }

            a:hover {
                color: ${color};
                filter: brightness(105%);
            }

            .btn-primary {
                background-color: ${color};
                border-color: ${color};
            }

            .btn-primary:hover {
                background-color: ${color};
                border-color: ${color};
                filter: brightness(95%);
            }

            .btn-primary.active, .btn-primary:active, .btn-primary.focus, .btn-primary:focus {
                background-color: ${color};
                border-color: ${color};
            }

            .btn-primary.disabled, .btn-primary:disabled {
                background-color: ${color};
                border-color: ${color};
            }

            .btn-primary:not(:disabled):not(.disabled):active, .btn-primary:not(:disabled):not(.disabled).active,
            .show > .btn-primary.dropdown-toggle {
                background-color: ${color};
                border-color: ${color};
            }

            .btn-outline-primary {
                color: ${color};
                border-color: ${color};
            }
            
            .btn-outline-primary:hover {
                background-color: ${color};
                border-color: ${color};
            }

            .btn-outline-primary.disabled, .btn-outline-primary:disabled {
                color: ${color};
            }
            
            .btn-outline-primary:not(:disabled):not(.disabled):active, .btn-outline-primary:not(:disabled):not(.disabled).active,
            .show > .btn-outline-primary.dropdown-toggle {
                background-color: ${color};
                border-color: ${color};
            }

            .btn-link {
                color: ${color};
            }

            .btn-link.active, .btn-link:active, .btn-link.focus, .btn-link:focus {
                color: ${color};
            }

            .btn-link:hover {
                color: ${color};
                filter: brightness(95%);
            }

            .btn-link:disabled, .btn-link.disabled {
                color: ${color};
                filter: brightness(80%);
            }

            .dropdown-item.active, .dropdown-item:active {
                background-color: ${color};
            }

            .custom-control-input:checked ~ .custom-control-label::before {
                background-color: ${color};
            }

            .custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {
                background-color: ${color};
            }

            .custom-control-input:active ~ .custom-control-label::before {
                background-color: ${color};
                filter: brightness(95%);
            }
              
            .custom-control-input:disabled ~ .custom-control-label::before {
                background-color: ${color};
                filter: brightness(80%);
            }

            .custom-checkbox .custom-control-input:indeterminate ~ .custom-control-label::before {
                background-color: ${color};
            }

            .custom-radio .custom-control-input:checked ~ .custom-control-label::before {
                background-color: ${color};
            }

            .custom-range::-webkit-slider-thumb {
                background-color: ${color};
            }

            .custom-range::-moz-range-thumb {
                background-color: ${color};
            }

            .custom-range::-ms-thumb {
                background-color: ${color};
            }

            .nav-pills .nav-link.active,
            .nav-pills .show > .nav-link {
                background-color: ${color};
            }

            .page-link {
                color: ${color};
            }

            .page-item.active .page-link {
                background-color: ${color};
                border-color: ${color};
            }

            .badge-primary {
                background-color: ${color};
            }

            .progress-bar {
                background-color: ${color};
            }

            .list-group-item.active {
                background-color: ${color};
                border-color: ${color};
            }

            .bg-primary {
                background-color: ${color} !important;
            }

            .border-primary {
                border-color: ${color} !important;
            }

            .text-primary {
                color: ${color} !important;
            }
        `;
	}

	loadSCS(color) {
		return `
            caption {
                color: ${color};
            }

            .blockquote-footer {
                color: ${color};
            }

            .figure-caption {
                color: ${color};
            }

            .form-control::-webkit-input-placeholder {
            color: ${color};
            opacity: 1;
            }

            .form-control::-moz-placeholder {
                color: ${color};
            }

            .form-control:-ms-input-placeholder {
                color: ${color};
            }

            .form-control::-ms-input-placeholder {
                color: ${color};
            }

            .form-control::placeholder {
                color: ${color};
            }

            .form-check-input:disabled ~ .form-check-label {
                color: ${color};
            }

            .btn-secondary {
                background-color: ${color};
                border-color: ${color};
            }

            .btn-secondary.hover, .btn-secondary:hover {
                background-color: ${color};
                border-color: ${color};
                filter: brightness(120%);
            }

            .btn-secondary.active, .btn-secondary:active, .btn-secondary.focus, .btn-secondary:focus {
                background-color: ${color};
                border-color: ${color};
            }

            .btn-secondary.disabled, .btn-secondary:disabled {
                background-color: ${color};
                border-color: ${color};
            }

            .btn-secondary:not(:disabled):not(.disabled):active, .btn-secondary:not(:disabled):not(.disabled).active,
            .show > .btn-secondary.dropdown-toggle {
                background-color: ${color};
                border-color: ${color};
            }

            .btn-outline-secondary {
                color: ${color};
                border-color: ${color};
            }

            .btn-outline-secondary:hover {
                background-color: ${color};
                border-color: ${color};
            }

            .btn-outline-secondary.disabled, .btn-outline-secondary:disabled {
                color: ${color};
            }

            .btn-outline-secondary:not(:disabled):not(.disabled):active, .btn-outline-secondary:not(:disabled):not(.disabled).active,
                background-color: ${color};
                border-color: ${color};
            }

            .btn-link:disabled, .btn-link.disabled {
                color: ${color};
            }

            .dropdown-item.disabled, .dropdown-item:disabled {
                color: ${color};
            }

            .dropdown-header {
                color: ${color};
            }

            .custom-control-input:disabled ~ .custom-control-label {
                color: ${color};
            }

            .custom-select:disabled {
                color: ${color};
            }

            .nav-link.disabled {
                color: ${color};
            }

            .nav-tabs .nav-link.disabled {
                color: ${color};
            }

            .breadcrumb-item + .breadcrumb-item::before {
                color: ${color};
            }

            .breadcrumb-item.active {
                color: ${color};
            }

            .page-item.disabled .page-link {
                color: ${color};
            }

            .badge-secondary {
                background-color: ${color};
            }

            .list-group-item.disabled, .list-group-item:disabled {
                color: ${color};
            }

            .bg-secondary {
                background-color: ${color} !important;
            }

            .border-secondary {
                border-color: ${color} !important;
            }

            .text-secondary {
                color: ${color} !important;
            }

            .text-muted {
                color: ${color} !important;
            }
        `;
	}

	render() {
		const { user, children } = this.props;

		let primary = "";
		let secondary = "";

		// Inject styles if user has loaded
		if (variableExists(user) && variableExists(user.get("userId"))) {
			// Load styles if custom primary color exists for client
			primary = variableExists(user.get("primaryColor")) ? this.loadPCS(user.get("primaryColor")) : "";
			// Load styles if custom secondary color exists for client
			secondary = variableExists(user.get("secondaryColor")) ? this.loadSCS(user.get("secondaryColor")) : "";
		}
		return (
			<Fragment>
				<Global
					styles={css`
						${primary} ${secondary}
					`}
				/>
				{children}
			</Fragment>
		);
	}
}

GlobalStyling.propTypes = {
	children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	user: PropTypes.object
};

export default User(GlobalStyling);
