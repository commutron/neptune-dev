import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';

export default class Chill extends Component	{

  brr() {
    Meteor.logout();
  }

  render() {
    
    const name = this.props.name ? this.props.name.split('.')[0] : '';
    
    return (
      <span className='actionIconWrap' title='Sign Out'>
        <input
          type='button'
          id='exitToggle'
          title='logout'
          onClick={this.brr}
          readOnly />
          <label htmlFor='exitToggle' id='exitSwitch' className='navIcon'>
            <i className='fa fa-user-times fa-2x' aria-hidden='true'></i>
            <span className='icontext cap'>{name}</span>
          </label>
      </span>
    );
  }
}