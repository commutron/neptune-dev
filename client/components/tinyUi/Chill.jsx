import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';

export default class Chill extends Component	{

  brr() {
    Meteor.logout();
  }

  render() {
    return (
      <span>
        <input
          type='button'
          id='exitToggle'
          onClick={this.brr}
          readOnly />
          <label htmlFor='exitToggle' id='exitSwitch' className='navIcon'>
            <i className='fa fa-sign-out fa-2x' aria-hidden='true'></i>
            <span className='icontext cap'>logout {this.props.name}</span>
          </label>
      </span>
    );
  }
}