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
    
    let metasty = {
      fontFamily: 'monospace',
      textAlign: 'center',
      width: '50vw',
    };

    return (
      <div className='centreTrue'>
        <p className='centre'>
          <img src='/titleLogo.svg' className='shadow noCopy' height='400' />
        </p>
        <div style={metasty}>
          <p>Neptune 1.5.2</p>
          <p>Copyright (c) 2016-present Commutron Industries <a href='https://www.commutron.ca' target='_blank'>https://www.commutron.ca</a></p>
          <p>Author 2016-present Matthew Andreas <a href='https://github.com/mattandwhatnot' target='_blank'>https://github.com/mattandwhatnot</a></p>
          <p>All Rights Reserved, No Public License</p>
          <p>Source avaliable <a href='https://github.com/commutron/neptune-dev' target='_blank'>https://github.com/commutron/neptune-dev</a></p>
        </div>
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