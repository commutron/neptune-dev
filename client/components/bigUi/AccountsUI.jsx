import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
 
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL',
});

Accounts.onLogin( ()=>{
	let redirect = Session.get('redirectAfterLogin');
  if(!redirect || redirect === '/login' || redirect === '/activate') {
  	null;
  }else {
    FlowRouter.go(redirect);
  }
});

export default class AccountsUI extends Component {

	componentDidMount() {
	 	this.view = Blaze.renderWithData(Template.loginButtons, {align: 'right'},
	 		ReactDOM.findDOMNode(this.container)); 
	}

	componentWillUnmount() {
	 	Blaze.remove(this.view);     
	}

	render() {
		return(
		  <span ref={(i)=> this.container = i} />
		);
	}
}