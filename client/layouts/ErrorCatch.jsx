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
      const size = window.innerWidth + 'px';
      const fngr = window.navigator.maxTouchPoints > 1 ? 'touch' : 'no-touch';
      const view = `${size} ${fngr}`;
    	const sessionID = Meteor.connection._lastSessionId;
    	Meteor.call('logReactError', sessionID, view, error.toString(), info.componentStack);
    }
  }
  
  sendToAdmin(e) {
    e.preventDefault();
    this.setState({ sendMess: true });
    const size = window.innerWidth + 'px';
    const fngr = window.navigator.maxTouchPoints > 1 ? 'touch' : 'no-touch';
    const view = `${size} ${fngr}`;
    const sessionID = Meteor.connection._lastSessionId;
  	
    Meteor.call(
      'sendErrorMail', 
      this.state.errorHeader, 
      this.state.errorTime,
      Meteor.user().username,
      view, sessionID,
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
            <button onClick={(e)=>this.sendToAdmin(e)} className='textLinkButton'
            >send</button> a notice to the Neptune admins.
          </p>
          {this.state.sendMess ? <p>Thank you for helping make Neptune better.</p> : null}
          <details>
            <summary>Read the boring details</summary>
            <div className='clean wordBr'>
              <em>{this.state.errorHeader}</em><br /><br />
              {this.state.errorTime}<br />
              username "{Meteor.user().username}"<br />
              view "{window.innerWidth}px {window.navigator.maxTouchPoints > 1 ? 'touch' : 'no-touch'}"<br />
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