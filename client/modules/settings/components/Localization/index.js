import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { REDUX_STATE, LANGUAGE_CODES } from "shared/constants";

import validate from "shared/validation/validate";
import { updateLocalization as updateLocalizationValidation } from "shared/validation/settings";
import { t } from "shared/translations/i18n";
import { removeSimilarProperties } from "shared/utilities/filters";

import { SETTINGS, LOAD_LOCALIZATION_REJECTED, UPDATE_LOCALIZATION_REJECTED, loadLocalization, updateLocalization } from "common/store/reducers/settings.js";

import ServerSuccess from "common/components/ServerSuccess";
import ServerError from "common/components/ServerError";

class Localization extends Component {
	constructor(props) {
		super(props);

		this.state = {
			defaultLanguage: "",
			loading: false,
			validationErrors: null,
			serverError: null
		};

		this.setEditableFields = this.setEditableFields.bind(this);
		this.saveLocalization = this.saveLocalization.bind(this);
		this.selectItem = this.selectItem.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;

		if (this._isMounted) {
			this.setState({
				loading: true,
				validationErrors: null,
				serverError: null
			});
		}

		this.props.loadLocalization().then(result => {
			if (result.type === LOAD_LOCALIZATION_REJECTED) {
				if (this._isMounted) {
					this.setState({
						serverError: result.payload
					});
				}
				return;
			} else {
				if (this._isMounted) {
					this.setEditableFields(result.payload.localization);
				}
			}
		});
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.loadLocalizationStatus === prevState.loadLocalizationStatus) {
			return null;
		}
		// Store properties in state if valid
		if (nextProps.loadLocalizationStatus === REDUX_STATE.FULFILLED) {
			return {
				loadLocalizationStatus: REDUX_STATE.FULFILLED
			};
		}
		return null;
	}

	setEditableFields(field) {
		this.setState({
			defaultLanguage: LANGUAGE_CODES[field.defaultLanguage] || "",
			loading: false
		});
	}

	selectItem(evt) {
		this.setState({ [evt.target.name]: evt.target.value });
	}

	saveLocalization(evt) {
		evt.preventDefault(); // Prevent page refresh

		if (this._isMounted) {
			this.setState({
				loading: true,
				validationErrors: null,
				serverError: null
			});
		}

		let body = {
			defaultLanguage: this.state.defaultLanguage
		};

		// Validate input parameters
		const valid = validate(body, updateLocalizationValidation());
		if (valid != null) {
			if (this._isMounted) {
				this.setState({
					loading: false,
					validationErrors: valid
				});
			}
			return;
		}

		// Strip body object of fields that have not changed and create new patch object
		const patchObject = removeSimilarProperties(body, this.props.localization);

		// Validate input parameters with PATCH parameter
		const validPatch = validate(patchObject, updateLocalizationValidation("patch"));
		if (validPatch != null) {
			if (this._isMounted) {
				this.setState({
					loading: false,
					validationErrors: valid
				});
			}
		} else {
			this.props.updateLocalization(patchObject).then(result => {
				if (result.type === UPDATE_LOCALIZATION_REJECTED) {
					if (this._isMounted) {
						this.setState({
							loading: false,
							serverError: result.payload
						});
					}
				} else {
					if (this._isMounted) {
						this.props.loadLocalization().then(result => {
							if (result.type === LOAD_LOCALIZATION_REJECTED) {
								if (this._isMounted) {
									this.setState({
										serverError: result.payload
									});
								}
								return;
							} else {
								// Loading is complete
								this.setState({
									loading: false
								});
								this.props.history.push("/settings/localization?updatelocalization=success");
							}
						});
					}
				}
			});
		}
	}

	render() {
		const { loadLocalizationStatus, updateLocalizationStatus } = this.props;
		const { defaultLanguage, loading, validationErrors, serverError } = this.state;

		const disabled = loading || loadLocalizationStatus == REDUX_STATE.PENDING || updateLocalizationStatus == REDUX_STATE.PENDING;
		const successMessage = updateLocalizationStatus === REDUX_STATE.FULFILLED && !serverError && !validationErrors;

		return (
			<div>
				<h1>{t("components.settings.localization.languageAndLocalization")}</h1>
				<div className="mt-3 mb-5">
					<div className="card rounded-0 my-3 text-left">
						<div className="card-body">
							{successMessage && <ServerSuccess path={{ updatelocalization: "success" }} message={t("success.updateLocalization")} />}
							<ServerError error={serverError} />
							<div className="form-group">
								<label htmlFor="changeLanguageControl">{t("components.settings.localization.defaultLanguage")}</label>
								<select
									id="changeLanguageControl"
									className="form-control"
									style={{ border: "0px", outline: "1px solid #CCC", outlineOffset: "-1px" }} // Chrome doesnt like square select fields, so we do some css trickery
									name={"defaultLanguage"}
									value={defaultLanguage}
									onChange={this.selectItem}
									disabled={disabled}
								>
									<option value={LANGUAGE_CODES[1]}>{t("languages.en")}</option>
									<option value={LANGUAGE_CODES[2]}>{t("languages.it")}</option>
								</select>
								<div className="text-muted">
									<small>{t("components.settings.localization.defaultLanguageSubText")}</small>
								</div>
							</div>
							<button type="submit" className={"btn btn-primary btn-sm btn-block mt-4 p-3"} onClick={this.saveLocalization} disabled={disabled}>
								{t("action.update")}
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Localization.propTypes = {
	history: PropTypes.object,
	localization: PropTypes.object,
	loadLocalization: PropTypes.func,
	loadLocalizationStatus: PropTypes.string,
	updateLocalization: PropTypes.func,
	updateLocalizationStatus: PropTypes.string
};

function mapStateToProps(state) {
	return {
		loadLocalizationStatus: state.getIn([SETTINGS, "loadLocalization", "status"]),
		updateLocalizationStatus: state.getIn([SETTINGS, "updateLocalization", "status"]),
		localization: state.getIn([SETTINGS, "loadLocalization", "payload", "localization"])
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loadLocalization: bindActionCreators(loadLocalization, dispatch),
		updateLocalization: bindActionCreators(updateLocalization, dispatch)
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Localization)
);
