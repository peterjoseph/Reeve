import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactModal from "react-modal";
import { t } from "shared/translations/i18n";

class Modal extends Component {
	render() {
		const {
			title,
			children,
			actionButtonLabel,
			actionButtonFunc,
			actionDangerous,
			actionDisabled,
			actionLinkLabel,
			actionLinkFunc,
			actionLinkHidden,
			actionLinkDisabled,
			closeModal,
			closeModalDisabled
		} = this.props;

		return (
			<div className="modal" tabIndex="-1">
				<ReactModal contentLabel={title} className="modal-dialog modal-dialog-centered" isOpen ariaHideApp={false} onRequestClose={closeModal}>
					<div className="modal-content rounded-0" role="document">
						<div className="modal-header">
							<h5 className="modal-title">{title}</h5>
							<button type="button" className="close" aria-label="Close" onClick={closeModal}>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">{children}</div>
						<div className="modal-footer">
							{actionLinkLabel && !actionLinkHidden && (
								<button type="button" className="btn btn-link btn-sm mr-auto" onClick={actionLinkFunc} disabled={actionLinkDisabled}>
									{actionLinkLabel}
								</button>
							)}
							{actionButtonLabel && (
								<button type="button" className={`btn ${actionDangerous == true ? "btn-danger" : "btn-primary"} btn-sm`} onClick={actionButtonFunc} disabled={actionDisabled}>
									{actionButtonLabel}
								</button>
							)}
							{closeModal && (
								<button type="button" className="btn btn-secondary btn-sm" onClick={closeModal} data-dismiss="modal" disabled={closeModalDisabled}>
									{t("action.close")}
								</button>
							)}
						</div>
					</div>
				</ReactModal>
			</div>
		);
	}
}

Modal.propTypes = {
	title: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	actionButtonLabel: PropTypes.string,
	actionButtonFunc: PropTypes.func,
	actionDangerous: PropTypes.bool,
	actionDisabled: PropTypes.bool,
	actionLinkLabel: PropTypes.string,
	actionLinkFunc: PropTypes.func,
	actionLinkHidden: PropTypes.bool,
	actionLinkDisabled: PropTypes.bool,
	closeModal: PropTypes.func,
	closeModalDisabled: PropTypes.bool
};

export default Modal;
