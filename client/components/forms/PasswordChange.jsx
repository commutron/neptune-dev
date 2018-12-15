import React, {Component} from 'react';

export default class PasswordChange extends Component {
	
	constructor() {
		super();
		this.state = {
			choicePassword: false,
			confirmPassword: false,
			changeResult: ''
		};
	}

	doChange(e) {
	  e.preventDefault();
	  const passChoice = this.state.choicePassword;
	  const passConfirm = this.state.confirmPassword;
	  
	  if(passChoice === passConfirm) {
	    this.setState({changeResult: ""});
			Meteor.call('selfPasswordChange', passChoice, (error, reply)=>{
				if(error)
					console.log(error);
				if(reply) {
					this.setState({changeResult: 'saved'});
				}
			});
	  }else{
	    this.setState({changeResult: "the password fields don't match, try typing them in again"});
	  }
	}
	render() {
		
		let sty = {
			maxWidth: '240px'
		};
		
		return(
			<div className='invert'>
        <form 
          onSubmit={this.doChange.bind(this)}>
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
            <button
              type='submit'
              id='changeSubmit'
              className='action clearGreen'
             >Save New Password</button>
          </p>
	        <p style={sty}>{this.state.changeResult}</p>
	      </form>
      </div>
		);
	}
}