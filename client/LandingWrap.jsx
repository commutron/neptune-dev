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
  let user = login ? Meteor.user() : false;
  let name = user ? user.username : false;
  let org = user ? user.org : false;
  if(!login) {
    return {
      login: Meteor.userId(),
    };
  }else{
    return {
      login: Meteor.userId(),
      user: name,
      org: org,
    };
  }
})(StartView);