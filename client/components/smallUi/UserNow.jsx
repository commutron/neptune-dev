import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';

export default class Chill extends Component	{

// this is not functioning without Tracker react
  render() {
    
    const user = Meteor.userId() ? Meteor.user() : undefined;
    const name = !user ? '...' : user.username;
    
    return (
      <i className='cap'>{name}</i>
    );
  }
}