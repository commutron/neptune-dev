import React, {Component} from 'react';

export default class ErrorCatch extends Component	{
  
  constructor() {
    super();
    this.state = {
      hasError: false,
      errorHeader: '',
      errorTime: '',
      errorInfo: ''
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
    	const sessionID = Meteor.connection._lastSessionId;
    	Meteor.call('logReactError', sessionID, error.toString(), info.componentStack);
    }
  }
  
  sendToAdmin() {
    Meteor.call(
      'sendErrorMail', 
      this.state.errorHeader, 
      this.state.errorTime,
      Meteor.user().username,
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
            <a href='/'>go home</a> and try again later. If you like,&nbsp;
            <button onClick={()=>this.sendToAdmin()} className='textLinkButton'
            >send</button> a notice to the Neptune admins.
          </p>
          <details>
            <summary>Read the boring details</summary>
            <div className='clean'>
              <em>{this.state.errorHeader}</em><br />
              {this.state.errorTime}<br />
              username {Meteor.user().username}<br />
              {this.state.errorInfo}
            </div>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}