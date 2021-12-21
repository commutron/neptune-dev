import React, {Component} from 'react';

// Component Remains, no hook replacement for "componentDidCatch"
// as of november 2019

export default class ErrorCatch extends Component	{
  
  constructor() {
    super();
    this.state = {
      hasError: false,
      errorHeader: '',
      errorTime: '',
      errorInfo: '',
      sendMess: false
    };
  }
  
  componentDidCatch(error, info) {
    this.setState({ 
      hasError: true, 
      errorHeader: error.toString(), 
      errorTime: new Date().toString(),
      errorInfo: info.componentStack
    });
    if(Roles.userIsInRole(Meteor.userId(), 'debug')) {
      const agent = window.navigator.userAgent;
    	const sessionID = Meteor.connection._lastSessionId;
    	Meteor.call('logReactError', sessionID, agent, error.toString(), info.componentStack);
    }
  }
  
  sendToAdmin() {
    this.setState({ sendMess: true });
    const agent = window.navigator.userAgent;
  	const sessionID = Meteor.connection._lastSessionId;
  	
    Meteor.call(
      'sendErrorMail', 
      this.state.errorHeader, 
      this.state.errorTime,
      Meteor.user().username,
      agent, sessionID,
      this.state.errorInfo
    );
  }

  render() {
    if(this.state.hasError) {
      return(
        <div className='errorReport'>
          <h2>Oops, that didn't work</h2>
          <p>Don't worry its not something you did.&nbsp;
           <button onClick={()=>window.location.reload()} className='textLinkButton'
           > Reload</button> the page and try again or&nbsp;
            <button onClick={()=>{FlowRouter.go('/');window.location.reload();}} className='textLinkButton'>go home</button> and try again later. If you like,&nbsp;
            <button onClick={()=>this.sendToAdmin()} className='textLinkButton'
            >send</button> a notice to the Neptune admins.
          </p>
          {this.state.sendMess ? <p>Thank you for helping make Neptune better.</p> : null}
          <details>
            <summary>Read the boring details</summary>
            <div className='clean'>
              <em>{this.state.errorHeader}</em><br /><br />
              {this.state.errorTime}<br />
              username "{Meteor.user().username}"<br />
              user agent "{window.navigator.userAgent}"<br />
              Meteor session ID "{Meteor.connection._lastSessionId}"<br /><br />
              {this.state.errorInfo}
            </div>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}