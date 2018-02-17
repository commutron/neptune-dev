import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
 
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL',
});

Accounts.onLogin( ()=>{
  let redirect = Session.get('redirectAfterLogin');
  if(redirect) {
    if(redirect === '/login') {
      null;
    }else{
      FlowRouter.go(redirect);
    }
  }else{
    null;
  }
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
		return(
		  <span ref={(i)=> this.container = i} />
		);
	}
}