import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
 
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL',
});

export default class AccountsUI extends Component {

	componentDidMount() {
	 	this.view = Blaze.render(Template.loginButtons,
	 		ReactDOM.findDOMNode(this.container)); 
	}

	componentWillUnmount() {
	 	Blaze.remove(this.view);     
	}

	render() {
		
		Session.set('Meteor.loginButtons.dropdownVisible', true);
		
		return (
		  <span ref={(i)=> this.container = i} />
		  );
	}
}