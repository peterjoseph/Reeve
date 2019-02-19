import React, { Component } from "react";
import { injectStripe } from "react-stripe-elements";

import InputField from "common/components/inputs/InputField";
import Checkbox from "common/components/inputs/Checkbox";

class InjectedCardForm extends Component {
	render() {
		return (
			<div>
				<InputField
					label={"Name on Card"}
					name={"nameOnCard"}
					id={"name-on-card"}
					value={""}
					type={"textField"}
					placeholder={"JOHN SMITH"}
					ariaLabel={"nameOnCard"}
					onChange={this.changeField}
					disabled={false}
					error={null}
				/>
				<InputField
					label={"Card Number"}
					name={"cardNumber"}
					id={"card-number"}
					value={""}
					type={"textField"}
					placeholder={"0000 0000 0000 0000"}
					ariaLabel={"cardNumber"}
					onChange={this.changeField}
					disabled={false}
					error={null}
				/>
				<div className="row">
					<div className="col-4">
						<InputField
							label={"Expiry Date (MM)"}
							name={"expiryMonth"}
							id={"expiry-month"}
							value={""}
							type={"textField"}
							placeholder={"MM"}
							ariaLabel={"expiryMonth"}
							onChange={this.changeField}
							disabled={false}
							error={null}
						/>
					</div>
					<div className="col-4">
						<InputField
							label={"(YYYY)"}
							name={"expiryYear"}
							id={"expiry-year"}
							value={""}
							type={"textField"}
							placeholder={"YYYY"}
							ariaLabel={"expiryYear"}
							onChange={this.changeField}
							disabled={false}
							error={null}
						/>
					</div>
					<div className="col-4">
						<InputField
							label={"CVC / CVV"}
							name={"ccv"}
							id={"ccv"}
							value={""}
							type={"textField"}
							ariaLabel={"ccv"}
							placeholder={"3 or 4 Digits"}
							onChange={this.changeField}
							disabled={false}
							error={null}
						/>
					</div>
				</div>
				<Checkbox id="billingInfo" name="enableBillingInfo" value={null} onClick={null} disabled={false} label={"Enter optional billing address"} />
				<div className="row p-3 text-right">Total billed today ------------ $49.95</div>
				<button type="button" className="btn btn-primary btn-block">
					Subscribe
				</button>
			</div>
		);
	}
}
export default injectStripe(InjectedCardForm);
