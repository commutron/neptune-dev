import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

import SampleLine from './components/charts/SampleLine.jsx';
import Spin from './components/tinyUi/Spin.jsx';


class StartView extends Component	{
  
  render() {

    if(!this.props.login) {
      return (
        <div></div>
        );
    }

    return (
      <div className='space cap'>
        <p>user: {this.props.user}</p>
        <p>organization: {this.props.org}</p>
        <Spin />

        <SampleLine />
        <p className='centre'>
          <img src='/titleLogo.svg' width='600' />
        </p>
      </div>
    );
  }
}

export default createContainer( () => {
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
}, StartView);