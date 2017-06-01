import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
 
//Accounts.ui.config({
//  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL',
//});

export default class AccountsForm extends Component {

	componentDidMount() {
	 	this.view = Blaze.render(Template.atForm,
	 		ReactDOM.findDOMNode(this.refs.container));     
	}

	componentWillUnmount() {
	 	Blaze.remove(this.view);     
	}

	render() {
		return (
		  <span ref="container" />
		  );
	}
}