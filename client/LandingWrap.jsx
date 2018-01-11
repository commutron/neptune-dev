import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

class StartView extends Component	{
  
  render() {

    if(!this.props.login) {
      return (
        <div>user not found</div>
        );
    }

    return (
      <div className='centreTrue'>
        <img src='/titleLogo.svg' className='shadow noCopy' height='500' />
      </div>
    );
  }
}

export default withTracker( () => {
  let login = Meteor.userId() ? true : false;
  let usfo = login ? Meteor.user() : false;
  let user = usfo ? usfo.username : false;
  let active = usfo ? Roles.userIsInRole(Meteor.userId(), 'active') : false;
  let org = usfo ? usfo.org : false;
  if(!login) {
    return {
      login: Meteor.userId(),
    };
  }else if(!active) {
    return {
      login: Meteor.userId()
    };
  }else{
    return {
      login: Meteor.userId(),
      user: user,
      org: org,
    };
  }
})(StartView);