import React, {Component} from 'react';
import { Accounts } from 'meteor/accounts-base';
import { toast } from 'react-toastify';
import Tabs from '/client/components/smallUi/Tabs.jsx';

Accounts.onLogin( ()=>{
	let redirect = Session.get('redirectAfterLogin');
  if(!redirect || redirect === '/login' || redirect === '/limbo') {
  	null;
  }else {
    FlowRouter.go(redirect);
  }
});

export default class AccountsUI extends Component {
	
	constructor() {
		super();
		this.state = {
			loginStatus: Meteor.user(),
			loginUsername: false,
			loginPassword: false,
			newUsername: false,
			choicePassword: false,
			confirmPassword: false,
			organizationName: false,
			orgPin: false,
			loginResult: '',
			newUserResult: ''
		};
	}
	
	doLogout() {
		Meteor.logoutOtherClients();
		Meteor.logout( ()=>{
			this.setState({loginStatus: Meteor.user()});
		});
	}
	
	doLogin(e) {
	  e.preventDefault();
	  const user = this.state.loginUsername;
	  const pass = this.state.loginPassword;
		const redirect = Session.get('redirectAfterLogin');
	  
	  Meteor.loginWithPassword(user, pass, (error)=>{
	    if(error) {
	      console.log(error);
	      this.setState({loginResult: "Can't find a username with that password"});
	    }
	    if(!redirect || redirect === '/login') {
	    	this.setState({loginStatus: Meteor.user()});
	    	!error && this.setState({loginResult: ''});
	    }
	  });
	}

	doNew(e) {
	  e.preventDefault();
	  const user = this.state.newUsername;
	  const passChoice = this.state.choicePassword;
	  const passConfirm = this.state.confirmPassword;
	  const orgName = this.state.organizationName;
	  const orgPIN = this.state.orgPin;
	  
	  if(passChoice === passConfirm) {
	    Meteor.call('verifyOrgJoin', orgName, orgPIN, (error, reply)=>{
	      if(error)
	        console.log(error);
	      if(reply) {
	      	this.setState({newUserResult: ""});
	      	let options = {username: user, password: passChoice};
	      	Accounts.createUser(options, (error)=>{
	      		if(error) {
	      			console.log(error);
	      			toast.error('the server says no');
	      			this.setState({newUserResult: error.reason});
	      		}else{
	      			Meteor.call('joinOrgAtLogin', orgName, orgPIN, (error, reply)=>{
	      				if(error)
	      					console.log(error);
	      				if(reply) {
	      					reply === 'ok' ?
	      						toast.success('Everything worked corectly') :
	      						toast.error(`Not everything worked corectly. ${reply}`);
	      				}
	      			});
	      			const redirect = Session.get('redirectAfterLogin');
	      			if(!redirect || redirect === '/login') {
					    	this.setState({loginStatus: Meteor.user()});
					    }
	      		}
	      	});
		    }else{
		    	toast.error('the server says no');
		    	this.setState({newUserResult: "Can't find an organization with that PIN"});
		    }
	    });
	  }else{
	    toast.warning("the client says no match");
	    this.setState({newUserResult: "the password fields don't match, try typing them in again"});
	  }
	}
	render() {
		
		let style = {
			maxWidth: '240px',
		};
		
		return(
			<div>
		  
		  {this.state.loginStatus ?
        <div>
        	<p>Signed in as: {this.state.loginStatus.username}</p>
        	<p>
        		<button
        			id='logout'
        			className='action clearWhite wide'
        			onClick={this.doLogout.bind(this)}
        		>Sign Out</button>
        	</p>
        </div>
      :
      	<Tabs
	        tabs={['Sign In', 'New User']}
        	names={true}
        	wide={true}>
	        <form 
	          onSubmit={this.doLogin.bind(this)}>
	          <input type='hidden' value='autocompleteFix' autoComplete="new-password" />
	          <p>
	            <label htmlFor='loginUsername'>Username</label>
	            <br />
	            <input
	              type='text'
	              id='loginUsername'
	              onChange={()=>this.setState({loginUsername: loginUsername.value})}
	              placeholder='username'
	              required />
	          </p>
	          <p>
	            <label htmlFor='loginPassword'>Password</label>
	            <br />
	            <input
	              type='password' 
	              id='loginPassword'
	              onChange={()=>this.setState({loginPassword: loginPassword.value})}
	              placeholder='password'
	              required />
	          </p>
	          <p>
	            <input
	              type='submit'
	              id='loginSubmit'
	              className='blueBorder blueHover'
	              value='Sign In' />
	          </p>
	          <p style={style}>{this.state.loginResult}</p>
	        </form>
        
	        <form 
	          onSubmit={this.doNew.bind(this)}>
	          <input type='hidden' value='autocompleteFix' autoComplete='off' />
	          <p>
	            <label htmlFor='newUsername'>Username</label>
	            <br />
	            <input
	              type='text'
	              id='newUsername'
	              onChange={()=>this.setState({newUsername: newUsername.value})}
	              placeholder='username'
	              required
	              autoComplete="username" />
	          </p>
	          <p>
	            <label htmlFor='choicePassword'>New Password</label>
	            <br />
	            <input
	              type='password'
	              id='choicePassword'
	              onChange={()=>this.setState({choicePassword: choicePassword.value})}
	              placeholder='password'
	              required
	              autoComplete="new-password" />
	          </p>
	          <p>
	            <label htmlFor='confirmPassword'>New Password Again</label>
	            <br />
	            <input
	              type='password'
	              id='confirmPassword'
	              onChange={()=>this.setState({confirmPassword: confirmPassword.value})}
	              placeholder='password'
	              required
	              autoComplete="new-password" />
	          </p>
	          <p>
	            <label htmlFor='organizationName'>Organization</label>
	            <br />
	            <input
	              type='text' 
	              id='organizationName'
	              onChange={()=>this.setState({organizationName: organizationName.value})}
	              placeholder='Organization'
	              required />
	          </p>
	          <p>
	            <label htmlFor='orgPin'>Activation PIN</label>
	            <br />
	            <input
	              type='password'
	              id='orgPin'
	              onChange={()=>this.setState({orgPin: orgPin.value})}
	              pattern='[0000-9999]*'
	              maxLength='4'
	              minLength='4'
	              cols='4'
	              placeholder='PIN'
	              inputMode='numeric'
	              autoComplete='org-pin'
	              required />
	          </p>
	          <p>
	            <input
	              type='submit'
	              id='loginSubmit'
	              className='clearGreen greenBorder'
	              value='Create New User' />
	          </p>
	          <p style={style}>{this.state.newUserResult}</p>
	        </form>
	      </Tabs>
		  }
      </div>
		);
	}
}