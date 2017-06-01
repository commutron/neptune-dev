import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';

export default class Chill extends Component	{

  brr() {
    Meteor.logout();
  }

  render() {
    return (
      <button className='cold navIcon' onClick={this.brr}>
        <i className="fa fa-sign-out fa-2x" aria-hidden="true"></i>
        <span className='icontext cap'>logout {this.props.name}</span>
      </button>
    );
  }
}